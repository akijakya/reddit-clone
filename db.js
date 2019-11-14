'use strict';

const config = require('./config');

// connection with the database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password, 
    database: config.db.database,
});

connection.connect(function(err) {
    if (err) {
      console.log('Error connecting to database');
      return;
    }
    console.log('Connection to database established');
  });

module.exports = connection;