angular
  .module('messageApp')
  .controller('authCtrl', ['$cookies', function($cookies) {
    // Retrieving a cookie
    var authToken = $cookies.get('authToken');
    // Setting a cookie
    $cookies.put('authToken', 'oatmeal');
    // Delete a cookie
    $cookies.remove('authToken');
  }])
  .controller('loginCtrl', ['$scope', '$cookies', '$state', function($scope, $cookies, $state) {
    $scope.title = 'Login';
    $scope.authenticate = function() {
      var user_email = $scope.user.email;
      var user_password = $scope.user.password;
      // take the email and password info out of the form
      // POST to the api to auth
      // check response status for errors
      // if incorrect, display error message and redisplay email but delete the password
      // if correct, put the token in the cookie
      $cookies.put('authToken', 'oatmeal');
      // and redirect to the inbox
      $state.go('inbox');
    };
  }])
  .controller('inboxCtrl', ['$scope', 'messages', function($scope, messages) {
    $scope.title = 'Inbox';
    $scope.messages = messages;
    $scope.showMessages = function() {
      return messages.length > 0;
    };
  }])
  .controller('composeCtrl', ['$scope', 'user_list', function($scope, user_list) {
    $scope.user_list = user_list;
    $scope.selectedRecipient = user_list[0]
    $scope.title = 'Compose New Message';
    $scope.send = function() {
      $http.post('/api/v1/messages/');
    };
  }])
  .controller('directoryCtrl', ['$scope', 'user_list', function($scope, user_list) {
    $scope.title = 'User Directory';
    $scope.user_list = user_list;
    $scope.showUsers = function() {
      return user_list.length > 0;
    };
  }])
  .controller('signupCtrl', ['$scope', function($scope) {
    $scope.title = 'Sign Up';
    $scope.signup = function() {
      $http.post('/api/v1/users/');
    };
  }]);

