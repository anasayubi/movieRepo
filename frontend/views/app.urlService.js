angular.module('app')
.factory('urlService', ['BACKEND_SERVER_DOMAIN', 'BACKEND_SERVER_PORT', 
'BACKEND_SERVER_PROTOCOL', urlService]);

function urlService(BSD, BSPORT, BSPROT){
  // if port is a non-empty string then set requestURL as such
  if(BSPORT){
    var requestURL = BSPROT + '://' + BSD + ':' + BSPORT;
    // console.log(requestURL)
  }
  // if port is an empty string then set requestURL as such
  else{
    var requestURL = BSPROT + '://' + BSD;
    // console.log(requestURL)
  }

  // returns url of backend with path appended
  function backendUrl(path){
    return (requestURL + path);
  }

  return {
    'backendUrl': backendUrl
  };
}