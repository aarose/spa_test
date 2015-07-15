angular
  .module('messageApp', ['ui.router'])
  .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
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
      })
      .state('compose', {
        url: '/compose',
        templateUrl: 'templates/compose.html',
        resolve: {
          user_list: ['UserList', function(UserList) {
            return UserList.get();
          }]
        },
        controller: 'composeCtrl',
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
      })
      .state('logout', {
        url: '/logout',
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl',
      })
  }])
