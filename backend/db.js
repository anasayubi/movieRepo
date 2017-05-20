var mongoose = require('mongoose');

module.exports = function(){
  mongoose.connect('mongodb://localhost/movieRepo');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console,'Error in Connection :: Cannot Connect to movieRepo'));
  db.once('open', function() {
    console.log('MongoDB successfully connected');
  });

  var movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    releaseYear: {type: Date},
    rating: {type: Number, min: 1, max: 10} 
  });
  var Movie = mongoose.model('Movie', movieSchema);
  return Movie;
}

