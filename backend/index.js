var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

// Initialise App
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json({limit : '80mb'}));
// app.use(bodyParser.urlencoded({extended: true}))
// returns Movie model
var Movie = require('./db.js')()
// set debugging variable
var DEBUG = true;

// Add movie POST path
app.post('/api/addMovie', function(req, res) {
  // Accepts JSON input as such:
  //   {title: [String], releaseYear: [String], rating: [Number]}
  // 'title' is required
  // both 'releaseYear' & 'rating' are not required
  // 'releaseYear' is a string that must be converted to date
  //   stored as an object in MongoDB
  // 'rating' is a number that spans from 1 to 10 and must be an integer

  // request
  (DEBUG) ? console.log('request: ', req.body) : "";

  // Validation:
  // ensure 'title' is present
  if(!req.body.title){
    res.status(400).json({"code": 400, "msg": "'title' field must be present"});
  }
  // ensure 'title' is of type String
  else if(typeof(req.body.title) !== 'string'){
    res.status(400).json({"code": 400, "msg": "'title' field must be of type String"});
  }
  // ensure 'releaseYear' is of type String
  else if(req.body.releaseYear && typeof(req.body.releaseYear) !== 'string'){
    res.status(400).json({"code": 400, "msg": "'releaseYear' field must be of type String"});
  }
  // ensure 'releaseYear' is convertible to Date 
  //   IF 'releaseYear' is present
  //   ensure by converting string representation of date and checking if it is invalid
  else if(req.body.releaseYear && (new Date(req.body.releaseYear)).toString() === 'Invalid Date'){
    res.status(400).json({"code": 400, "msg": "'releaseYear' field must be convertible to date"});
  }
  // ensure 'rating' is an Integer
  //   IF 'rating' is present
  else if(req.body.rating && !Number.isInteger(req.body.rating)){
    res.status(400).json({"code": 400, "msg": "'rating' field must be an Integer"});
  }
  // ensure 1 <= 'rating' <= 10 
  //   IF 'rating' is present
  else if(req.body.rating && (req.body.rating < 1 || req.body.rating > 10)){
    res.status(400).json({"code": 400, "msg": "'rating' field must lie in [1, 10]"});
  }
  else{
    // Process saving
    var movieInfo = {
      title: req.body.title, 
      releaseYear: req.body.releaseYear, 
      rating: req.body.rating
    }

    var movie = new Movie(movieInfo);
    movie.save(function(err, doc){
      (DEBUG) ? console.log('err on save: ', err) : "";
      (DEBUG) ? console.log('movie on save: ', doc) : "";
      if(!err && doc){
        res.status(200).json({"code": 200, "msg": "movie " + JSON.stringify(req.body) + " saved"});
      }
      else{
        res.status(400).json({"code": 400, "msg": "movie unable to save according to " + JSON.stringify(req.body)});
      }
    });
  }
});

app.post('/api/removeMovie', function(req, res) {
  // Accepts JSON input as such:
  //   {id: [ObjectID]}
  // 'id' field must be a valid ID in the MongoDB

  // request
  (DEBUG) ? console.log('request: ', req.body) : "";

  // Validation
  // ensure 'id' is present
  if(!req.body.id){
    res.status(400).json({"code": 400, "msg": "'id' field must be present"});
  }
  // ensure that 'id' is of type String
  else if(typeof(req.body.id) !== 'string'){
    res.status(400).json({"code": 400, "msg": "'id' field must be of type String"});
  }
  else{
    Movie.findByIdAndRemove(req.body.id, function(err, writeResult){
      (DEBUG) ? console.log('err on remove: ', err) : "";
      (DEBUG) ? console.log('writeResult on remove: ', writeResult) : "";
      
      if(!err && writeResult){
        res.status(200).json({"code": 200, "msg": "movie with id " + req.body.id + " has been removed"});
      }
      else if(!err && !writeResult){
        res.status(400).json({"code": 400, "msg": "movie with id " + req.body.id + " does not exist in DB"});
      }
      else{
        res.status(400).json({"code": 400, "msg": "movie unable to be removed according to  " 
          + JSON.stringify(req.body)});
      }
    })
  }
});

app.post('/api/editMovie', function(req, res){
  // Accepts JSON input as such:
  //   {id: [ObjectID], title: [String], releaseYear: [String], rating: [Number]}
  // 'id' is required as it identifies which movie must be edited
  // both 'releaseYear' & 'rating' are not required
  // 'releaseYear' is a string that must be converted to date
  //   stored as an object in MongoDB
  // 'rating' is a number that spans from 1 to 10 and must be an integer

  // Use 'movieUpdateInfo' to store all update info
  var movieUpdateInfo = {};

  // request
  (DEBUG) ? console.log('request: ', req.body) : "";

  if(req.body.id){
    // ensure that 'id' is of type String
    if(typeof(req.body.id) !== 'string'){
      res.status(400).json({"code": 400, "msg": "'id' field must be of type string"});
      return;
    }
    // store 'id' in case all above validation checks are passed
    movieUpdateInfo.id = req.body.id;
  }
  else{
    res.status(400).json({"code": 400, "msg": "'id' field must be present"});
    return;
  }

  // ensure at least one of 'title', 'releaseYear' or 'rating' is present
  if(!req.body.releaseYear && !req.body.title && !req.body.rating){
    res.status(400).json({"code": 400, "msg": "at least one of 'title', 'releaseYear' or 'rating' must be present"});
    return;
  }

  // validation when 'title' is present
  if(req.body.title){
    // ensure 'title' is of type String
    if(typeof(req.body.title) !== 'string'){
      res.status(400).json({"code": 400, "msg": "'title' field must be of type String"});
      return;
    }
    // store 'title' in case all above validation checks are passed
    movieUpdateInfo.title = req.body.title;
  }

  // validation when 'releaseYear' is present
  if(req.body.releaseYear){
    // ensure 'releaseYear' is of type String
    if(typeof(req.body.releaseYear) !== 'string'){
      res.status(400).json({"code": 400, "msg": "'releaseYear' field must be of type String"});
      return;
    }
    // ensure 'releaseYear' is convertible to Date 
    //   ensure by converting string representation of date and checking if it is invalid or valid
    else if((new Date(req.body.releaseYear)).toString() === 'Invalid Date'){
      res.status(400).json({"code": 400, "msg": "'releaseYear' field must be convertible to date"});
      return;
    }
    // store 'releaseYear' in case all above validation checks are passed
    movieUpdateInfo.releaseYear = req.body.releaseYear;
  }

  // validation when 'rating' is present
  if(req.body.rating){
    // ensure 'rating' is an Integer
    if(!Number.isInteger(req.body.rating)){
      res.status(400).json({"code": 400, "msg": "'rating' field must be an Integer"});
      return;
    }
    // ensure 1 <= 'rating' <= 10 
    else if(req.body.rating < 1 || req.body.rating > 10){
      res.status(400).json({"code": 400, "msg": "'rating' field must lie in [1, 10]"});
      return;
    }
    // store 'rating' in case all above validation checks are passed
    movieUpdateInfo.rating = req.body.rating;
  }

  // Process saving if all validation checks passed
  (DEBUG) ? console.log('movieUpdateInfo: ', movieUpdateInfo) : "";

  Movie.findByIdAndUpdate(req.body.id, movieUpdateInfo, function(err, doc){
    (DEBUG) ? console.log('err on update: ', err) : "";
    (DEBUG) ? console.log('movie returned on update: ', doc) : "";

    if(!err && doc){
      res.status(200).json({"code": 200, "msg": "movie updated according to " + JSON.stringify(movieUpdateInfo)});
    }
    else{
      res.status(400).json({"code": 400, "msg": "movie unable to be edited according to " +  JSON.stringify(movieUpdateInfo)});
    }
  });
});

app.post('/api/showMovies', function(req, res){
  // Accepts JSON input as such:
  //   {pageNo: [Integer]}
  // 'pageNo' field must be an integer and must be within the number of page numbers available
  // the page numbers available depend on the number of movies within the DB & are calculated according to this formula:
  //   (no. of movies) / 5
  // 'pageNo' field must be > 0
  // if 'pageNo' field integer exceeds greatest value of possible page number then default to the greatest value
  // returns 5 movies of a page
  
  // request
  (DEBUG) ? console.log('request: ', req.body) : "";

  // Validation:
  // ensure 'pageNo' field is present 
  if(!req.body.pageNo){
    res.status(400).json({"code": 400, "msg": "'pageNo' field must be present"});
  }
  // ensure 'pageNo' field is an integer
  else if(!Number.isInteger(req.body.pageNo)){
    res.status(400).json({"code": 400, "msg": "'pageNo' field must be an integer"});
  }
  else{
    Movie.count(function(err, count){
      (DEBUG) ? console.log('err on counting: ', err) : "";
      (DEBUG) ? console.log('count on counting: ', count) : "";

      // If no movies in DB then send message accordingly
      if(count === 0){
        res.status(500).json({"code": 500, "msg": "No movies are present in the DB"});
        return;
      }

      // calculate max page number
      var maxPageNo = Math.ceil(count / 5);
      if(req.body.pageNo > maxPageNo){
        req.body.pageNo = maxPageNo;
      }

      // If there are movies in 
      Movie.find().sort({creationDateTime: 1}).batchSize(5).skip(5 * (req.body.pageNo - 1))
      .exec(function(err, docs){
        (DEBUG) ? console.log('err on retrieval: ', err) : "";
        (DEBUG) ? console.log('docs on retrieval: ', docs) : "";

        if(!err && docs){
          res.status(200).json({
            "code": 200, 
            "currentPageNo": req.body.pageNo, 
            "maxPageNo": maxPageNo,
            "movies": docs 
          });
        }
        else{
          res.status(400).json({"code": 400, "msg": "Movies could not be retrieved"});
        }
      });
    });
  }
});

app.listen(9000, function(){
  console.log('Backend server started at http://localhost:9000');
});