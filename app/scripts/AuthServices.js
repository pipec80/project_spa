(function() {
    'use strict';

    angular
        .module('AuthServices', [])
        .factory('Auth', Service);

    Service.$inject = ['$resource', '$http', 'store', '$q', 'APIURL', 'jwtHelper'];

    function Service($resource, $http, store, $q, APIURL, jwtHelper) {

        /**
         *  User profile resource
         */
        var Profile = $resource(APIURL + '/auth/login/', {}, {
            'query': { method: 'GET', isArray: true },
            'update': { method: 'PUT' },
            'save': { method: 'POST' },
            'remove': { method: 'DELETE' },
            'login': {
                method: 'POST',
                skipAuthorization: true,
                isArray: false
            }
        });

        var service = {};

        service.init = init;
        service.login = login;
        service.logout = logout;
        service.currentUser = currentUser;
        service.isLoggedIn = isLoggedIn;
        service.isTokenExpired = isTokenExpired;
        service.checkPermissionForView = checkPermissionForView;

        ////////////////
        return service;
        ////////////////

        function init() {
            if (service.isLoggedIn()) {
                //$rootScope.user = service.currentUser();
            }
        }

        function logout() {
            store.remove('currentUser');
        }

        function login(email, password) {
            return $q(function(resolve, reject) {
                Profile.login({
                        email: email,
                        password: password
                    }).$promise
                    .then(function(response) {
                        // login successful if there's a token in the response
                        if (response.token) {
                            // store username and token in local storage to keep user logged in between page refreshes
                            var currentUser = {
                                user: response.user,
                                token: response.token
                            };
                            store.set('currentUser', currentUser);
                            // add jwt token to auth header for all requests made by the $http service
                            //$http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                            // execute callback with true to indicate successful login
                            resolve();
                        } else {
                            // execute callback with false to indicate failed login
                            reject();
                        }
                    }, function() {
                        reject();
                    });
            });
        }

        function currentUser() {
            var user = store.get('currentUser');
            return user.user;
        }

        function isTokenExpired() {
            var user = store.get('currentUser');
            var isLogged = jwtHelper.isTokenExpired(user.token);
            console.log("isTokenExpired", isLogged);
            return isLogged === true;
        }

        function isLoggedIn() {
            //var user = store.get('currentUser');
            //console.log("isLoggedIn", user);
            return store.get('currentUser') !== null;
        }

        function checkPermissionForView(view) {
            if (!view.authorization) {
                return true;
            }
            return userHasPermissionForView(view);
        }

        function userHasPermissionForView(view) {
            if (!service.isLoggedIn()) {
                return false;
            }

            if (!view.permissions || !view.permissions.length) {
                return true;
            }

            //return auth.userHasPermission(view.permissions);
        }
    }
})();