(function() {
    'use strict';

    angular
        .module('AuthenticationService', [])
        .factory('AuthenticationService', Service);

    Service.$inject = ['$http', 'store'];

    function Service($http, store) {
        var service = {
            Login: Login,
            Logout: Logout
        };
        return service;

        ////////////////
        function Login(email, password, callback) {
            var url = 'http://localhost:3000/api/auth/login';
            var config = {
                skipAuthorization: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post(url, { email: email, password: password }, config)
                .then(
                    function(response) {
                        // success callback
                        //console.log('Login response', response);
                        console.log('Login response', response);
                        // login successful if there's a token in the response
                        if (response.data.token) {
                            // store username and token in local storage to keep user logged in between page refreshes
                            var currentUser = {
                                user: response.data.user,
                                token: response.data.token
                            };
                            store.set('currentUser', currentUser);
                            // add jwt token to auth header for all requests made by the $http service
                            //$http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                            // execute callback with true to indicate successful login
                            callback(true);
                        } else {
                            // execute callback with false to indicate failed login
                            callback(false);
                        }
                    },
                    function(error) {
                        // failure callback
                        callback(false);
                        console.log(" Login response error", error);
                    }
                );
        }

        function Logout() {}
    }
})();