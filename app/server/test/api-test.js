const expect = require('chai').expect;
const request = require('request');


it('Login Test', function (done) {
    request('http://localhost:8888/login', {method: 'POST'}, function (error, response, body) {
        expect(body).to.not.equal(undefined);
        var jsonObj = JSON.parse(body);
        expect(jsonObj.success).to.not.equal(undefined);
        expect(jsonObj.success).to.equal(false);
        done();
    })
})

it('Register Test', function (done) {
    request('http://localhost:8888/register', {method: 'POST'}, function (error, response, body) {
        expect(body).to.not.equal(undefined);
        var jsonObj = JSON.parse(body);
        expect(jsonObj.success).to.not.equal(undefined);
        expect(jsonObj.success).to.equal(false);
        done();
    })
})

it('Unauthorized Test', function (done) {
    request('http://localhost:8888/api/getAllQuestions', {method: 'GET'}, 
        function (error, response, body) {
            expect(body).to.not.equal(undefined);
            var jsonObj = JSON.parse(body);
            expect(jsonObj.success).to.not.equal(undefined);
            expect(jsonObj.success).to.equal(false);
            done();
        }
    )
})


it('GetQuestionsBlock Test', function (done) {

    request('http://localhost:8888/api/getQuestionsFromBlock/Soc', {method: 'GET',}, 
        function (error, response, body) {
            expect(body).to.not.equal(undefined);
            var jsonObj = JSON.parse(body);
            expect(jsonObj.success).to.not.equal(undefined);
            expect(jsonObj.success).to.equal(true);
            expect(jsonObj.questions).to.not.equal(undefined);
            done();
        }
    ).setHeader('X-ACCESS-TOKEN', "de64b7b0-0a77-11ea-901e-c3de7087d6a3")
})

it('GetQuestionsBlock Invalid Params Test', function (done) {

    request('http://localhost:8888/api/getQuestionsFromBlock/test', {method: 'GET',}, 
        function (error, response, body) {
            expect(body).to.not.equal(undefined);
            var jsonObj = JSON.parse(body);
            expect(jsonObj.success).to.not.equal(undefined);
            expect(jsonObj.questions.length).to.equal(0);
            done();
        }
    ).setHeader('X-ACCESS-TOKEN', "de64b7b0-0a77-11ea-901e-c3de7087d6a3")
})

it('Create Response Empty Test', function (done) {

    request('http://localhost:8888/api/createResponse', {method: 'POST'}, 
        function (error, response, body) {
            expect(body).to.not.equal(undefined);
            var jsonObj = JSON.parse(body);
            expect(jsonObj.success).to.not.equal(undefined);
            expect(jsonObj.success).to.equal(false);
            done();
        }
    ).setHeader('X-ACCESS-TOKEN', "de64b7b0-0a77-11ea-901e-c3de7087d6a3");
})

it('Reset user score test', function (done) {
    request('http://localhost:8888/api/resetUserScores', {method: 'GET'}, 
        function (error, response, body) {
            expect(body).to.not.equal(undefined);
            var jsonObj = JSON.parse(body);
            expect(jsonObj.success).to.not.equal(undefined);
            expect(jsonObj.success).to.equal(false);
            done();
        }
    )
})

// it('', function (done) {
//     request('http://localhost:8888/api/', {method: 'GET'}, 
//         function (error, response, body) {
//             expect(body).to.not.equal(undefined);
//             var jsonObj = JSON.parse(body);
//             expect(jsonObj.success).to.not.equal(undefined);
//             expect(jsonObj.success).to.equal(false);
//             done();
//         }
//     )
// })
