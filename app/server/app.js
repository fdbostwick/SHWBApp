const express = require('express')
const nedb = require("nedb");
const http = require("http");
const fs = require("fs");
const path = require("path");

var currentDir = __dirname;

// user data db stores questionaire answers
// user access tokens
// and other variables
global.userDataDB = new nedb({ filename: currentDir + "/userData.db", autoload: true });
// userDataDB [{username: null, accessTokens: []}, answers: []}]
// accessTokens [{accessToken: null, expireDate: Date, deviceId: null},]
// answers [{questionId: null, choiceId: null, time: null}]

global.qualtricsDB = new nedb({ filename: currentDir + "/qualtrics.db", autoload: true });
// qualtricsDB [{questionId: null, questionText: null, questionTag: null, choices: []}]
// choices [{'choiceId': choiceText}]

// User profile db stores "static" information
// like credentials, name, gender which aren't changed frequently
// the reason I seperate it with userDataDB is because
// I want to keep it small so we can backup it easily

// userProfileDB structure
// I dont store the real password for security reason
// one raw for one user, need to be changed in the furture
// userProfileDB {{username: null, hashedPassword: null, email: null, name: null}, }
// one user can have mutiple access tokens

global.userProfileDB = new nedb({ filename: currentDir + "/userProfile.db", autoload: true });


// Assign addresses to routers
// Each router is a module
// load one time only and keeps it's context within it's own scope
// Databases are initialized within routers
// There should be a better way to do this
var app = express();
app.use(express.json());
app.set('trust proxy', 1);
const userRouter = require("./user-route");
const qualtricsRouter = require("./qualtrics-route");
app.post('/login', userRouter.router);
app.post('/register', userRouter.router);
app.get('/api/getUserInfo', userRouter.router);
app.post('/api/resetUserScores', userRouter.router);
app.get('/api/getAllQuestions', qualtricsRouter);
app.get('/api/getQuestionsFromBlock/:blockName', qualtricsRouter);
app.post('/api/createResponse', qualtricsRouter);


// Start the web server
// Add HTTPS support later, ask for domain as well
const port = 8888;
http.createServer(app).listen(port, () => console.log(`Server listening on port ${port}!`));

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
    console.log(err.stack);
});