// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova','ngGeolocation','ngCordovaOauth','LocalStorageModule', 'starter.controllers','starter.services'])
//auth toekn for the factory
.constant('authKey','myAuthToken')
.constant('authApi','http://localhost:3000/')
.constant('IS_LOGGEDIN','isLoggedIn')
//after device is ready
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,localStorageServiceProvider,$httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
  localStorageServiceProvider.setPrefix('start-side-menu-app');
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.myStore', {
    url: '/myStore',
    views: {
      'menuContent': {
        templateUrl: 'templates/myStore.html',
        controller:'myStoreCtrl'
      }
    }
  })

  .state('app.products', {
    url: '/products',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller:'productsCtrl'
      }
    }
  })
  .state('app.logs', {
    url: '/logs',
    views: {
      'menuContent': {
        templateUrl: 'templates/logs.html',
        controller: 'logsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/products');
});
