var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var colours = require('colors');
var cors = require('cors');

// Initialise App
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json({limit : '80mb'}));
// allow cross origin requests
app.use(cors());
// app.use(bodyParser.urlencoded({extended: true}))
// set terminal colour themes
colours.setTheme({
  info: ['cyan'],
  error: ['red', 'bold']
});
// returns Movie model
var Movie = require('./db')(colours);
// set debugging variable
var DEBUG = false;

var api = require('./api')(app, DEBUG, Movie);

// Accepts JSON input as such:
//   {title: [String], releaseYear: [String], rating: [Number]}
// 'title' is required
// both 'releaseYear' & 'rating' are not required
// 'releaseYear' is a string that must be converted to date
//   stored as an object in MongoDB
// 'rating' is a number that spans from 1 to 10 and must be an integer
// app.post('/api/addMovie', api.addMovie);
app.post('/api/movie', api.addMovie);
// Accepts requests as such:
//   /api/movie/27183bd7271
// ':id' must be a valid 'id' in the db
app.delete('/api/movie/:id', api.removeMovie);
// Accepts JSON input as such:
//   {id: [ObjectID], title: [String], releaseYear: [String], rating: [Number]}
// 'id' is required as it identifies which movie must be edited
// both 'releaseYear' & 'rating' are not required
// 'releaseYear' is a string that must be converted to date
//   stored as an object in MongoDB
// 'rating' is a number that spans from 1 to 10 and must be an integer
app.post('/api/editMovie', api.editMovie);
// Accepts JSON input as such:
//   {pageNo: [Integer]}
// 'pageNo' field must be an integer and must be within the number of page numbers available
// the page numbers available depend on the number of movies within the DB & are calculated according to this formula:
//   (no. of movies) / 5
// 'pageNo' field must be > 0
// if 'pageNo' field integer exceeds greatest value of possible page number then default to the greatest value
// returns 5 movies of a page
app.post('/api/showMovies', api.showMovies);
// returns all the movies within current db as a list of objects in JSON
app.get('/api/allMovies', api.getAllMovies);

app.listen(9000, function(){
  console.log('Initialising backend server started at http://localhost:9000');
});