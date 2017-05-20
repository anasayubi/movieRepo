var mongoose = require('mongoose');

module.exports = function(){
  mongoose.connect('mongodb://localhost/movieRepo');

  var db = mongoose.connection;
  db.on('error', function() {
    console.error.bind(console, 'MongoDB connection error: ');
  });
  db.once('open', function() {
    console.log('MongoDB successfully connected');
  });

  var movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    releaseYear: {type: Date},
    rating: {type: Number, min: 1, max: 10} 
  });
  var Movies = mongoose.model('Movie', movieSchema);
  return Movies;
}

