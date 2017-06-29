(function() {
    'use strict';

    angular
        .module('DataService', [])
        .factory('dataService', dataService);

    dataService.$inject = ['$resource', 'APIURL'];

    function dataService($resource, APIURL) {
        var task = $resource(APIURL + '/tasks/:id', { 'id': '@id' }, {
            'query': { method: 'GET', isArray: true },
            'get': { method: 'GET', isArray: false },
            'update': { method: 'PUT' },
            'save': { method: 'POST' },
            'remove': { method: 'DELETE' }
        });

        var service = {
            serviceTodoList: task
        };

        return service;
        ////////////////

    }
})();