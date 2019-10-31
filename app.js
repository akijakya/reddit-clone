'use strict';

// const path = require('path');
// const bodyParser = require('body-parser');
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

// requiring express
const express = require('express');
const app = express();
const PORT = 3000;

// requiring env
const env = require('dotenv').config();

// connection with the database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME 
});

connection.connect(function(err) {
    if (err) {
      console.log('Error connecting to database');
      return;
    }
    console.log('Connection to database established');
  });
  
// connection.end();

app.use(express.static('assets'));
// app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/hello', function (req, res) {
    res.send('hello world');
});

app.get('/posts', function(req, res) {
    connection.query('SELECT * FROM posts;', function(err, rows) {
        // console.log(rows);
        if (err) {
            console.log(err.toString());
            res.status(500).send('Database error');
            return;
        }
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send(rows);
    });
});

app.listen(PORT, () => {
    console.log(`The server is up and running on ${PORT}`);
});