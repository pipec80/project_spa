(function() {
    'use strict';

    angular
        .module('AuthServices', [])
        .factory('Auth', Service);

    Service.$inject = ['$resource', '$http', 'store', '$q', 'APIURL', 'jwtHelper', '$location'];

    function Service($resource, $http, store, $q, APIURL, jwtHelper, $location) {

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
        // Funciones
        service.init = init;
        service.login = login;
        service.logout = logout;
        service.currentUser = currentUser;
        service.isLoggedIn = isLoggedIn;
        service.getToken = getToken;
        service.isTokenExpired = isTokenExpired;
        service.checkPermissionForView = checkPermissionForView;
        service.userHasPermissionForView = userHasPermissionForView;
        service.userHasPermission = userHasPermission;
        ////////////////
        return service;
        ////////////////

        function init() {
            if (service.isLoggedIn()) {
                if (service.isTokenExpired()) {
                    $location.path('/');
                    //return false;
                }
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

        function getToken() {
            var user = store.get('currentUser');
            return user.token;
        }

        function isTokenExpired() {
            var user = store.get('currentUser');
            var isLogged = jwtHelper.isTokenExpired(user.token);
            return isLogged === true;
        }

        function isLoggedIn() {
            return store.get('currentUser') !== null;
        }

        function checkPermissionForView(data) {
            if (data.authorization) {
                if (service.isLoggedIn()) {
                    if (service.isTokenExpired()) {
                        //return false;
                        $location.path('/');
                    }
                }
                //return true;
                return service.userHasPermissionForView(data);
            }
        }

        function userHasPermissionForView(data) {
            return true;

            /*
                        if (!data.permissions || !data.permissions.length) {
                            return true;
                        }
            */
            //return service.userHasPermission(data.permissions);
        }

        function userHasPermission(permissions) {

        }
    }
})();