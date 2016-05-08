'use strict';

/*=============================================>>>>>
= TYPINGS =
===============================================>>>>>*/

import * as _ from 'lodash';
import * as express from 'express';
import * as moment from 'moment';
import * as passport from 'passport';
import * as sequelize from 'sequelize';
import * as uuid from 'node-uuid';

/*= End of TYPINGS =*/
/*=============================================<<<<<*/

/*===============================
=            MODULES            =
===============================*/

import log from '../config/logging';

/*----------  FILTERS  ----------*/
import requireAuth from '../components/filters/requireAuth';
import checkJSON from '../components/filters/checkJSON';
import rules from '../components/models/rules';

/*----------  SERVICES  ----------*/
import * as Security from '../components/services/security';
import Handles from '../components/services/handles';
import db from '../components/models';

/*----------  MODELS  ----------*/

const Models = new db();

/*=====  End of MODULES  ======*/

/*=============================================>>>>>
= DB MODELS =
===============================================>>>>>*/

const Users = Models.Users;

/*= End of DB MODELS =*/
/*=============================================<<<<<*/

/**
 * Collection of REST endpoints for managing Users
 * @return {Object} Express Router
 */
export default function UserRoutes(app: express.Application) {
  /*----------  BEGIN ROUTES  ----------*/
  const router = require('express').Router();

  /*================================
  =            GET USER            =
  ================================*/

  /**
   * Gets User from the Active Passport Session
   * @param {String}   '/' url path
   * @param {Function}     callback to execute with HTTP Request and Response
   */
  router.get('/user/token', (req: express.Request, res: express.Response) => {
    return res.json({
      token: req.user
    });
  });

  /*=====  End of GET USER  ======*/


  /*====================================
  =            SIGNUP/LOGIN            =
  ====================================*/

  /**
   * Register a new user
   * @param  {String} '/signup'               url path
   * @param  {Function} checkJSON(Rules.User) verifies the JSON in the request body
   * @param  {Function} (req, res)            callback to execute with the HTTP request and response
   * @return {Object}                         the json response
   */
  router.post('/signup', checkJSON(rules.UserSignup), (req: express.Request, res: express.Response) => {
    // Encrypt password before saving
    req.body.password = Security.encrypt(req.body.password);
    // Add an api token
    req.body.token = uuid.v4();

    log.debug(`Preparing new user with API Token: ${req.body.token}`);
    // Create new record
    Users.create(req.body).then((user: any) => {
      log.debug(`--->>> New User Created: ${user.get('token')}`);
      return Handles.CREATED(res, 'Successfully created new User', _.omit(user.toJSON(), ['password', 'id', 'updated_at', 'created_at']));
    }).catch((err: sequelize.BaseError) => {
      log.debug(err.message);
      log.debug(err.stack);
      return Handles.BAD_REQUEST(res, 'Failed to create new User', err.message);
    });
  });

  /**
   * Verifies the users login using the Passport-Local Strategy
   * @param  {String} '/login'                            url path
   * @param  {Function} ensureValidJSON(Users.loginCreds) verifies the JSON in the request body
   * @param  {Function} passport.authenticate('local')    verifies the JSON contains a valid login
   * @param  {Function} (req, res)                        callback to execute with the HTTP request and response
   * @return {Function}                                   the json response
   */
  router.post('/login', checkJSON(rules.UserLogin), passport.authenticate('local'), (req: express.Request, res: express.Response) => {
    log.debug(`Login Successful for User: ${req.user}`);
    return Handles.SUCCESS(res, 'Login Successful', req.user);
  });

  /**
   * Destroys the users session stored with Passport-Local Strategy
   * @param  {String} '/logout'    url path
   * @param  {Function} (req, res) callback to execute with the HTTP request and response
   * @return {Function}            the json response
   */
  router.get('/logout', (req: express.Request, res: express.Response) => {
    log.debug(`Logging out for User: ${req.user}`);
    req.session.regenerate(err => {
      res.redirect('/');
    });
  });

  /*=============================
  =            USER            =
  =============================*/

  /**
   * Returns the User Object
   * @param  {String} '/user'     url path
   * @param  {Function} requireAuth verifies the user
   * @param  {Function} (req, res)  the callback to execute with the HTTP request and response
   * @return {Object}               the json response
   */
  router.get('/user', requireAuth, (req: express.Request, res: express.Response) => {
    const token = req.user || req.headers['authorization'];

    Users.findOne({
      where: { token: token }
    }).then((user: any) => {
      if (req.user !== null) {
        // Found user
        return Handles.SUCCESS(res, 'Found User', _.omit(user.toJSON(), ['password', 'id', 'updated_at', 'created_at']));
      } else {
        // No user exists
        return Handles.BAD_REQUEST(res, 'No user found', null);
      }
    });
  });

  /**
   * Updates the user
   * @param  {String} '/user'                                url path
   * @param  {Function} requireAuth                          verifies the user
   * @param  {Function} ensureValidJSON(Users.updateColumns) verifies the JSON content of the request body
   * @param  {Function} (req, res)                           the callback to execute with the HTTP request and response
   * @return {Object}                                        the json response
   */
  router.put('/user', requireAuth, checkJSON(rules.UserUpdate), (req: express.Request, res: express.Response) => {
    if (req.body.password) {
      return Handles.BAD_REQUEST(res, 'Password Field is not updateable. Please use the /update-password endpoint', null);
    } else {
      const token = req.user || req.headers['authorization'];

      Users.findOne({
        where: { token: token }
      }).then((user: any) => {
        // Update user (except for password)
        user.set(_.omit(req.body, 'password')).save().then(() => {
          return Handles.SUCCESS(res, 'Update Successful');
        });
      }).catch((err: any) => {
        // Error
        return Handles.SERVER_ERROR(res, 'Failed to update user', err.message);
      });
    }
  });

  /**
   * Updates the users password
   * @param  {String} '/user/update-password'           url path
   * @param  {Function} requireAuth                     verifies the user
   * @param  {Function} ensureValidJSON([ 'password' ]) verifies the JSON content of the request body
   * @param  {Function} (req, res)                      the callback to execute with the HTTP request and response
   * @return {Object}                                   the json response
   */
  router.post('/user/update-password', requireAuth, checkJSON({ password: 'required' }), (req: express.Request, res: express.Response) => {
    const token = req.user || req.headers['authorization'];

    if (req.body.password.length > 0) {
      // Update the user
      Users.findOne({
        where: { token: token }
      }).then((user: any) => {
        user.set('password', Security.encrypt(req.body.password)).save().then(() => {
          return Handles.SUCCESS(res, 'Updated Password Successfully');
        });
      });
    } else {
      return Handles.BAD_REQUEST(res, 'New Password is empty');
    }
  });

  /*----------  END ROUTES  ----------*/


  return router;
};
