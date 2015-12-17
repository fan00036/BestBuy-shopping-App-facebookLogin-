angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $http,$ionicModal,localStorageService, $timeout, AuthFactory, $rootScope, $window,authKey,Utility) {
  $rootScope.LoggedIn =  function()
  {
    return AuthFactory.isLogged();
  }
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $rootScope.$on('showLoginModal', function($event, scope, cancelCallback, callback) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope = scope || $scope;
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.login();
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
      if (typeof  cancelCallback === 'function') {
        cancelCallback();
      }
    };

    // Open the login modal
    $scope.login = function()
    {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        if(AuthFactory.login($scope.loginData.username, $scope.loginData.password))
        {
            $window.location.reload();
        }
        else
        {
                alert("Invalid username or password!");

        }
    };
    $scope.doFacebookLogin = function () {
        var succeedcallback=function(){
            $window.location.reload();
        };
        var failcallback=function(){
            $window.location.reload();
        };
        AuthFactory.facebooklogin(succeedcallback,failcallback);
    };
  });
  $rootScope.loginFromMenu = function() {
    $rootScope.$broadcast('showLoginModal', $scope, null, function()
    {
      $window.location.reload();
    });
  }
  $rootScope.logoutFromMenu = function(){
    AuthFactory.logout();
    $window.location.reload();
  }
    if(!AuthFactory.isLogged())
    {
        $rootScope.$broadcast('showLoginModal', $scope, null, function () {
            $window.location.reload();
        });
    }
    else{
        if(AuthFactory.isFacebookloggedin())
        {
            var succeedcallback=function(accessToken){
                alert(accessToken);                
            };
            var failcallback=function(){
                alert("There was a problem getting your profile.");                
            };
            Utility.getFacebookProfile(succeedcallback,failcallback);
        }
    } 

})

.controller('logsCtrl', function ($scope, Utility) {
//    $scope.logs; 
//    alert(JSON.stringify(Utility.getlogs()));
    $scope.logs=Utility.getlogs();
})

.controller('productsCtrl', function ($scope, ProductsApiCall) {
    $scope.allProducts;
    $scope.searchKey;
    $scope.notResult=function(){
        return (($scope.allProducts).length==0);
    }; 

    function showProducts(searchKey) {
        if (searchKey == "") {
            ProductsApiCall.getAll()
                .then(function (response) {
                    //success
                    $scope.allProducts = response.data.products;
                    console.log("products " + JSON.stringify(response.data.products));
                }, function (response) {
                    //failed
                });
        } else {
            ProductsApiCall.search(searchKey)
                .then(function (response) {
                    //success
                    $scope.allProducts = response.data.products;
                    console.log("All Products " + JSON.stringify(response.data.products));
                }, function (response) {
                    //failed
                });
        }

    };

    $scope.startSearch = function (searchKey) {
        console.log(searchKey);
        showProducts(searchKey);
    }
    showProducts("");

})

.controller('myStoreCtrl', function ($scope, $geolocation, myStoreFactory) {
    $scope.myPosition;
    $scope.allStores;
    $scope.searchKey;
    $scope.startSearch;
    $scope.notResult=function(){
        return (($scope.allStores).length==0);
    }; 
    //getStores
    function getStores(latitude, longitude) {
        myStoreFactory.getStore(latitude, longitude)
            .then(function (response) {
                //success
                $scope.allStores = response.data.stores;
                console.log("get Store - " + JSON.stringify(response.data.stores));
            }, function (response) {
                //failed
            });
    }
    //search stores
    function searchStores(searchKey) {
        myStoreFactory.search(searchKey)
            .then(function (response) {
                //success
                $scope.allStores = response.data.stores;
                console.log("Searh Store - " + JSON.stringify(response.data.stores));
            }, function (response) {
                //failed
            });
    }

    $scope.$on("$ionicView.enter",function(){
        //alert("hi");
        
//        $geolocation.getCurrentPosition({
//            timeout: 60000
//         }).then(function(position) {
//            $scope.myPosition = position;
//            alert(position);
//         });
        
        //geolocation
    $geolocation.getCurrentPosition({
        timeout: 60000
    }).then(function (position) {
        $scope.myPosition = position;
       

         console.log("Searh Store -" ,position)
        $scope.startSearch = function (searchKey) {
            console.log(searchKey);
            showStores(searchKey);
        }

        function showStores(searchKey) {
            if (searchKey == "") {
                getStores(position.coords.latitude, position.coords.longitude);
            } else {
                searchStores(searchKey);
            }
        }
        showStores("");
    });
    });
    
    
});