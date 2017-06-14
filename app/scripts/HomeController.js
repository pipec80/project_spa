(function() {
    'use strict';

    angular
        .module('Home', [])
        .controller('HomeController', HomeController);

    //HomeController.$inject = ['$scope'];

    function HomeController() {
        var vm = this;

        vm.titulo = 'lallala';


        activate();

        ////////////////

        function activate() {}
    }
})();