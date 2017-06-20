(function() {
    'use strict';

    angular
        .module('AuthenticationService', [])
        .factory('AuthenticationService', Service);

    Service.$inject = ['$http', '$localStorage'];

    function Service($http, $localStorage) {
        var service = {
            Login: Login,
            Logout: Logout
        };
        return service;

        ////////////////
        function Login(email, password, callback) {
            // use $.param jQuery function to serialize data from JSON 
            var data = $.param({
                email: email,
                password: password
            });
            var url = 'http://localhost:3000/api/auth/login';
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http.post(url, { email: email, password: password }, config)
                .then(
                    function(response) {
                        // success callback
                        // login successful if there's a token in the response
                        if (response.data.token) {
                            // store username and token in local storage to keep user logged in between page refreshes
                            $localStorage.currentUser = {
                                user: response.data.user,
                                token: response.data.token
                            };
                            // add jwt token to auth header for all requests made by the $http service
                            $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;
                            // execute callback with true to indicate successful login
                            callback(true);
                        } else {
                            // execute callback with false to indicate failed login
                            callback(false);
                        }
                    },
                    function(error) {
                        // failure callback
                        console.log(" Login response", error);
                    }
                );
        }

        function Logout() {}
    }
})();