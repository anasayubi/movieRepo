angular.module("MovieList", ["ngRoute"])
.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: "views/movieList.html",
    controller: "movieList",
    controllerAs: "ctrl"
  })
  .when('/addMovie', {
    templateUrl: "views/addMovie.html",
    controller: "addMovie",
    controllerAs: "ctrl"
  })
  .when('/editMovie', {
    templateUrl: "views/editMovie.html",
    controller: "editMovie",
    controllerAs: "ctrl"
  })
}])