(function() {
    'use strict';

    angular.module('AppMain', ['ngRoute', 'ngResource', 'angular-storage', 'ngAnimate', 'ngCookies', 'ngSanitize', 'ngTouch', 'ngAria', 'angular-jwt',
            'Home', 'Contacto', 'About', 'AuthServices', 'Dashboard', 'Config'
        ])
        .config(routeConfig)
        .config(configure)
        .run(appRun);

    /* @ngInject */
    configure.$inject = ['$compileProvider', '$logProvider', '$httpProvider', 'jwtOptionsProvider'];

    function configure($compileProvider, $logProvider, $httpProvider, jwtOptionsProvider) {
        // Replaced by Gulp build task
        $compileProvider.debugInfoEnabled('@@debugInfoEnabled' !== 'false');
        $logProvider.debugEnabled('@@debugLogEnabled' !== 'false');

        jwtOptionsProvider.config({
            whiteListedDomains: ['localhost'],
            authPrefix: 'JWT ',
            unauthenticatedRedirectPath: '/about',
            tokenGetter: ['options', 'store', function(options, store) {
                // Skip authentication for any requests ending in .html
                if (options && options.url.substr(options.url.length - 5) == '.html') {
                    return null;
                }
                var user = store.get('currentUser');
                return user.token;
            }]
        });
        $httpProvider.interceptors.push('jwtInterceptor');
    }

    appRun.$inject = ['$rootScope', '$location', 'Auth', 'authManager'];

    function appRun($rootScope, $location, Auth, authManager) {
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (!Auth.checkPermissionForView(next.$$route)) {
                event.preventDefault();
                $location.path('/about');
            }
        });
        // Check auth on every refresh
        //authManager.checkAuthOnRefresh();
        // Redirect the user to the website configured above when API returns a 401.
        //authManager.redirectWhenUnauthenticated();
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
            .when('/dashboard', {
                templateUrl: 'views/dashboard.tpl.html',
                controller: 'DashboardController',
                controllerAs: 'dashboardctrl',
                authorization: true
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();