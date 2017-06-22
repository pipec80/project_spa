(function() {
    'use strict';

    angular
        .module('Home', [])
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location', 'Auth', 'APP_NAME'];
    /**
     * 
     * 
     */
    function HomeController($location, Auth, APP_NAME) {
        // Variables
        var self = this;
        self.titulo = 'titulo app :' + APP_NAME;
        self.formData = {};
        Auth.isLoggedIn();
        // Funciones
        self.login = login;
        ////////////////

        /**
         * funcion 
         * 
         */
        function login() {
            /* desc */
            Auth.login(self.formData.email, self.formData.password)
                .then(function() {
                    $location.path('/dashboard');
                }, function() {
                    self.error = 'Username or password is incorrect';
                    self.loading = false;
                });
        }
    }
})();