(function() {
    'use strict';

    angular
        .module('Dashboard', [])
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['store', 'jwtHelper', '$http'];

    function DashboardController(store, jwtHelper, $http) {
        var self = this;
        var user = store.get('currentUser');

        self.tokenPayload = jwtHelper.decodeToken(user.token);
        self.user = user.user;

        //_init();
        self.btnTest = test;
        ////////////////

        function _init() {}

        function test() {
            var req = {
                method: 'POST',
                skipAuthorization: false,
                url: 'http://localhost:3000/api/protected'
            };

            $http(req).then(function(response) {
                console.log(response);
            }, function(error) {
                console.log('error', error);
            });
        }
    }
})();