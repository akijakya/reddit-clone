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
    return `SELECT * FROM reddit-posts WHERE id = '${id}';`
}

// loading landing page
app.get('/', function (req, res) {
    // original page with three different html files as views:
    res.sendFile(path.join(__dirname, '/public/views/reddit-front.html'));
    //reworked page which only uses DOM manipulation:
    // res.sendFile(path.join(__dirname, '/public/views/reddit-front-mergedviews.html'));
});

// loading submit page
app.get('/submit', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/views/reddit-front-submit.html'));
});

// loading edit view
app.get('/edit', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/views/reddit-front-edit.html'));
});

app.get('/posts', function(req, res) {
    connection.query('SELECT * FROM reddit-posts;', function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send({"posts": result});
    });
});

// this is only needed when three different html pages are used as views:
app.get('/posts/:id', function(req, res) {
    connection.query(selectById(req.params.id), function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.status(200);
        res.setHeader("Content-type", "application/json");
        res.send(result[0]);
    });
});

// submitting new post
app.post('/posts', function(req, res) {
    connection.query(`INSERT INTO reddit-posts (title, url, timestamp) VALUES (?, ?, ?);`, [req.body.title, req.body.url, Date.now()], function(err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query('SELECT * FROM reddit-posts WHERE id=(SELECT max(id) FROM reddit-posts);', function(err, result) {
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

// upvote, downvote
app.put('/posts/:id/upvote', function(req, res) {
    connection.query(`UPDATE reddit-posts SET score = score + 1 WHERE id = ?;`, [req.params.id], function(err, result) {
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
    connection.query(`UPDATE reddit-posts SET score = score - 1 WHERE id = ?;`, [req.params.id], function(err, result) {
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

// deleting post
app.delete('/posts/:id', function(req, res) {
    connection.query(selectById(req.params.id), function (err, result) {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        connection.query(`DELETE FROM reddit-posts WHERE id = ?;`, [req.params.id], function(err, result) {
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

// editing post
app.put('/posts/:id', function(req, res) {
    connection.query(`UPDATE reddit-posts SET title = ?, url = ? WHERE id = ?;`, [req.body.title, req.body.url, req.params.id], function (err, result) {
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