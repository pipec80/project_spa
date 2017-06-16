(function() {
    'use strict';

    angular
        .module('Contacto', [])
        .controller('ContactoController', ContactoController);

    //ContactoController.$inject = ['$scope'];

    function ContactoController() {
        // Variables
        var self = this;
        self.titulo = 'contacto';
        self.formData = {};


        // Funciones
        self.submitform = submitform;
        ////////////////
        function submitform() {
            console.log("submit", self.formData);
        }
    }

})();