angular.module('app')
.controller('viewMoviesCtrl', ['$scope', '$http', 'BACKEND_SERVER_DOMAIN', 'BACKEND_SERVER_PORT', 
'BACKEND_SERVER_PROTOCOL',
function($scope, $http, BSD, BSPORT, BSPROT){
  var self = this;
  // var data = [{name: "Moroni", age: 50} /*,*/];
  // var data = [{name: "Moroni", age: 50} /*,*/];
  self.tableParams = new NgTableParams({}, { dataset: data});
}])