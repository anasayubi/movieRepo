angular.module('app')
.controller('viewMoviesCtrl', ['$scope', '$http', '$state', 'urlService', 'storeService', 'NgTableParams',
function($scope, $http, $state, urlService, storeService, NgTableParams){
  var self = this;

  // remove edit Id as viewMovies has nothing to do with editing
  storeService.clearEditId();

  // no server error on init
  self.serverError = false;
  // no empty records on init
  self.noRecords = false;

  self.loadView = function(){
    // create backend URL with path
    var requestURL = urlService.backendUrl('/api/allMovies');
  
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
        self.tableParams = new NgTableParams({}, { dataset: resp.data });
      }
    }, function err(resp){
      self.retrieveServerError = true; 
      console.log('err: ', resp);
    })
  }

  self.deleteMovie = function(movieId){
    var requestURL = urlService.backendUrl('/api/movie/' + movieId);

    // console.log(movieId)
    // console.log(requestURL)
    $http.delete(requestURL).then(function success(resp){
      $state.reload();
    }, function err(resp){
      // err
      self.deleteServerError = true; 
      console.log('err: ', resp);
    })
  }

  self.editMovie = function(movieId){
    storeService.setEditId(movieId);
    $state.go('editMovie');
  }

  self.loadView();
}]);