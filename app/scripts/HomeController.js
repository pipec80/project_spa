(function() {
    'use strict';

    angular
        .module('Home', [])
        .controller('HomeController', HomeController);

    //HomeController.$inject = ['$scope'];
    /**
     * 
     * 
     */
    function HomeController() {
        // Variables
        var vm = this;
        vm.titulo = 'lallala';

        // Funciones
        vm.activate = activate();
        ////////////////

        /**
         * funcion 
         * 
         */
        function activate() {
            /* desc */
        }
    }
})();