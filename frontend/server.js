var express = require('express');
var morgan = require('morgan');
var path = require("path");

// Initialise App
var app = express();
app.use(morgan('dev'));
// Stores all bower downlaoded packages for use on browser
app.use('/', express.static(path.join(__dirname, 'bower_components')));
// Stores all the CSS and frontend JS
app.use('/', express.static(path.join(__dirname, 'public')));
// Stores the angular and HTML component of frontend 
app.use('/', express.static(path.join(__dirname, 'views')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.listen(9006, function(){
  console.log('Frontend server started at http://localhost:9006');
});