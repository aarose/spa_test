angular
  .module('messageApp')
  .controller('signupCtrl',
              ['$scope', '$http', '$state', 'notificationService',
               function($scope, $http, $state, notificationService) {
    $scope.title = 'Sign Up';
    $scope.signup = function() {
      $http.post('/api/v1/signup', {
        "first_name": $scope.user.first_name,
        "last_name": $scope.user.last_name,
        "email": $scope.user.email,
        "password1": $scope.user.password1,
        "password2": $scope.user.password2})
        .success(function(data, status, headers, config) {
          // Redirect to login page, with success message
          notificationService.addSuccessNote("Your account has been created successfully!");
          $state.go('login');
        })
        .error(function(data, status, headers, config) {
          //  Display error message(s)
          $scope.signupForm.error_messages = data.messages;
          //  Clear the passwords for a re-try
          $scope.user.password1 = null;
          $scope.user.password2 = null;
          $scope.signupForm.password1.$setPristine(); //no required error
          $scope.signupForm.password2.$setPristine(); //no required error
        });
    };
  }])
  .controller('loginCtrl',
              ['$scope', '$http', '$cookies', '$state', 'notificationService',
               function($scope, $http, $cookies, $state, notificationService) {
    $scope.title = 'Login';
    $scope.success_notes = notificationService.getSuccessNotes();
    $scope.danger_notes = notificationService.getDangerNotes();

    $scope.authenticate = function() {
      var user_email = $scope.user.email;
      var user_password = $scope.user.password;
      
      // POST to the API to authenticate
      $http.post('/api/v1/login', {"email": user_email, "password": user_password})
        .success(function(data, status, headers, config) {
          // Save the auth_token in a cookie
          $cookies.put('authToken', data.data.auth_token);
          $state.go('inbox');
        })
        .error(function(data, status, headers, config) {
          //  Display error message(s)
          $scope.loginForm.error_messages = data.messages;
          //  Clear the password for a re-try
          $scope.user.password = null;
          $scope.loginForm.password.$setPristine(); //no required error
        });
    };
  }])
  .controller('logoutCtrl',
              ['$http', '$cookies', '$state',
               function($http, $cookies, $state) {
    // Send a logout request so backend deletes the auth token
    var request_config = {headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + $cookies.get('authToken')
    }};
    $http.get('/api/v1/logout', request_config)
      .success(function(data, status, headers, config) {
        // Delete the auth token
        $cookies.remove('authToken');
        // Redirect to login page
        $state.go('login');
      })
      .error(function(data, status, headers, config) {
        // Add error message
        console.log('Could not log out.');
        $state.go('inbox');
      });
  }])
  .controller('inboxCtrl',
              ['$scope', 'CurrentUser', 'messages', 'notificationService',
               function($scope, CurrentUser, messages, notificationService) {
    $scope.title = 'Inbox';

    $scope.success_notes = notificationService.getSuccessNotes();
    $scope.danger_notes = notificationService.getDangerNotes();

    CurrentUser.get().then(function(user) {
      $scope.current_user = user;
    });

    $scope.messages = messages;
    $scope.showMessages = function() {
      return messages.length > 0;
    };
  }])
  .controller('composeCtrl',
              ['$scope', 'CurrentUser', 'user_list', '$cookies', '$stateParams', 'notificationService',
               function($scope, CurrentUser, user_list, $cookies, $stateParams, notificationService) {
    $scope.title = 'Compose New Message';

    $scope.success_notes = notificationService.getSuccessNotes();
    $scope.danger_notes = notificationService.getDangerNotes();

    var selectFirstRecipient = function($scope) {
      // Select the first user - or null
      if ($scope.user_list.length > 1) {
        return $scope.user_list[0]; 
      } else {
        return null;
      };
    };

    // Set the selectedRecipient
    var selectRecipient = function($scope, selected_uid) {
      if ($scope.user_list.length > 0) {
        if (selected_uid) {
          // Find the user with the uid that matches the query param
          var match_found = false;
          for (i = 0; i < $scope.user_list.length; i++) {
            if (String($scope.user_list[i].uid) == selected_uid) {
              $scope.selectedRecipient = $scope.user_list[i];
              match_found = true;
            };
          };
          if (!match_found) {
            $scope.selectedRecipient = selectFirstRecipient($scope);
          };
        } else {
          // No uid query was passed, so just select the first user from the list
          $scope.selectedRecipient = selectFirstRecipient($scope);
        };
      }
      return $scope;
    };

    CurrentUser.get().then(function(user) {
      $scope.current_user = user;
      var my_uid = $scope.current_user.uid;
      var selected_uid = $stateParams.uid;

      // Remove the current user from the user list
      for (i = 0; i < user_list.length; i++) {
        if (String(user_list[i].uid) == my_uid) {
          user_list.splice(i, 1);
        };
      };
      $scope.user_list = user_list;

      selectRecipient($scope, selected_uid);
    });

    $scope.contentLimit = 150;

    $scope.send = function() {
      /*var request_config = {headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + $cookies.get('authToken')
      }};
      $http.post('/api/v1/messages/', request_config)
        .success(function(data, status, headers, config) {
        })
        .error(function(data, status, headers, config) {
        });*/
      alert('Owl sent!');
    };
  }])
  .controller('directoryCtrl',
              ['$scope', 'CurrentUser', 'user_list', 'notificationService',
               function($scope, CurrentUser, user_list, notificationService) {
    $scope.title = 'User Directory';
    
    CurrentUser.get().then(function(user) {
      $scope.current_user = user;
    });

    $scope.user_list = user_list;

    $scope.success_notes = notificationService.getSuccessNotes();
    $scope.danger_notes = notificationService.getDangerNotes();

    $scope.showUsers = function() {
      return user_list.length > 0;
    };
  }]);
