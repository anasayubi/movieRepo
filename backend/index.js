var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

// Initialise App
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json({limit : '80mb'}));
// app.use(bodyParser.urlencoded({extended: true}))
var Movie = require('./db.js')()

// Add movie POST path
app.post('/api/addMovie', function(req, res) {
  // Accepts form input as such:
  //   {title: [String], releaseYear: [String], rating: [Number]}
  // 'title' is required
  // both 'releaseYear' & 'rating' are not required
  // 'releaseYear' is a string that must be converted to date
  //   stored as an object in MongoDB
  // 'rating' is a number that spans from 1 to 10 and must be an integer

  // Validation:
  // ensure 'title' is present
  if(!req.body.title){
    res.status(400).json({"code": 400, "msg": "'title' field must be present"});
  }
  // ensure 'title' is of type String
  else if(typeof(req.body.title) !== 'string'){
    res.status(400).json({"code": 400, "msg": "'title' field must be of type String"});
  }
  // ensure 'releaseYear' is of type String convertible to Date
  //   ensure by converting string representation of date and checking if it is invalid
  else if((new Date(req.body.releaseYear)).toString() === 'Invalid Date'){
    res.status(400).json({"code": 400, "msg": "'releaseYear' field must be of type String convertible to date"});
  }
  // ensure 'rating' is an Integer
  else if(!Number.isInteger(req.body.rating)){
    res.status(400).json({"code": 400, "msg": "'rating' field must be an Integer"});
  }
  // ensure 1 <= 'rating' <= 10 
  else if(req.body.rating < 1 || req.body.rating > 10){
    res.status(400).json({"code": 400, "msg": "'rating' field must lie in [1, 10]"});
  }
  else{
    // Process saving
    var movieInfo = {
      title: req.body.title, 
      releaseYear: req.body.releaseYear, 
      rating: req.body.rating
    }
    console.log('req.body: ', req.body)
    var movie = new Movie(movieInfo);
    movie.save(function(err, doc){
      console.log('err: ', err);
      console.log('doc: ', doc);
      if(!err && doc){
        res.status(200).json({"code": 200, "msg": "movie saved"});
      }
      else{
        res.status(400).json({"code": 400, "msg": "movie unable to be save"});
      }
    });
  }
});
  
app.listen(9000, function(){
  console.log('Backend server started at http://localhost:9000');
});