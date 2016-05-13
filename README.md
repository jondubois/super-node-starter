## Super Node Starter

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/gigster-eng/super-node-starter)

### Server Frameworks

- Typescript
- Sequelize

### Details

A complete NodeJS server starter template. This template is designed to give any NodeJS project an extreme running start that includes some of the most common features vital to the Client/Server relationship model while providing various other tools, and resources for quickly building out any part of the server development stack.

Please refer to the [CONTRIBUTING.md](https://github.com/gigster-eng/super-node-starter/blob/master/CONTRIBUTING.md) doc for any questions, concerns, or suggestions

#### Running For Development

**a. Install dependencies**

```sh
npm install
```

**b. Provide a `.env` file (copy the template) and provide you own values**

```sh
cp .env.example .env
```

Create a local relational database in MySQL/Postgres/etc (see sequelize for supported dialects) and fill out the env values to connect there.

**c. Run the database migrations**

```sh
sequelize db:migrate
```

Note: You may want to install an editor plugin to automatically do this for you on file save, like atom-typescript

**d. Run the app!**

```sh
npm start
```

**e. Linting your code while developing**

Linting is dealt with by eslint, jshint and tslint. There are config files for those in the repo. You should install editor plugins to do this easily and automatically for you as you code and save files (e.g. for atom):

```sh
apm install eslint
apm install linter
apm install linter-jshint
apm install linter-eslint
apm install linter-tslint
```

#### Local Docker Deployment

**a. Provide a `.env` file (copy the template) and provider you own values**

```sh
cp .env.example .env
```

**b. Build the Docker Image for super-node-starter**

```sh
docker build -t super-node-starter:v1 .
```

**c. Pull the sns-postgres image from DockerHub (this is a Postgres image which is specially configured to work with this project).
Note that the repository tag may change at some point in the near future.**

```sh
docker pull jondubois/sns-postgres:v1
```

**d. Run the sns-postgres container**

```sh
docker run -d --name some-sns-postgres -p 5432:5432 jondubois/sns-postgres:v1
```

**e. Run the app (and link it to our Postgres container)**

```sh
docker run -d --name some-super-node-starter --link some-sns-postgres super-node-starter:v1
```

Below is a list of all the supported features:

#### Docker Deployment to Rancher (Comming soon)

Rancher is a system (and UI control panel) for managing infrastructure using technologies such as Docker, Docker Swarm, and Kubernetes. It has the potential to greatly simplify the deployment of software to remote infrastructure and encourage efficient reuse of components via containers.

Pulling containers on the remote host:

The following image (jondubois/sns-postgres:v1) allows you to launch a Postgres container which is setup to automatically work with a super-node-starter container.
You shouldn't need to modify this image; you can just pull it straight from DockerHub (or wherever we will end up hosting it).

```sh
docker run -d --name some-sns-postgres -p 5432:5432 jondubois/sns-postgres:v1
```

The following image is just a really basic super-node-starter sample. You should build your own image from the super-node-starter repo and then
publish it to a Docker image registry (more detais on this coming soon). See section on Local Docker Deployment above for instructions on how
to build your ownimage.

```sh
// docker run -d --name some-super-node-starter --link some-sns-postgres -p 3000:3000 dockerhub-username/super-node-starter:v1
```

Note that there are plans to simplify the deployment of SNS down to a single command.

#### Middleware Tools
1. Application Logging using Winston
2. CORS Security Headers
3. PassportJS for Session Management
4. Reading Cookies in the Request
5. HTTP Method Overriding for customer headers
6. Body Parsing to provide all content as JSON in `req` object
7. Multiple Security Middleware Filters

#### Server Side Tools
1. Response Handler with HTTP Status Codes
2. Semantic Folder Structure
3. Sequelize for SQL query building + connecting to relational DBs

#### Code Quality Tools
1. CodeClimate yaml file
2. CircleCI yaml file
3. ESLint Config File to manage code consistency
4. Editor Config File to enforce code indentation
5. Git dotfiles to better manage git history
6. Typescript for easy development and strongly typed definitions

#### Additional
2. Gulp for task management + additional tasks for:
	a. Detecting vulnerable modules in `package.json`
