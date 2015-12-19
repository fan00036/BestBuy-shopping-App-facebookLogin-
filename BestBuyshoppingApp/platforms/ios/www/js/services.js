angular.module('starter.services', [])

.factory('AuthFactory', function (localStorageService, IS_LOGGEDIN,LOGS, authKey, authApi, $http, $cordovaOauth,USERINFO) {
    return {
        isLogged: function () {
            if (localStorageService.get(IS_LOGGEDIN) == null) {
                return false;
            }
            return localStorageService.get(IS_LOGGEDIN);
        },
        login: function (user, password) {
            //local login
            if (password.length > 4 && user != "guest" && password != "guest" && user.length > 0) {
                localStorageService.set(IS_LOGGEDIN, true);
                var userinfo={};
                userinfo.name=user;
                userinfo.profileurl="img/user.png";
                localStorageService.set(USERINFO, userinfo);
                return true;
            } else {
                var currentlogs=localStorageService.get(LOGS) || [];
                currentlogs.push((new Date)+"Login failed");
                localStorageService.set(LOGS, currentlogs);
                return false;
            }
        },
        facebooklogin: function (succeedcallback,failcallback) {

            $cordovaOauth.facebook("761625560637722", ["email"]).then(function (result) {
                // results

                var token = result.access_token;
                console.log("Response Object -> " + token);

                localStorageService.set(IS_LOGGEDIN, true);
                localStorageService.set(authKey,token);
                $http.get("https://graph.facebook.com/v2.5/me", {
                        params: {
                            access_token: token,
                            fields: "id,name,picture",
                            format: "json"
                        }
                    }).then(function (result) {                
                        console.log(JSON.stringify(result.data));
                        var userinfo={};
                        userinfo.name=result.data.name;
                        userinfo.profileurl=result.data.picture.data.url;
                        localStorageService.set(USERINFO, userinfo);

                        if (typeof succeedcallback === 'function') {
                            
                            succeedcallback();
                        }

                    }, function (error) {                
                        console.log(error); 
                        var currentlogs=localStorageService.get(LOGS) || [];
                        currentlogs.push((new Date)+"Error -> " + error);
                        localStorageService.set(LOGS, currentlogs);
                        if (typeof failcallback === 'function') {
                            failcallback();
                        }
                    });


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
        logout: function () {
            localStorageService.remove(authKey);
            localStorageService.remove(IS_LOGGEDIN);
            localStorageService.remove(USERINFO);
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
.factory('Utility', function (localStorageService, authKey,LOGS,USERINFO) {
    return {
        getlogs: function () {
            return localStorageService.get(LOGS) || ["No logs"];
        },
        getProfile: function () {
            return localStorageService.get(USERINFO);
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