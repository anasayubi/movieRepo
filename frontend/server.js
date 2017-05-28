var express = require('express');
var morgan = require('morgan');
var path = require("path");

// Initialise App
var app = express();
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'bower_components')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(9006, function(){
  console.log('Frontend server started at http://localhost:9006');
});