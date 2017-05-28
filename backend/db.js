var mongoose = require('mongoose');

module.exports = function(colours){
  mongoose.connect('mongodb://localhost/movieRepo');

  var db = mongoose.connection;
  // db.on('error', console.error.bind(console,'Error in Connection :: Cannot Connect to movieRepo'));
  db.on('error', function(err){
    if(err.name === "MongoError" && /failed to connect to server/.test(err.message) && /ECONNREFUSED/.test(err.message)){
      console.error("Unable to connect to MongoDB. Please try to initialise 'mongod'.".error);
    }
    else{
      console.error(err.toString().error);
    }
  });
  db.once('open', function() {
    console.log('MongoDB successfully connected');
  });

  var movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    releaseYear: {type: Date},
    rating: {type: Number, min: 1, max: 10},
    creationDateTime: {type: Date, default: new Date()}
  });
  var Movie = mongoose.model('Movie', movieSchema);
  return Movie;
}

