var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

// Initialise App
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}))
var Movies = require('./db.js')()

// Add movie POST path
app.post('/api/addMovie', function(req, res) {
  
});

app.listen(9000, function(){
  console.log('Backend server started at http://localhost:9000');
});