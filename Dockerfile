# 1. Pulling the docker images we need
FROM node:6.1.0
MAINTAINER Stephen Rodriguez <@stephnr>

# 2. Labelling the docker image version/details
LABEL version="1.0"
LABEL description="Simple NodeJS Dockerfile. Executes `npm start` to run your app"

###################################
######      SETUP STACK      ######
###################################

# 3. Setup the application folder
RUN mkdir -p /usr/src/app

# 4. Change our working directory
WORKDIR /usr/src/app

# 6. Provide Environment Properties
ENV NODE_ENV=production

# 7. Clone the Super Node Project
RUN git clone https://github.com/gigster-eng/super-node-starter

# 8. Install Dependencies (not devDependencies)
RUN npm install

###################################
######      EXPOSE PORT      ######
###################################

# 9. Expose the app on port 80
EXPOSE 80

###############################
######      RUN APP      ######
###############################

# 10. Run the application specific build/run commands
CMD [ "npm", "start" ]
