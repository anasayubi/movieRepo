angular.module('app')
.controller('addMovieCtrl', ['$scope', '$http', 'BACKEND_SERVER_DOMAIN', 'BACKEND_SERVER_PORT', 
'BACKEND_SERVER_PROTOCOL',
function($scope, $http, BSD, BSPORT, BSPROT){
  $scope.submit = function(){
    // if port is a non-empty string then set requestURL as such
    if(BSPORT){
      requestURL = BSPROT + '://' + BSD + ':' + BSPORT + '/api/addMovie';
    }
    // if port is an empty string then set requestURL as such
    else{
      requestURL = BSPROT + '://' + BSD + '/api/addMovie';
    }
    
    $http.get(requestURL).then(function success(resp){
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