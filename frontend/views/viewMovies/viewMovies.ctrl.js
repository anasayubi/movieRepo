angular.module('app')
.controller('viewMoviesCtrl', ['$scope', '$http', 'BACKEND_SERVER_DOMAIN', 'BACKEND_SERVER_PORT', 
'BACKEND_SERVER_PROTOCOL', 'NgTableParams',
function($scope, $http, BSD, BSPORT, BSPROT, NgTableParams){
  var self = this;
  // no server error on init
  self.serverError = false;
  // no empty records on init
  self.noRecords = false;

  self.loadView = function(){
    // if port is a non-empty string then set requestURL as such
    if(BSPORT){
      var requestURL = BSPROT + '://' + BSD + ':' + BSPORT + '/api/allMovies';
      // console.log(requestURL)
    }
    // if port is an empty string then set requestURL as such
    else{
      var requestURL = BSPROT + '://' + BSD + '/api/allMovies';
      // console.log(requestURL)
    }
  
    $http.get(requestURL).then(function success(resp){
      // if no records are returned then show error message
      if(resp.data.length === 0){
        self.noRecords = true;
      }
      else{
        self.noRecords = false;
        resp.data.forEach(function(movie){
          // Only convert date to type string of year if 'releaseYear' is present 
          if(movie.releaseYear){
            var date = new Date(movie.releaseYear);
            movie.releaseYear = date.getFullYear();
          }
        })
        // var data = resp.data;
        self.tableParams = new NgTableParams({}, { dataset: resp.data});
      }
    }, function err(resp){
      self.serverError = true; 
      console.log('err: ', resp);
    })
  }

  self.loadView();
}]);