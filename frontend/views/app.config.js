angular.module("app", ['ui.router'])
.config(function($stateProvider){
  var addMovieState = {
    name: 'addMovie',
    url: 'addMovie',
    templateUrl: 'addMovie.template.html'
  }

  var viewMoviesState = {
    name: 'viewMovies',
    url: 'viewMovies',
    templateUrl: 'viewMovies.template.html'
  }

  var editMovieState = {
    name: 'editMovie',
    url: 'editMovie',
    templateUrl: 'editMovie.template.html'
  }

  $stateProvider.state(addMovieState);
  $stateProvider.state(viewMoviesState);
  $stateProvider.state(editMovieState);
})
