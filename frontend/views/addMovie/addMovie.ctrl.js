angular.module('app')
.controller('addMovieCtrl', ['$http', 'BACKEND_SERVER_DOMAIN', 'BACKEND_SERVER_PORT', 
'BACKEND_SERVER_PROTOCOL',
function($http, BSD, BSPORT, BSPROT){
  var self = this;
  // indicates whether the form has been submitted or not
  self.submitted = false;
  self.submit = function(){
    // form has been submitted hence true 
    self.submitted = true;
    // if port is a non-empty string then set requestURL as such
    if(BSPORT){
      var requestURL = BSPROT + '://' + BSD + ':' + BSPORT + '/api/movie';
      // console.log(requestURL)
    }
    // if port is an empty string then set requestURL as such
    else{
      var requestURL = BSPROT + '://' + BSD + '/api/movie';
      // console.log(requestURL)
    }
    var data = {
      title: self.title,
      releaseYear: self.releaseYear,
      rating: self.rating 
    };
    
    $http.post(requestURL, data).then(function success(resp){
      console.log('resp: ', resp);
    }, function err(resp){
      console.log('err: ', resp);
    })
  }
}])

// .controller('viewMoviesCtrl', [function(){
//   console.log('');
// }])

// .controller('editMovieCtrl', [function(){
//   console.log('');
// })