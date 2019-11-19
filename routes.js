'use strict';

// requiring bodyParser
const bodyParser = require('body-parser');

// requiring path
const path = require('path');

// requiring express
const express = require('express');
const app = express();
const connection = require('./db');

app.use(express.static('public'));
app.use(bodyParser.json());

function selectById (id) {
    return `SELECT * FROM posts WHERE id = '${id}';`
}

// loading landing page
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/views/reddit-front.html'));
});

// loading submit page
app.get('/submit', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/views/reddit-front-submit.html'));
});

// loading edit view
app.get('/:id/edit', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/views/reddit-front-edit.html'));
});

app.get('/posts', function(req, res) {
    connection.query('SELECT * FROM posts;', function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send({"posts": result});
    });
});

app.get('/posts/:id', function(req, res) {
    connection.query('SELECT * FROM posts WHERE id=?;', [req.params.id], function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send(result[0]);
    });
});

app.post('/posts', function(req, res) {
    connection.query(`INSERT INTO posts (title, url, timestamp) VALUES (?, ?, ?);`, [req.body.title, req.body.url, Date.now()], function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query('SELECT * FROM posts WHERE id=(SELECT max(id) FROM posts);', function(err, result) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            res.status(200);
            res.setHeader("Content-type", "application/json");
            res.send(result[0]);
        });
    });
});

app.put('/posts/:id/upvote', function(req, res) {
    connection.query(`UPDATE posts SET score = score + 1 WHERE id = ?;`, [req.params.id], function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query(selectById(req.params.id), function(err, result) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            res.status(200);
            res.setHeader("Content-type", "application/json");
            if (result[0] !== undefined) {
                res.send(result[0]);    
            } else {
                res.status(404).send('There is no such post');
            }
        });
    });
});

app.put('/posts/:id/downvote', function(req, res) {
    connection.query(`UPDATE posts SET score = score - 1 WHERE id = ?;`, [req.params.id], function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query(selectById(req.params.id), function(err, result) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            res.status(200);
            res.setHeader("Content-type", "application/json");
            if (result[0] !== undefined) {
                res.send(result[0]);    
            } else {
                res.status(404).send('There is no such post');
            }
        });
    });
});

app.delete('/posts/:id', function(req, res) {
    connection.query(selectById(req.params.id), function (err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query(`DELETE FROM posts WHERE id = ?;`, [req.params.id], function(err, result) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
        });
        res.status(200);
        res.setHeader("Content-type", "application/json");
        if (result[0] !== undefined) {
            res.send(result[0]);    
        } else {
            res.status(404).send('There is no such post');
        }
    });
});

app.put('/posts/:id', function(req, res) {
    connection.query(`UPDATE posts SET title = ?, url = ? WHERE id = ?;`, [req.body.title, req.body.url, req.params.id], function (err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query(selectById(req.params.id), function(err, result) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            res.status(200);
            res.setHeader("Content-type", "application/json");
            if (result[0] !== undefined) {
                res.send(result[0]);    
            } else {
                res.status(404).send('There is no such post');
            }
        });
    });
});

module.exports = app;