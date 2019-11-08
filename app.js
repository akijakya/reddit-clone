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
    console.log(req.headers);
    connection.query('SELECT * FROM posts;', function(err, result) {
        if (err) {
            console.log(err.toString());
            res.status(500).send('Database error');
            return;
        }
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send({"posts": result});
    });
});

app.post('/posts', urlencodedParser, function(req, res) {
    connection.query(`INSERT INTO posts (title, url, timestamp) VALUES ('${req.body.title}', '${req.body.url}', NOW());`, function(err, result) {
        if (err) {
            res.status(500).send('Problem with creating post');
            return;
        }
        connection.query('SELECT * FROM posts WHERE id=(SELECT max(id) FROM posts);', function(err, result) {
            if (err) {
                res.status(500).send('Problem with displaying post');
                return;
            }
            res.status(200);
            res.setHeader("Content-type", "application/json");
            res.send(result[0]);
        });
    });
});

app.put('/posts/:id/upvote', function(req, res) {
    connection.query(`SELECT score FROM posts WHERE id = '${req.params.id}';`, function (err, result) {
        if (err) {
            console.log(err.toString());
            res.status(500).send('There is no such post');
            return;
        }
        connection.query(`UPDATE posts SET score = score + 1 WHERE id = '${req.params.id}';`, function(err, result) {
            if (err) {
                console.log(err.toString());
                res.status(500).send('Problem with updating');
                return;
            }
            connection.query(`SELECT * FROM posts WHERE id = '${req.params.id}';`, function(err, result) {
                if (err) {
                    res.status(500).send('Problem with displaying the modified post');
                    return;
                }
                res.status(200);
                res.setHeader("Content-type", "application/json");
                res.send(result[0]);
            });
        });
    });
});

// Viktorr's async method:
// app.put('/posts/:id/upvote', async function(req, response) {
//     let result = await getScoreById(req.params.id);
//     if (result.length > 0) {
//         await incrementScoreByOneById(req.params.id);
//     }
//     let newResult = await getScoreById(req.params.id);
//     response.setHeader("Content-type", "application/json");
//     response.send(newResult[0]);
// });

// async function incrementScoreByOneById(id) {
//     return new Promise((resolve, reject) => {
//         connection.query(`UPDATE posts SET score = score + 1 WHERE id = '${id}';`, (err, result) => {
//             resolve(result);
//         });
//     });
// }

// async function getScoreById(id){
//     // console.log(connection);
//     return new Promise((resolve, reject) => {
//         connection.query(`SELECT score FROM posts WHERE id = '${id}';`, (err, result) => {
//             resolve(result);
//         });
//     });
// }

app.put('/posts/:id/downvote', function(req, res) {
    connection.query(`SELECT score FROM posts WHERE id = '${req.params.id}';`, function (err, result) {
        if (err) {
            console.log(err.toString());
            res.status(500).send('There is no such post');
            return;
        }
        connection.query(`UPDATE posts SET score = score - 1 WHERE id = '${req.params.id}';`, function(err, result) {
            if (err) {
                console.log(err.toString());
                res.status(500).send('Problem with updating');
                return;
            }
            connection.query(`SELECT * FROM posts WHERE id = '${req.params.id}';`, function(err, result) {
                if (err) {
                    res.status(500).send('Problem with displaying the modified post');
                    return;
                }
                res.status(200);
                res.setHeader("Content-type", "application/json");
                res.send(result[0]);
            });
        });
    });
});

// absolute barebone solution with no error handling
// app.put('/posts/:id/downvote', function(req, res) {
//     connection.query(`UPDATE posts SET score = score - 1 WHERE id = '${req.params.id}';`);
//     connection.query(`SELECT * FROM posts WHERE id = '${req.params.id}';`, function(err, result) {
//         res.status(200);
//         res.setHeader("Content-type", "application/json");
//         res.send(result[0]);
//     });
// });

app.listen(PORT, () => {
    console.log(`The server is up and running on ${PORT}`);
});