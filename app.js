'use strict';

const path = require('path');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('assets'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/hello', function (req, res) {
    res.send('hello world');
});

app.listen(PORT, () => {
    console.log(`The server is up and running on ${PORT}`);
});