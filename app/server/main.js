const express = require('express')
const http = require("http");
const fs = require("fs");
const path = require("path");

var app = express();
const port = 8888;



app.use(express.json());
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username, password);
    res.end(JSON.stringify({
        status: 'OK',
    }));
})

app.listen(port, () => console.log(`Backend listening on port ${port}!`))