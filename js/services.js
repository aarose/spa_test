angular
  .module('messageApp')
  .factory('UserList', ['$http', function($http) {
    return {
      get: function() {
        return $http.get('json/users.json').then(function(response) {
          return response.data;
        });
      }
    };
  }])
  .factory('Messages', ['$http', function($http) {
    return {
      get: function() {
        return $http.get('json/messages.json').then(function(response) {
          return response.data;
        });
      }
    };
  }])
