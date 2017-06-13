angular.module('app')
.factory('storeService', [storeService]);

function storeService(){
  var editId = ''; 
  return {
    getEditId: function() { return editId; },
    setEditId: function(id) { editId = id; }
  }
}