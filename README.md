# Northcoders House of Games API

## Setting up .env Files

This repository contains both development and test databases to make use of. In order to access the correct database depending on whether you are currently testing or making use of the development database, you will need to set up 2 .env files.

To do this, first make 2 files at the root of the repo called .env.test and .env.development. 

In .env.test, the following line must be added: PGDATABASE=nc_games_test

In .env.development, add the following line: PGDATABASE=nc_games

Your environment variables should now be created.

## GET /api/categories 

This endpoint will return an array of categories from the categories database.

## GET /api/reviews/:review_id

This endpoint will return a single review by specified id e.g. /api/reviews/1 will return the review with review_id 1. Review Id must be entered as a digit.