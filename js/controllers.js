angular
  .module('messageApp')
  .controller('loginCtrl', ['$scope', function($scope) {
    $scope.title = 'Login';
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

