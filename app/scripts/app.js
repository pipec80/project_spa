(function() {
    'use strict';

    angular.module('AppMain', ['ngRoute', 'Home', 'Contacto'])
        .config(config)
        //.config(configure)
        .run(appRun);

    /* @ngInject */
    function configure($compileProvider, $logProvider, $httpProvider) {
        // Replaced by Gulp build task
        $compileProvider.debugInfoEnabled('@@debugInfoEnabled' !== 'false');
        $logProvider.debugEnabled('@@debugLogEnabled' !== 'false');
        $httpProvider.interceptors.push('HttpInterceptor');
    }

    function appRun() {

    }

    function config($locationProvider, $routeProvider) {

        // Permite que las URLs no lleven el caracter
        // # al inicio (utilizado por defecto por angular)
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.tpl.html',
                controller: 'HomeController',
                controllerAs: 'homectrl'
            })
            .when('/contact', {
                templateUrl: 'views/contacto.tpl.html',
                controller: 'ContactoController',
                controllerAs: 'contactoctrl'
            })
            .otherwise({ redirectTo: '/' });
    }
})();