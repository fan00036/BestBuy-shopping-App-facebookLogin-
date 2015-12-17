angular.module('starter.services', [])

.factory('AuthFactory', function (localStorageService, IS_LOGGEDIN,LOGS, authKey, authApi, $http, $cordovaOauth) {
    return {
        isLogged: function () {
            //      if(localStorageService.get(authKey) == null){
            //        return false;
            //      }
            //      return true;
            if (localStorageService.get(IS_LOGGEDIN) == null) {
                return false;
            }
            return localStorageService.get(IS_LOGGEDIN);
        },
        login: function (user, password) {
            //local login
            if (password.length > 4 && user != "guest" && password != "guest" && user.length > 0) {
                localStorageService.set(IS_LOGGEDIN, true);
                return true;
            } else {
                var currentlogs=localStorageService.get(LOGS) || [];
                currentlogs.push((new Date)+"Login failed");
                localStorageService.set(LOGS, currentlogs);
                return false;
            }
            //      var credentials = {};
            //      credentials.username = user;
            //      credentials.password = password;
            //      $http.post(authApi+'login', credentials).then(function(response)
            //      {
            //        localStorageService.set(authKey, response.headers()["token"]);
            //      });
        },
        facebooklogin: function (succeedcallback,failcallback) {

            $cordovaOauth.facebook("761625560637722", ["email"]).then(function (result) {
                // results

                var token = result.access_token;
                console.log("Response Object -> " + token);

                localStorageService.set(IS_LOGGEDIN, true);
                localStorageService.set(authKey,token);
                if (typeof succeedcallback === 'function') {
                    succeedcallback();
                }
            }, function (error) {
                // error
                localStorageService.set(IS_LOGGEDIN, false);
                console.log("Error -> " + error);
                var currentlogs=localStorageService.get(LOGS) || [];
                currentlogs.push((new Date)+"Error -> " + error);
                localStorageService.set(LOGS, currentlogs);
                if (typeof failcallback === 'function') {
                    failcallback();
                }
            });
        },
        isFacebookloggedin: function () {
            return (localStorageService.get(authKey) != null);
        },

        //        getUserProfile: function (accessToken) {
        //
        //            $http.get("https://graph.facebook.com/v2.2/me", {
        //                params: {
        //                    access_token: accessToken,
        //                    fields: "id,name,picture",
        //                    format: "json"
        //                }
        //            }).then(function (result) {                
        //                //alert(result.data.image);
        //                console.log(JSON.stringify(result.data));
        //                            
        //            }, function (error) {                
        //                alert("There was a problem getting your profile.");                
        //                console.log(error);            
        //            });
        //        },

        logout: function () {
            //      localStorageService.remove(authKey);
            localStorageService.remove(IS_LOGGEDIN);
        }
    }
})

.factory('TokenInterceptor', function (localStorageService, authKey) {

    return {
        request: function (config) {
            config.headers = config.headers || {};
            var token = localStorageService.get(authKey);

            if (token != null) {
                config.headers['Token'] = token;
            }
            return config;
        },

        response: function (response) {
            return response;
        }
    };
})
.factory('Utility', function (localStorageService, authKey,LOGS) {
    return {
        getlogs: function () {
            return localStorageService.get(LOGS) || ["No logs"];
        },
        getFacebookProfile: function (succeedcallback,failcallback) {
            var accessToken = localStorageService.get(authKey);
//$http({
//                method: 'GET',
//                url: 'https://graph.facebook.com/v2.5/me?access_token='+accessToken+'&fields=id,name,picture&format=json'
//            }).success(function (result) {
//                                                succeedcallback(accessToken);
//
//            }).error(function (error) {
//                                                succeedcallback(accessToken);
//
//            });
//            $http.get("https://graph.facebook.com/v2.5/me", {
//                                params: {
//                                    access_token: accessToken,
//                                    fields: "id,name,picture",
//                                    format: "json"
//                                }
//                            }).then(function (result) {                
//                                //alert(result.data.image);
////                                console.log(JSON.stringify(result.data));
//                                if (typeof succeedcallback === 'function') {
//                                    succeedcallback(accessToken);
//                                }
//
//                            }, function (error) {                
////                                console.log(error); 
//                                if (typeof failcallback === 'function') {
//                                    failcallback();
//                                }
//                            });
//            $http.get("https://graph.facebook.com/v2.5/me", 
//            { params: { access_token: accessToken, 
//                        fields: "id,name,gender,location,website,picture,relationship_status", 
//                        format: "json" 
//                      }
//            })
//            .then(
//                function(result) {
////$ionicPopup.alert({
////title: 'Success',
////content: 'You have successfully logged in!' + JSON.stringify(result.data)
////}).then(function(){
//////do something
////})
//                }, 
//                function(error) {
////alert("There was a problem getting your profile. Check the logs for details.");
////console.log(error);
//                }
//            );
//            var facebookResponse =  $http.get("https://graph.facebook.com/v2.2/me", {
//                                params: {
//                                    access_token: accessToken,
//                                    fields: "id,name,picture",
//                                    format: "json"
//                                }
//                            }).then(function (result) {                
//                                //alert(result.data.image);
////                                console.log(JSON.stringify(result.data));
//                                if (typeof succeedcallback === 'function') {
//                                    succeedcallback(accessToken);
//                                }
//
//                            }, function (error) {                
////                                console.log(error); 
//                                if (typeof failcallback === 'function') {
//                                    failcallback();
//                                }
//                            });
//            return facebookResponse;
        }
    }
})
.factory('PlayLists', function (localStorageService, authKey, $http, authApi) {
    return {
        all: function () {
            return $http.get(authApi + 'playlists');
        }
    }
})

//Products http call and search product
.factory('ProductsApiCall', function ($http) {
    return {
        getAll: function () {
            var httpResponse = $http({
                method: 'GET',
                url: 'http://api.bestbuy.com/v1/products?show=sku,name,salePrice,image&pageSize=80&apiKey=sj993rn84ux2c7et8fzcxaqs&format=json'
            }).success(function (data, status, header, config) {

                return data;
            }).error(function (data, status, header, config) {

                return data;
            });

            return httpResponse;
        },
        search: function (key) {
            var httpResponse = $http({
                method: 'GET',
                url: 'http://api.bestbuy.com/v1/products((search=' + key + '))?show=sku,name,salePrice,image&pageSize=50&apiKey=sj993rn84ux2c7et8fzcxaqs&format=json'
            }).success(function (data, status, header, config) {

                return data;
            }).error(function (data, status, header, config) {

                return data;
            });

            return httpResponse;
        }
    }
})

//fetch store
.factory('myStoreFactory', function ($http) {
    return {
        getStore: function (lat, long) {
            var httpResponse = $http({
                method: 'GET',
                url: 'http://api.bestbuy.com/v1/stores(area(' + lat + ',' + long + ',1000))?format=json&show=storeId,name,distance&apiKey=sj993rn84ux2c7et8fzcxaqs'
            }).success(function (data, status, header, config) {
                return data;
            }).error(function (data, status, header, config) {
                return data;
            });
            return httpResponse;
        },
        search: function (key) {
            var httpResponse = $http({
                method: 'GET',
                url: 'http://api.bestbuy.com/v1/stores(city=' + key + ')?format=json&apiKey=sj993rn84ux2c7et8fzcxaqs'
            }).success(function (data, status, header, config) {
                return data;
            }).error(function (data, status, header, config) {

                return data;
            });

            return httpResponse;
        }
    }
});