(function() {
    'use strict';

    angular
        .module('Home', [])
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location', 'AuthenticationService'];
    /**
     * 
     * 
     */
    function HomeController($location, AuthenticationService) {
        // Variables
        var self = this;
        self.titulo = 'lallala';
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
            console.log("login", self.formData);
            AuthenticationService.Login(self.formData.email, self.formData.password, function(result) {
                if (result === true) {
                    //$location.path('/');
                } else {
                    self.error = 'Username or password is incorrect';
                    self.loading = false;
                }
            });
        }
    }
})();