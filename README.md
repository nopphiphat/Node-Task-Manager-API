# Node Weather website

Andrew Mead - The Complete Node.js Developer Course

## Description

Created a task-manager website using Node.js, Express, Mongoose, Postman, MongoDB Atlas, and [SendGrid](https://sendgrid.com/) - Email Delivery Service.

## Deployed

The application is deployed on Heroku, [https://nopi-task-manager.herokuapp.com/](https://nopi-task-manager.herokuapp.com/). User can install [Postman](https://www.postman.com/) and config it to my Heroku website to perform CRUD operations using GET, POST, PATCH, DELETE on the Mongodb Atlas Database.

## Installing

After downloading or cloning the repo, execute the following steps:

1) Open the project folder at the root in your terminal and run `npm install` to download the necessary dependencies needed for this project.

2) Run `npm run start` to run the Express server which defaults to localhost:3000. Alternatively, run `npm run dev` to enter development mode.

3) Run `npm test` to run the testing of the functionalities. To recreate the test environments, create folder "config" in the "task-manager" folder (making it adjacent to "src" folder). Then create files: "test.env" and "dev.env"

## "dev.env" should include:
PORT=3000\
SENDGRID_API_KEY=<your sendgrid API key>\
MONGODB_URL=<mongodb://127.0.0.1:27017/<db_name_for_your_development>>\
JWT_SECRET=<anything you want>\
SENDGRID_EMAIL=<your sendgrid email>

## "test.env" should include:
PORT=3000\
SENDGRID_API_KEY=<your sendgrid API key>\
MONGODB_URL=<mongodb://127.0.0.1:27017/<db_name_for_your_test>>\
JWT_SECRET=<anything you want>\
SENDGRID_EMAIL=<your sendgrid email>

## Built With

- [Node.js](https://nodejs.org/en/) - JavaScript runtime
- [Express](https://expressjs.com/en/4x/api.html#express) - Server Framework
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Authentication
- [mongoose](https://www.npmjs.com/package/mongoose) - Mongoose
- [validator](https://www.npmjs.com/package/validator) - Type Validators (e.g. emails, etc.)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Token
- [multer](https://www.npmjs.com/package/multer) - Node.js Middleware
- [sharp](https://www.npmjs.com/package/sharp) - Files and Images formatting (e.g. JPEG, JPG, PNG, PDF, DOC, DOCX, etc.)
- [env-cmd](https://www.npmjs.com/package/env-cmd) - Config environment variables
- [jest](https://www.npmjs.com/package/jest) - JavaScript testing
- [supertest](https://www.npmjs.com/package/supertest) - High-level abstract testing 
- [SendGrid](https://sendgrid.com/) - Email Delivery Service
- [Postman](https://www.postman.com/) - Postman
- [Mongodb Atlas](https://www.mongodb.com/cloud/atlas) - Mongodb Atlas (DaaS:Database-as-a-Service)
- [Heroku](https://dashboard.heroku.com/apps) - Deployment platform

## Re-creator

- **Nopphiphat Suraminitkul** - [Github](https://github.com/nopphiphat)

## Acknowledgements

- **Andrew Mead**, at [mead.io](https://mead.io/), who made this excellent Node.js course on [Udemy](https://www.udemy.com/the-complete-nodejs-developer-course-2/)

