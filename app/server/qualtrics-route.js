const express  = require('express');
const router = express.Router();
const userRouter = require("./user-route");
const fetch = require("node-fetch");

const HTTPProtocol = 'https';
const ServerHostName = 'universityofalabama.az1.qualtrics.com';
const ServerPortNumber = null;
const DefaultPostRequestTimeout = 10000;
const APIToken = "fcH9LuoEtElwIpFhB4nZFwHtnc5thWkjqhfCXYzP";
const SurveyId = "SV_4G7Q5ay8Oh9RpWt";

var currentDir = __dirname;

// createSession()
//     .then((responseJson) => {
//             console.log(responseJson)
//             autoAnswerQuestions(responseJson);
//     })
//     .catch((error) => console.log(error));
getAllQuestions()
    .then((responseJson) => processAllQuestions(responseJson))
    .catch((error) => console.log(error));
// retrieveResponse("R_ZI5RKJZCkRlZauJ")
//     .then((responseJson) => console.log(responseJson))
//     .catch((error) => console.log(error));
// retrieveResponse("R_3NwZM0pNuiqnbsr")
//     .then((responseJson) => console.log(responseJson))
//     .catch((error) => console.log(error));
    
// createResponse("1.1.1.1",{"QID99": 1})
//     .then((responseJson) => console.log(responseJson))
//     .catch((error) => console.log(error));

router.get('/api/getAllQuestions', function (req, res) {
    var accessToken = req.headers["x-access-token"];
    userRouter.getUsernameByAccessToken(accessToken, function (errorPacket, username) {
        if (errorPacket) return res.end(JSON.stringify(errorPacket));
        global.qualtricsDB.find({}, function (error, questions) {
            if (error) return res.end(JSON.stringify(basicPacket(false, 16, "failed to read database")));
            var successPacket = basicPacket(true, null, "Succefully get all questions");
            successPacket.questions = questions;
            res.end(JSON.stringify(successPacket));
        });
    })
});
router.get('/api/getQuestionsFromBlock/:blockName', function (req, res) {
    var accessToken = req.headers["x-access-token"];
    userRouter.getUsernameByAccessToken(accessToken, function (errorPacket, username) {
        if (errorPacket) return res.end(JSON.stringify(errorPacket));
        var blockName = req.params.blockName.trim();
        var matchBlock = new RegExp("^" + blockName, "i");
        global.qualtricsDB.find({questionTag: {$regex: matchBlock}}, function (error, questions) {
            if (error) return res.end(JSON.stringify(basicPacket(false, 16, "failed to read database")));
            var successPacket = basicPacket(true, null, "Succefully get all questions");
            successPacket.questions = questions;
            res.end(JSON.stringify(successPacket));
        });
    })
});

router.post('/api/createSession', function (req, res) {
    var accessToken = req.headers["x-access-token"];
    userRouter.getUsernameByAccessToken(accessToken, function (errorPacket, username) {
        if (errorPacket) return res.end(JSON.stringify(errorPacket));
        global.qualtricsDB.find({}, function (error, questions) {
            if (error) return res.end(JSON.stringify(basicPacket(false, 16, "failed to read database")));
            var successPacket =  basicPacket(true, null, "Succefully get all questions");
            successPacket.questions = questions;
            res.end(JSON.stringify(successPacket));
        });
    })
    
});

router.post('/api/createResponse', async function (req, res) {
    var accessToken = req.headers["x-access-token"];
    userRouter.getUsernameByAccessToken(accessToken, async function (errorPacket, username) {
        if (errorPacket) return res.end(JSON.stringify(errorPacket));
        console.log(req.body);
        if (!req.body.idChoicePairs) return res.end(JSON.stringify(basicPacket(false, 15, "idChoicePairs cannot be empty")));
        var ipAddress = req.connection.remoteAddress.replace(/^.*:/, '');
        var idChoicePairs = req.body.idChoicePairs;
        idChoicePairs = await idChoicePairsFix(idChoicePairs);
        createResponse(ipAddress, idChoicePairs)
        .then(() => {
            var successPacket =  basicPacket(true, null, "Succefully create response");
            res.end(JSON.stringify(successPacket));
            global.userDataDB.findOne({username: username}, async function (error, userData) {
                if (error) return console.log(error);
                if (userData.scores == undefined || userData.scores["soc"] == undefined) userData.scores = initializeUserScores();
                userData.scores = await updateUserScores(userData.scores, idChoicePairs);
                for (var key in idChoicePairs) {
                    userData.answers.push({qid: key, choiceId: idChoicePairs[key], time: Date.now()});
                }
                
                global.userDataDB.update({ username: username }, userData, {}, function (error, numReplaced) {
                    if (error)  return console.log(error);
                });
            });
        })
        .catch((error) => sendInternalServerErrorPacket(res, error));
        

    })
    
});
function idChoicePairsFix(idChoicePairs) {
    return new Promise(function (resolve) {
        var total = Object.keys(idChoicePairs).length;
        var current = 0;
        var newIdChoicePairs = {};
        for (var key in idChoicePairs) {
            global.qualtricsDB.findOne({questionId: key}, function (error, question) {
                current ++;
                var recodes = question.recodeValues;
                newIdChoicePairs[key] = parseInt(recodes[idChoicePairs[key]]);
                if (current == total) resolve(newIdChoicePairs);
            });
        }
        
    });
}
function initializeUserScores() {
    var scores = {};
    scores["soc"] = { numResponses: 0, accumulatedScore: 0, averageScore: 0};
    scores["phys"] = { numResponses: 0, accumulatedScore: 0, averageScore: 0};
    scores["car"] = { numResponses: 0, accumulatedScore: 0, averageScore: 0};
    scores["fin"] = { numResponses: 0, accumulatedScore: 0, averageScore: 0};
    scores["acad"] = { numResponses: 0, accumulatedScore: 0, averageScore: 0};
    scores["spir"] = { numResponses: 0, accumulatedScore: 0, averageScore: 0};
    scores["psyc"] = { numResponses: 0, accumulatedScore: 0, averageScore: 0};

  
    return scores;
}
async function updateUserScores(scores, idChoicePairs) {
    return new Promise(async (resolve, reject) => {
        for (var key in idChoicePairs) {
            var result = await getBlockNameAndHighestScore(key);
            var choiceValue = parseInt(idChoicePairs[key]);
            scores[result.blockName].numResponses ++;
            scores[result.blockName].accumulatedScore += choiceValue/result.highestScore;
            scores[result.blockName].averageScore = scores[result.blockName].accumulatedScore / scores[result.blockName].numResponses;
        }
        resolve(scores);
    });
}
function getBlockNameAndHighestScore(qid) {
    return new Promise(function (resolve, reject) {
        global.qualtricsDB.findOne({questionId: qid}, function (error, question) {
            if (error) return reject(error);
            var blockName = question.questionTag.replace(/[0-9]/g, "").toLowerCase();
            var highestScore = -1;
            for (var key in question.choices){
                var choiceValue = parseInt(key);
                if (highestScore < choiceValue) highestScore = choiceValue;
            }
            resolve({blockName: blockName, highestScore: highestScore});
        });
    })
}
function createResponseFromQuestion(question, choiceId) {
    var resp = {[question.questionId] : {
        [choiceId]: {
            "selected": true
        }
    }};
    return resp;    
}

function autoAnswerQuestions(responseJson) {
    updateSession(responseJson, createResponseFromQuestion(responseJson.result.questions[0], "1"))
    .then((responseJson) => {
        var isDone = responseJson.result.done;
        if (isDone != false) closeSession(responseJson);
        else autoAnswerQuestions(responseJson)
    })
    .catch((error) => console.log(error));
}

function processAllQuestions(response) {
    global.qualtricsDB.remove({}, { multi: true }, function (error) {
        if (error) return console.log(error);
        response.result.elements.forEach(question => {
            var cleanQuestionText = question.QuestionText.replace(/<[^>]*>?/gm, '')
                                                        .replace(/[\r\n]+/gm, ' ')
                                                        .replace(/&nbsp;/gi,"").trim();
            // var recodeChoices = {};
            // for (var key in question.Choices) {
            //     recodeChoices[question.RecodeValues[key]] = question.Choices[key];
            // }

            var item = {questionId: question.QuestionID, questionText: cleanQuestionText, questionTag: question.DataExportTag, choices: question.Choices, recodeValues: question.RecodeValues};
            global.qualtricsDB.insert(item);
        });
        console.log(response.result);
    });
}
function getAllQuestions() {
    var fullUrl = HTTPProtocol + '://' + ServerHostName
    if (ServerPortNumber != null) fullUrl += (':' + ServerPortNumber);
    fullUrl += "/API/v3/survey-definitions/"+SurveyId+"/questions";
    return new Promise (function (resolve, reject) {
        setTimeout(()=> reject(basicPacket(false, 1, 'Network request timeout')), DefaultPostRequestTimeout);
        var headers = {
            'X-API-TOKEN': APIToken,
        };
        fetch(fullUrl, {method: 'GET', headers: headers})
            .then((response) => {
                if (response.status != 200) return reject(basicPacket(false, 5, 'Network request failed, code: ' + response.status));
                response.json()
                .then((responseJson) => resolve(responseJson))
            })
            .catch((error) => {
                console.log(error);
                reject(basicPacket(false, 2, 'Network request failed'))
            });
    });
}
function createSession() {
    var fullUrl = HTTPProtocol + '://' + ServerHostName
    if (ServerPortNumber != null) fullUrl += (':' + ServerPortNumber);
    fullUrl += "/API/v3/surveys/"+SurveyId+"/sessions";
    return new Promise (function (resolve, reject) {
        setTimeout(()=> reject(basicPacket(false, 1, 'Network request timeout')), DefaultPostRequestTimeout);
        var headers = {
            'X-API-TOKEN': APIToken,
            'Content-Type': 'application/json',
        };
        var body = {
            "language": "EN",
            "embeddedData": {
                   "username": "hfang"
            } 
        };
        fetch(fullUrl, {method: 'POST', headers: headers, body: JSON.stringify(body)})
            .then((response) => {
                if (response.status != 200 && response.status != 201) return reject(basicPacket(false, 5, 'Network request failed, code: ' + response.status));
                response.json()
                .then((responseJson) => resolve(responseJson))
            })
            .catch((error) => {
                console.log(error);
                reject(basicPacket(false, 2, 'Network request failed'))
            });
    });
}
function updateSession(session, responses) {
    var fullUrl = HTTPProtocol + '://' + ServerHostName
    if (ServerPortNumber != null) fullUrl += (':' + ServerPortNumber);
    fullUrl += "/API/v3/surveys/"+SurveyId+"/sessions/" + session.result.sessionId + "/#";
    return new Promise (function (resolve, reject) {
        
        var headers = {
            'X-API-TOKEN': APIToken,
            'Content-Type': 'application/json',
        };
        var firstQuesiton = session.result.questions[0];
        var body = {
                        "advance": true,
                        "embeddedData": {
                            "username": "hfang"
                        },
                        "responses": responses
                    };
        //console.log(body);
        setTimeout(()=> reject(basicPacket(false, 1, 'Network request timeout')), DefaultPostRequestTimeout);
        fetch(fullUrl, {method: 'POST', headers: headers, body: JSON.stringify(body)})
            .then((response) => {
                if (response.status != 200 && response.status != 201) return reject(basicPacket(false, 5, 'Network request failed, code: ' + response.status));
                response.json()
                .then((responseJson) => {
                    console.log(responseJson)
                    resolve(responseJson);
                })
            })
            .catch((error) => {
                console.log(error);
                reject(basicPacket(false, 2, 'Network request failed'))
            });
    });
}
function closeSession(session) {
    var fullUrl = HTTPProtocol + '://' + ServerHostName
    if (ServerPortNumber != null) fullUrl += (':' + ServerPortNumber);
    fullUrl += "/API/v3/surveys/"+SurveyId+"/sessions/" + session.result.sessionId;
    return new Promise (function (resolve, reject) {
        setTimeout(()=> reject(basicPacket(false, 1, 'Network request timeout')), DefaultPostRequestTimeout);
        var headers = {
            'X-API-TOKEN': APIToken,
            'Content-Type': 'application/json',
        };
        var body = {"close": true};
        fetch(fullUrl, {method: 'POST', headers: headers, body: JSON.stringify(body)})
            .then((response) => {
                if (response.status != 200 && response.status != 201) return reject(basicPacket(false, 5, 'Network request failed, code: ' + response.status));
                response.json()
                .then((responseJson) => resolve(responseJson))
            })
            .catch((error) => {
                console.log(error);
                reject(basicPacket(false, 2, 'Network request failed'))
            });
    });
}
function createResponse(ipAddress, idChoicePairs) {
    var fullUrl = HTTPProtocol + '://' + ServerHostName
    if (ServerPortNumber != null) fullUrl += (':' + ServerPortNumber);
    fullUrl += "/API/v3/surveys/"+SurveyId+"/responses";
    return new Promise (function (resolve, reject) {
        setTimeout(()=> reject(basicPacket(false, 1, 'Network request timeout')), DefaultPostRequestTimeout);
        var headers = {
            'X-API-TOKEN': APIToken,
            'Content-Type': 'application/json',
            'accept': 'application/json',
        };
        var body = {"values": createResponseHelper(ipAddress, idChoicePairs)};
        fetch(fullUrl, {method: 'POST', headers: headers, body: JSON.stringify(body)})
            .then((response) => {
                if (response.status != 200 && response.status != 201) return reject(basicPacket(false, 5, 'Network request failed, code: ' + response.status));
                response.json()
                .then((responseJson) => resolve(responseJson))
            })
            .catch((error) => {
                console.log(error);
                reject(basicPacket(false, 2, 'Network request failed'))
            });
    });
}
function retrieveResponse(responseId) {
    var fullUrl = HTTPProtocol + '://' + ServerHostName
    if (ServerPortNumber != null) fullUrl += (':' + ServerPortNumber);
    fullUrl += "/API/v3/surveys/"+SurveyId+"/responses/" + responseId;
    return new Promise (function (resolve, reject) {
        setTimeout(()=> reject(basicPacket(false, 1, 'Network request timeout')), DefaultPostRequestTimeout);
        var headers = {
            'X-API-TOKEN': APIToken,
            'accept': 'application/json',
        };
        fetch(fullUrl, {method: 'GET', headers: headers})
            .then((response) => {
                if (response.status != 200 && response.status != 201) return reject(basicPacket(false, 5, 'Network request failed, code: ' + response.status));
                response.json()
                .then((responseJson) => resolve(responseJson))
            })
            .catch((error) => {
                console.log(error);
                reject(basicPacket(false, 2, 'Network request failed'))
            });
    });
}
function createResponseHelper(ipAddress, idChoicePairs) {
    var values = {};
    values.distributionChannel = "anonymous";
    values.duration = 5;
    values.endDate = new Date().toISOString();
    values.finished = 1;
    values.ipAddress = ipAddress;
    values.locationLatitude =  "33.0000000000";
    values.locationLongitude = "-87.0000000000";
    values.progress = 100;
    for (var key in idChoicePairs) {
        values[key] = idChoicePairs[key];
    }
    // values.QID192 = 3;
    // values.QID192_DO = ["4", "3", "2", "1", "0"];
    // values.QID204 = 3;
    // values.QID204_DO = ["4", "3", "2", "1", "0"];
    values.recordedDate = new Date().toISOString();
    values.startDate = new Date().toISOString();
    values.status = 0;
    values.userLanguage = "EN";
    return values;
}
function basicPacket(success = null, errorCode = null, message = null) {
    return { 
        success: success,
        errorCode: errorCode,
        message: message,
    };
}

module.exports = router;

function sendInternalServerErrorPacket(res, error) {
    console.log(error);
    return res.end(JSON.stringify(basicPacket(false, 500, "Internal Server Error")));
}