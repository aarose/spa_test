angular
  .module('messageApp')
  .factory('UserList', ['$http', '$cookies', function($http, $cookies) {
    return {
      get: function() {
        var config = {headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $cookies.get('authToken'),
        }};

        return $http.get('/api/v1/users', config).then(function(response) {
          return response.data.data;
        });
      }
    };
  }])
  .factory('Messages', ['$http', '$cookies', function($http, $cookies) {
    return {
      get: function() {
        var config = {headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $cookies.get('authToken'),
        }};

        return $http.get('json/messages.json').then(function(response) {
          return response.data;
        });
      }
    };
  }])
  .service('notificationService', function() {
    var successNotes = [];
    var warningNotes = [];
    var dangerNotes = [];

    return {
      addSuccessNote: function (newNote) {
        successNotes.push(newNote);
      },
      getSuccessNotes: function() {
        return successNotes;
      },
      addWarningNote: function (newNote) {
        warningNotes.push(newNote);
      },
      getWarningNotes: function() {
        return warningNotes;
      },
      addDangerNote: function (newNote) {
        dangerNotes.push(newNote);
      },
      getDangerNotes: function() {
        return dangerNotes;
      },
    };
  })
  .factory('CurrentUser', ['$http', '$cookies', function($http, $cookies) {
    return {
      get: function() {
        var config = {headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + $cookies.get('authToken'),
        }};

        return $http.get('/api/v1/users/current', config).then(function(response) {
          return response.data.data;
        });
      }
    };
  }]);
