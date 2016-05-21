# 1. Pulling the docker images we need
FROM node:6.1.0
MAINTAINER Stephen Rodriguez <@stephnr>

# 2. Labelling the docker image version/details
LABEL version="1.0"
LABEL description="Simple NodeJS Dockerfile. Executes `npm start` to run your app"

###################################
######      SETUP STACK      ######
###################################

# Setup the application folder
RUN mkdir -p /usr/src/app

# Change our working directory
WORKDIR /usr/src/app

# Provide Environment Properties
ENV NODE_ENV=production

# Bundle app source
COPY . /usr/src/app

# Install Dependencies (not devDependencies)
RUN npm install

# Install global dependencies
RUN npm install -g typescript@1.8.10
RUN npm install -g typings@0.8.1
RUN typings install
RUN tsc
RUN npm install -g webpack
RUN npm install -g foreman

# Open the http port
EXPOSE 3000

###############################
######      RUN APP      ######
###############################

# Run the application specific build/run commands
CMD [ "npm", "start" ]
