angular.module('app', ['ui.router'])
.config(['$stateProvider', '$provide', '$httpProvider', function($stateProvider, $provide, $httpProvider){
  // init cross origin support if needed
  // $httpProvider.defaults.useXDomain = true;
  // delete $httpProvider.defaults.headers.common['X-Requested-With'];

  var addMovieState = {
    name: 'addMovie',
    url: '/addMovie',
    templateUrl: 'addMovie/addMovie.html',
    controller: 'addMovieCtrl'
  }

  $provide.constant('BACKEND_SERVER_DOMAIN', 'localhost');
  $provide.constant('BACKEND_SERVER_PORT', '9000');
  $provide.constant('BACKEND_SERVER_PROTOCOL', 'http');

  // var viewMoviesState = {
  //   name: 'viewMovies',
  //   url: '/viewMovies',
  //   templateUrl: 'viewMovies.template.html',
  //   controller: 'viewMoviesCtrl'
  // }

  // var editMovieState = {
  //   name: 'editMovie',
  //   url: '/editMovie',
  //   templateUrl: 'editMovie.template.html',
  //   controller: 'editMovieCtrl'
  // }

  $stateProvider.state(addMovieState);
  // $stateProvider.state(viewMoviesState);
  // $stateProvider.state(editMovieState);
}]);
