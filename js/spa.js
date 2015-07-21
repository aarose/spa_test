var messageApp = angular.module('messageApp', ['ui.router', 'ngCookies'])
  .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
          if ($cookies.get('authToken')) {
            $state.go('inbox');
          }
        }]
      })
      .state('inbox', {
        url: '/',
        templateUrl: 'templates/inbox.html',
        controller: 'inboxCtrl',
        resolve: {
          messages: ['Messages', function(Messages) {
            return Messages.get();
          }]
        },
        onEnter: ['$state', '$cookies', function($state, $cookies) {
          if (!($cookies.get('authToken'))) {
            $state.go('login');
          }
        }]
      })
      .state('compose', {
        url: '/compose?uid',
        templateUrl: 'templates/compose.html',
        resolve: {
          user_list: ['UserList', function(UserList) {
            return UserList.get();
          }]
        },
        controller: 'composeCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
          if (!($cookies.get('authToken'))) {
            $state.go('login');
          }
        }]
      })
      .state('directory', {
        url: '/directory',
        templateUrl: 'templates/directory.html',
        resolve: {
          user_list: ['UserList', function(UserList) {
            return UserList.get();
          }]
        },
        controller: 'directoryCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
          if (!($cookies.get('authToken'))) {
            $state.go('login');
          }
        }]
      })
      .state('logout', {
        url: '/logout',
        controller: 'logoutCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
          if (!($cookies.get('authToken'))) {
            $state.go('login');
          }
        }]
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl',
        onEnter: ['$state', '$cookies', function($state, $cookies) {
          if ($cookies.get('authToken')) {
            $state.go('inbox');
          }
        }]
      })
  }])
