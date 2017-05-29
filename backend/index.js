var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var colours = require('colors');

// Initialise App
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json({limit : '80mb'}));
// app.use(bodyParser.urlencoded({extended: true}))
// set terminal colour themes
colours.setTheme({
  info: ['cyan'],
  error: ['red', 'bold']
});
// returns Movie model
var Movie = require('./db')(colours);
// set debugging variable
var DEBUG = true;

var api = require('./api')(app, DEBUG, Movie);

app.post('/api/addMovie', api.addMovie);
app.delete('/api/movie', api.removeMovie);
app.post('/api/editMovie', api.editMovie);
app.post('/api/showMovies', api.showMovies);

app.listen(9000, function(){
  console.log('Initialising backend server started at http://localhost:9000');
});