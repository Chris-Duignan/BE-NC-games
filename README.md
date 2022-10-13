# Northcoders House of Games API

## Hosted Version

Please visit the hosted app at https://board-games-galore.herokuapp.com/api. This takes you to a dictionary of available endpoints which can be added to the URL to view the functionality of the app.

## Summary of the project

The aim of this project was to build an API to access app data. The database used is PSQL, which I interacted with using node-postgres.

The API is for a board game review database containing 4 tables: reviews, categories, users, and comments. This allows for users to post reviews and comment on each others reviews on various board games.

The technologies used include: 
- JS
- PSQL
- Node.js
- Express

## Set-up

Cloning: 

From your terminal enter the following command with the url to this repo to clone.

``` 
git clone repo_url
```

Create a new GitHub repository minus a readme, .gitignore, and license.

Navigate to your local cloned repo and push the code to your new repo using the following commands:

```
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
```

Installing dependecies:

From your cloned repo terminal, enter:

```
npm install
```

This will install all relevant packages using the depencies listed in the package.json.

Seed Local Database:

To seed the local database, run the following commands:

```
npm run setup-dbs
npm run seed
```

Testing:

To run the tests in __tests__, enter the following command in your terminal:

```
npm test
```


## Setting up .env Files

This repository contains both development and test databases to make use of. In order to access the correct database depending on whether you are currently testing or making use of the development database, you will need to set up 2 .env files.

To do this, first make 2 files at the root of the repo called .env.test and .env.development.

In each file, add the line PGDATABASE=<database_name_here> with the correct database name for that environment.

Add these files to your .gitignore and your env variables should now be set.

## Minimum Requirements

Node.js: 18.6.0,
Postgres: 14.5