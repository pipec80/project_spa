(function() {
    'use strict';

    angular.module('AppMain', ['ngRoute', 'ngStorage', 'Home', 'Contacto', 'About', 'AuthenticationService'])
        .config(routeConfig)
        .config(configure)
        .run(appRun);

    /* @ngInject */
    configure.$inject = ['$compileProvider', '$logProvider', '$httpProvider'];

    function configure($compileProvider, $logProvider, $httpProvider) {
        // Replaced by Gulp build task
        $compileProvider.debugInfoEnabled('@@debugInfoEnabled' !== 'false');
        $logProvider.debugEnabled('@@debugLogEnabled' !== 'false');
        // $httpProvider.interceptors.push('HttpInterceptor');
    }

    function appRun() {

    }
    routeConfig.$inject = ['$locationProvider', '$routeProvider'];

    function routeConfig($locationProvider, $routeProvider) {

        // Permite que las URLs no lleven el caracter
        // # al inicio (utilizado por defecto por angular)
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.tpl.html',
                controller: 'HomeController',
                controllerAs: 'homectrl'
            })
            .when('/contact', {
                templateUrl: 'views/contacto.tpl.html',
                controller: 'ContactoController',
                controllerAs: 'contactctrl'
            })
            .when('/about', {
                templateUrl: 'views/about.tpl.html',
                controller: 'AboutController',
                controllerAs: 'aboutctrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();