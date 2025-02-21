# Itishagroup Transactions Backend APIs
This is the Itishagroup Transactions backend project

## Tech stack

- <a href="https://expressjs.com/" target="_blank">Express</a> web framework
- <a href="https://nodejs.org/en/download/prebuilt-installer" target="_blank">Node.js</a> v22.14.0
- <a href="https://pnpm.io/" target="_blank">Pnpm</a> Package Manager (v10.4.1)
- <a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a> database management system (version 14 and above is preferred)
- <a href="https://typeorm.io/" target="_blank">TypeORM</a> as the Object Relational Mapper (ORM)
- <a href="https://tsoa-community.github.io/docs/" target="_blank">tsoa</a> for generating OpenAPI docs for the project

## Project setup
- Clone this repository to your machine
- Run `pnpm i` from the project directory to install the project dependencies
- Setup a PostgreSQL database on your machine
- Create an `.env` file at the root of the project directory and fill it with the contents available in [.env.example](/.env.example). (***NOTE: Replace the values with square branckets with your own values***)

## Database Setup
### Making Database Migrations
Run the command below to create database tables as defined by the project's entities.

_(NOTE: Make sure you have already created the database)_
The other TypeORM migration scripts are found in the scripts section of the [package.json](./package.json) file.
```bash
$ pnpm migration:run # making TypeORM migrations from .ts config file (dev mode)
```

## Running the app
Use one of the options below to run the app

```bash
# development (watch mode)
$ pnpm tsoa && pnpm start:dev
```

## Generating TypeORM migration files
To generate migration files based on model changes, run the command below from the root directory of the project
```bash
$ pnpm migration:generate ./src/migrations/[YOUR_MIGRATION_NAME] # eg. pnpm migration:generate ./src/migrations/CreateUser

```

## REST API Documentation
The REST API documentation can be found by visiting `/docs` after running the project.

For routes requiring authentication (e.g `/api/v1/transactions`), make sure the `Authorization` value is in the format `Bearer xxx`, where the`xxx` is your access token returned after successful login

## TODOs
The following are some improvements that could be made:
- [ ] Robust API error handling - Returning specific error codes and messages to the clients. Currently majority of the API errors have status 500
- [ ] Robust Dependency Injection (DI) system - Configuring and using an IoC for Dependency Injection. Currently dependencies are manually injected
- [ ] Implementing Rate limiting to prevent API abuse
- [ ] Using Redis for caching transaction history responses

## Final Words
Happy Coding ☕ 😄