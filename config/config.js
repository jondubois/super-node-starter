/* eslint no-magic-numbers:0 */

'use strict';

/*=============================================>>>>>
= SEQUELIZE MIGRATIONS CONFIGURATIONS =
===============================================>>>>>*/

require('dotenv').config();

// Parse the Heroku type database URL to retrieve the vars
const CREDENTIALS = process.env.DATABASE_URL.split('/')[ 2 ].split('@').shift().split(':');
const DATABASE = process.env.DATABASE_URL.split('/').pop();
const HOST = process.env.DATABASE_URL.split('/')[ 2 ].split('@').pop().split(':').shift();
const ENGINE = process.env.DATABASE_ENGINE;

module.exports = {
  username: CREDENTIALS[ 0 ],
  password: CREDENTIALS[ 1 ],
  database: DATABASE,
  host:     HOST,
  dialect:  ENGINE
};

/*= End of SEQUELIZE MIGRATIONS CONFIGURATIONS =*/
/*=============================================<<<<<*/
