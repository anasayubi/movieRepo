mongoose = require('mongoose')

module.exports = function(app, DEBUG, Movie){
  var api = {};
  api.addMovie = function(req, res) {
    // Accepts JSON input as such:
    //   {title: [String], releaseYear: [String], rating: [Number]}
    // 'title' is required
    // both 'releaseYear' & 'rating' are not required
    // 'releaseYear' is a string that must be converted to date
    //   stored as an object in MongoDB
    // 'rating' is a number that spans from 1 to 10 and must be an integer

    // request
    (DEBUG) ? console.log('request: ', req.body) : "";

    // Use 'newMovieInfo' to store all valid new movie info
    var newMovieInfo = {};

    // validation when 'title' is present
    if(req.body.title){
      // ensure 'title' is of type String
      if(typeof(req.body.title) !== 'string'){
        res.status(400).json({"code": 400, "msg": "'title' field must be of type String"});
        return;
      }
      // store 'title' in case all above validation checks are passed
      newMovieInfo.title = req.body.title;
    }
    // ensure 'title' is present
    else{
      res.status(400).json({"code": 400, "msg": "'title' field must be present"});
      return;
    }

    // validation when 'releaseYear' is present
    if(req.body.releaseYear){
      // ensure 'releaseYear' is of type String
      if(typeof(req.body.releaseYear) !== 'string'){
        res.status(400).json({"code": 400, "msg": "'releaseYear' field must be of type String"});
        return;
      }
      // ensure 'releaseYear' is convertible to Date 
      //   ensure by converting string representation of date and checking if it is invalid
      else if((new Date(req.body.releaseYear)).toString() === 'Invalid Date'){
        res.status(400).json({"code": 400, "msg": "'releaseYear' field must be convertible to date"});
        return;
      }
      // store 'releaseYear' in case all above validation checks are passed
      // month by default is stored as 1
      newMovieInfo.releaseYear = new Date(req.body.releaseYear, 1);
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
      // store 'releaseYear' in case all above validation checks are passed
      newMovieInfo.rating = req.body.rating;
    }

    var movie = new Movie(newMovieInfo);
    movie.save(function(err, doc){
      (DEBUG) ? console.log('err on save: ', err) : "";
      (DEBUG) ? console.log('movie on save: ', doc) : "";
      if(!err && doc){
        res.status(200).json({
          "code": 200, 
          "msg": "movie saved",
          "savedMovie": newMovieInfo
        });
      }
      else{
        res.status(400).json({
          "code": 400, 
          "msg": "unable to save movie",
          "errorMovie": req.body,
          "recognisedMovie": newMovieInfo
        });
      }
    });
  }

  api.removeMovie = function(req, res) {
    // Accepts requests as such:
    //   /api/movie/27183bd7271
    // ':id' must be a valid 'id' in the db 
    
    // request
    (DEBUG) ? console.log('request: ', req.params) : "";

    Movie.findByIdAndRemove(req.params.id, function(err, writeResult){
      (DEBUG) ? console.log('err on remove: ', err) : "";
      (DEBUG) ? console.log('writeResult on remove: ', writeResult) : "";
      // On casterror or when no write result occurs and no error is given
      if((err && err.name === ' CastError' && err.kind === 'ObjectId') || 
      (!err && !writeResult)){
        res.status(400).json({
          "code": 400, 
          "msg": "movie with id " + req.params.id + " does not exist in DB"
        });
      }
      // on successful removal
      else if(writeResult){
        res.status(200).json({
          "code": 200,
          "msg": "movie with id " + req.params.id + " has been removed"
        });
      }
      // on any other possible scenario
      else{
        res.status(400).json({
          "code": 400, 
          "msg": "unable to remove movie",
          "errParams": req.params
        });
      }
    });
  }

  api.editMovie = function(req, res){
    // Accepts JSON input as such:
    //   {id: [ObjectID], title: [String], releaseYear: [String], rating: [Number]}
    // 'id' is required as it identifies which movie must be edited
    // both 'releaseYear' & 'rating' are not required
    // 'releaseYear' is a string that must be converted to date
    //   stored as an object in MongoDB
    // 'rating' is a number that spans from 1 to 10 and must be an integer

    // Use 'movieUpdateInfo' to store all valid update info
    var movieUpdateInfo = {};

    // request
    (DEBUG) ? console.log('request: ', req.body) : "";

    // validation when 'id' is present
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
      // month by default is stored as 1
      movieUpdateInfo.releaseYear = new Date(req.body.releaseYear, 1);;
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

    // 'doc' is the non-updated movie object found 
    Movie.findByIdAndUpdate(req.body.id, movieUpdateInfo, function(err, doc){
      (DEBUG) ? console.log('err on update: ', err) : "";
      (DEBUG) ? console.log('movie returned on update: ', doc) : "";

      if(!err && doc){
        Movie.findById(req.body.id, function(err, docUpdated){
          res.status(200).json({
            "code": 200, 
            "msg": "movie updated", 
            "updatedMovie": docUpdated
          });
        });
      }
      else{
        res.status(400).json({
          "code": 400,
          "msg": "movie unable to be updated",
          "errorMovieUpdate": req.body
        });
      }
    });
  }

  api.showMovies = function(req, res){
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
  }

  api.getAllMovies = function(req, res){
    // returns all the movies within current db as a list of objects in JSON or a status message
    Movie.find((err, docs) => {
      console.log('err: ', err);
      console.log('docs: ', docs);
      if(docs){
        res.status(200).json(docs);
      }
      else{
        res.status(200).json({
          'status': 200,
          'msg': 'interal server error occured'
        });
      }
    })
  }

  api.getMovie = function(req, res) {
    // Accepts requests as such:
    //   /api/movie/27183bd7271
    // ':id' must be a valid 'id' in the db 
    
    // request
    (DEBUG) ? console.log('request: ', req.params) : "";

    Movie.findById(req.params.id, function(err, doc){
      (DEBUG) ? console.log('err on remove: ', err) : "";
      (DEBUG) ? console.log('writeResult on remove: ', doc) : "";
      // On casterror or when no write result occurs and no error is given
      if((err && err.name === 'CastError' && err.kind === 'ObjectId') || 
      (!err && !doc)){
        res.status(400).json({
          "code": 400, 
          "msg": "movie with id " + req.params.id + " does not exist in DB"
        });
      }
      // on successful retrieval
      else if(doc){
        res.status(200).json(doc);
      }
      // on any other possible scenario
      else{
        res.status(400).json({
          "code": 400, 
          "msg": "unable to get movie",
          "errParams": req.params
        });
      }
    });
  }

  return api;
} 