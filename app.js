'use strict';

// requiring path
const path = require('path');

// requiring bodyParser
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

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
    database: process.env.DB_NAME,
    multipleStatements: true
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
app.use(bodyParser.json());

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
        res.send({"posts": rows});
    });
});

app.post('/posts', urlencodedParser, function(req, res) {
    connection.query(`INSERT INTO posts (title, url, timestamp) VALUES ('${req.body.title}', '${req.body.url}', NOW());`, function(err, rows) {
        if (err) {
            console.log(err.toString() + '1');
            res.status(500).send('Database error');
            return;
        }
        // req.setHeader("Accept", "application/json");
        // req.setHeader("Content-type", "application/json");

        connection.query('SELECT * FROM posts WHERE id=(SELECT max(id) FROM posts);', function(err, rows) {
            if (err) {
                console.log(err.toString() + "2");
                res.status(500).send('Database error');
                return;
            }
            res.status(200);
            res.setHeader("Content-type", "application/json");
            res.send(rows[0]);
        });
    });
});

// app.post('/posts', jsonParser, (req, res) => {
//     let inputTitle = req.body.title;
//     let inputURL = req.body.url;
//     connection.query(`INSERT INTO ${tableName}
//       (title, url)
//       VALUES ('${inputTitle}', '${inputURL}');`
//       , (err, result) => {
//         if (err) {
//           console.error(err);
//           res.status(500);
//           res.send(JSON.stringify(err));
//           return;
//         };
//         // a visszakérő Query nem szép, mert duplikátumokat ad
//         connection.query(`SELECT * FROM ${tableName}
//         WHERE title = '${inputTitle}' 
//         AND url = '${inputURL}';`
//           , (err, result) => {
//             if (err) {
//               console.error(err);
//               res.status(500);
//               res.send(JSON.stringify(err));
//               return;
//             } else {
//               res.status(200).setHeader('Content-type', 'application/JSON');
//               res.setHeader('Access-Control-Allow-Origin', '*');
//               res.setHeader('Accept', 'application/JSON');
//               res.send(JSON.stringify(result));
//             }
//           })
//       });
//   });

app.listen(PORT, () => {
    console.log(`The server is up and running on ${PORT}`);
});