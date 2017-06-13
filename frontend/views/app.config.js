angular.module('app', ['ui.router', 'ngTable'])
.config(['$stateProvider', '$provide', '$httpProvider', '$urlRouterProvider',
function($stateProvider, $provide, $httpProvider, $urlRouterProvider){
  // init cross origin support if needed
  // $httpProvider.defaults.useXDomain = true;
  // delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $provide.constant('BACKEND_SERVER_DOMAIN', 'localhost');
  $provide.constant('BACKEND_SERVER_PORT', '9000');
  $provide.constant('BACKEND_SERVER_PROTOCOL', 'http');

  var addMovieState = {
    name: 'addMovie',
    url: '/addMovie',
    templateUrl: 'addMovie/addMovie.html',
    controller: 'addMovieCtrl as ctrl'
  }

  var viewMoviesState = {
    name: 'viewMovies',
    url: '/viewMovies',
    templateUrl: 'viewMovies/viewMovies.html',
    controller: 'viewMoviesCtrl as ctrl'
  }

  var editMovieState = {
    name: 'editMovie',
    url: '/editMovie',
    templateUrl: 'editMovie/editMovie.html',
    controller: 'editMovieCtrl as ctrl'
  }

  $stateProvider.state(addMovieState);
  $stateProvider.state(viewMoviesState);
  $stateProvider.state(editMovieState);

  // Default path and path when any other invalid path is given  
  $urlRouterProvider.otherwise('/viewMovies');
}]);
