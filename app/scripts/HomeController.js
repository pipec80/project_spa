(function() {
    'use strict';

    angular
        .module('Home', [])
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location', 'AuthenticationService', 'APP_NAME'];
    /**
     * 
     * 
     */
    function HomeController($location, AuthenticationService, APP_NAME) {
        // Variables
        var self = this;
        self.titulo = 'titulo app :' + APP_NAME;
        self.formData = {};

        // Funciones
        self.login = login;
        initController();
        ////////////////

        /**
         * funcion 
         * 
         */


        function initController() {
            // reset login status
            AuthenticationService.Logout();

        }

        function login() {
            /* desc */
            AuthenticationService.Login(self.formData.email, self.formData.password, function(result) {
                if (result === true) {
                    $location.path('/dashboard');
                } else {
                    self.error = 'Username or password is incorrect';
                    self.loading = false;
                }
            });
        }
    }
})();