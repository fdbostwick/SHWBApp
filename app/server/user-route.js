const express  = require('express');
const router = express.Router();
const md5 = require('md5');
const uuidv1 = require('uuid/v1');
const nedb = require("nedb");

var currentDir = __dirname;






router.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) return res.end(JSON.stringify(basicPacket(false, 1, "Username or password cannot be empty")));
    var username = req.body.username.trim();
    var password = req.body.password;
    if (!validateUsername(username)) res.end(JSON.stringify(basicPacket(false, 2, "Invalid username")));
    if (!validatePassword(password)) res.end(JSON.stringify(basicPacket(false, 3, "Invalid password")));
    var hashedPassword = hashPassword(username, password);
    delete password;
    console.log(username, hashedPassword);
    global.userProfileDB.findOne({username: username}, function (error, userProfile) {
        if (error) return sendInternalServerErrorPacket(res, error);
        // if username not found
        if (userProfile == null) return res.end(JSON.stringify(basicPacket(false, 1, "Incorrect username or password")));
        // if password not correct or the attribute not undefined
        if (userProfile.hashedPassword != hashedPassword) return res.end(JSON.stringify(basicPacket(false, 1, "Incorrect username or password")));
        // if everything works
        // search user data db for access tokens
        global.userDataDB.findOne({username: userProfile.username}, function (error, userData) {
            if (error) return sendInternalServerErrorPacket(res, error);
            // create an access token for the user, uuidv1 is time based
            // expireDate by default is 30 days, the date will be refreshed every time it's accessed
            // I will leave deviceId empty for a while as we dont need it right away 
            if (!userData){
                userData= {username: userProfile.username, accessTokens: [], answers: []};
                global.userDataDB.insert(userData, function (error, userData) {
                    if (error) return sendInternalServerErrorPacket(res, error);
                    updateAccessToken(userData);
                })
            }
            else{
                updateAccessToken(userData);
            }
            function updateAccessToken(userData) {
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);
                var token = {accessToken: uuidv1(), expireDate: expireDate, deviceId: null};
                userData.accessTokens.push(token);
                console.log(token);
                global.userDataDB.update({ username: userData.username }, userData, {}, function (error, numReplaced) {
                    if (error)  return sendInternalServerErrorPacket(res, error);
                    var successPacket = basicPacket(true, null, "Login success");
                    successPacket.accessToken = token.accessToken;
                    res.end(JSON.stringify(successPacket));
                });
            }
            
        });
    });
})
router.post('/register', function (req, res) {
    if (!req.body.username || !req.body.password) return res.end(JSON.stringify(basicPacket(false, 1, "Username or password cannot be empty")));
    var username = req.body.username.trim();
    var password = req.body.password;
    var email = req.body.email; // TODO email validation
    var name = req.body.name;   // TODO name validation
    if (!validateUsername(username)) res.end(JSON.stringify(basicPacket(false, 2, "Invalid username")));
    if (!validatePassword(password)) res.end(JSON.stringify(basicPacket(false, 3, "Invalid password")));
    var hashedPassword = hashPassword(username, password);
    delete password;
    console.log(username, hashedPassword);
    global.userProfileDB.findOne({username: username}, function (error, userProfile) {
        if (error) return sendInternalServerErrorPacket(res, error);
        // if username found
        if (userProfile != null) return res.end(JSON.stringify(basicPacket(false, 4, "Username already exists")));
        // if everything works
        // add the new user to database
        var newUserProfile = {username: username, hashedPassword: hashedPassword, email: email, name: name};
        global.userProfileDB.insert(newUserProfile, function (error, userProfile) {
            if (error)  return sendInternalServerErrorPacket(res, error);
            var newUserData = {username: userProfile.username, accessTokens: [], answers: []};
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);
            var token = {accessToken: uuidv1(), expireDate: expireDate, deviceId: null};
            newUserData.accessTokens.push(token);
            // TODO check before insert
            global.userDataDB.insert(newUserData, function (error) {
                if (error)  return sendInternalServerErrorPacket(res, error);
                var successPacket = basicPacket(true, null, "Register success");
                successPacket.accessToken = token.accessToken;
                res.end(JSON.stringify(successPacket));
            })
        })
    });
})
router.get('/api/getUserInfo', function (req, res) {
    var accessToken = req.headers["x-access-token"];
    console.log(accessToken);
    exports.getUsernameByAccessToken(accessToken, function (errorPacket, username) {
        if (errorPacket) return res.end(JSON.stringify(errorPacket));
        global.userProfileDB.findOne({username: username}, function (error, user) {
            if (error) return res.end(JSON.stringify(basicPacket(false, 16, "failed to read database")));
            var successPacket = basicPacket(true, null, "Succefully get user info");
            successPacket.username = user.username;
            successPacket.name = user.name;
            successPacket.email = user.email;
            global.userDataDB.findOne({username: username}, function (error, userData) {
                if (error) return res.end(JSON.stringify(basicPacket(false, 16, "failed to read database")));
                if (userData.scores == undefined || userData.scores["soc"] == undefined) userData.scores = initializeUserScores();
                successPacket.scores = userData.scores;
                res.end(JSON.stringify(successPacket));
            });
        });
    })
});
router.post('/api/resetUserScores', function (req, res) {
    var accessToken = req.headers["x-access-token"];
    exports.getUsernameByAccessToken(accessToken, function (errorPacket, username) {
        if (errorPacket) return res.end(JSON.stringify(errorPacket));
        global.userDataDB.findOne({username: username}, function (error, userData) {
            if (error) return res.end(JSON.stringify(basicPacket(false, 16, "failed to read database")));
            userData.scores = initializeUserScores();
            global.userDataDB.update({ username: username }, userData, {}, function (error, numReplaced) {
                if (error) return res.end(JSON.stringify(basicPacket(false, 16, "failed to read database")));
                var successPacket = basicPacket(true, null, "Succefully reset user scores");
                res.end(JSON.stringify(successPacket));
            });
            
        });
    })
});
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
// username should between 5 to 32 characters long
// username may only contain alphanumeric characters
// username must start with a letter? May or may not emmm
function validateUsername(username) {
    if (username.length < 5 || username.length > 32) return false;
    if (!username.match(/^[a-zA-Z0-9]+$/)) return false;
    return true;
}
// password should between 6 to 32 characters long
// password range is from 32 to 126
function validatePassword(password) {
    if (password.length < 6 || password.length > 32) return false;
    if (!password.match(/^[\x20-\x7E]+$/)) return false;
    return true;
}
exports.getUsernameByAccessToken =  function(accessToken, callback) {
    global.userDataDB.findOne({"accessTokens.accessToken": accessToken} ,function (error, user) {
        if (error) return callback(basicPacket(false, 500, "Internal Server Error"), null);
        if (user == undefined) return callback(basicPacket(false, 55, "AccessToken expired or not found"), null);
        var token = user.accessTokens.find(function (element) {
            return element.accessToken == accessToken;
        });
        if (token == undefined) return callback(basicPacket(false, 56, "AccessToken not found"), null);
        // Remove outdated access token
        // or refresh the expireDate
        var today = new Date();
        if (today.getTime() >= token.expireDate.getTime()){
            global.userDataDB.update({username: user.username }, {$pull: {accessTokens: {accessToken: user.accessTokens}}}, {}, function (error) {
                if (error) return callback(basicPacket(false, 500, "Internal Server Error"), null);
                return callback(basicPacket(false, 15, "expiredToken"), null);
            });
        }
        else{
            var newExpireDate = new Date();
            newExpireDate.setDate(newExpireDate.getDate() + 30);
            token.expireDate = newExpireDate;
            
            global.userDataDB.update({username: user.username, accessTokens: {accessToken: user.accessTokens}}, {$set: token}, {}, function (error) {
                if (error) return callback(basicPacket(false, 500, "Internal Server Error"), null);
                return callback(null, user.username);
            });
        }
    });
}
function hashPassword(username, password) {
    // the reason I add username fator is to reduce md5 dict attack
    // the symbol + is to avoid duplication, as we don't allow + in username
    // although sha1 maybe better but md5 is faster and safe enough
    var combo = md5(username + "+" + password);
    return combo;
}
function basicPacket(success = null, errorCode = null, message = null) {
    return { 
        success: success,
        errorCode: errorCode,
        message: message,
    };
}
function sendInternalServerErrorPacket(res, error) {
    console.log(error);
    return res.end(JSON.stringify(basicPacket(false, 500, "Internal Server Error")));
}
module.exports.router = router;