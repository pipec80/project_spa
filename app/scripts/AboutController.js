(function() {
    'use strict';

    angular
        .module('About', [])
        .controller('AboutController', AboutController);

    //AboutController.$inject = ['dependency1'];
    function AboutController() {
        var vm = this;


        activate();

        ////////////////

        function activate() {}
    }
})();