(function() {
    'use strict';

    angular
        .module('TodoList', [])
        .controller('TodoListController', TodoListController);

    TodoListController.$inject = ['dataService', 'dataInitial'];

    function TodoListController(dataService, dataInitial) {
        /* jshint validthis: true */
        var self = this;
        // Variables
        var apiservice = dataService.serviceTodoList;
        self.titulo = 'listado home';
        self.lsItems = dataInitial;
        // Funciones
        self.createItem = _create;
        self.readItem = _read;
        self.updateItem = _update;
        self.deleteItem = _delete;
        self.getAllItems = getAllItems;
        ////////////////
        function getAllItems() {
            dataService.serviceTodoList.query().$promise.then(function(data) {
                self.lsItems = data;
            });
        }

        function _create(item) {
            apiservice.save(item).$promise
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(response) {
                    console.log(response);
                });
        }

        function _read(item) {
            /*apiservice.get({id:5})
                        .$promise
                            .then(function (response) { console.log(response); })
                            .catch(function (response) { console.log(response); });*/
        }

        function _update(item) {
            /*apiservice.update(data)
                .$promise
                .then(function(response) { console.log(response); })
                .catch(function(response) { console.log(response); });*/
        }

        function _delete(item) {
            /* apiservice.remove({ id: 2 })
                 .$promise
                 .then(function(response) { console.log(response); })
                 .catch(function(response) { console.log(response); });*/

        }
    }
})();