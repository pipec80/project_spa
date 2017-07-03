(function() {
    'use strict';

    angular.module('AppMain', ['ui.router', 'ui.router.state.events', 'ngResource', 'angular-storage', 'ngAnimate', 'ngCookies', 'ngSanitize', 'ngTouch', 'ngAria', 'angular-jwt',
            'Config', 'Home', 'Contacto', 'About', 'AuthServices', 'Dashboard', 'TodoList', 'DataService'
        ])
        .config(routeConfig)
        .config(configure)
        .run(appRun);

    /* @ngInject */
    configure.$inject = ['$compileProvider', '$logProvider', '$httpProvider', 'jwtOptionsProvider', 'storeProvider', '$resourceProvider'];

    function configure($compileProvider, $logProvider, $httpProvider, jwtOptionsProvider, storeProvider, $resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
        // Replaced by Gulp build task
        $compileProvider.debugInfoEnabled('@@debugInfoEnabled' !== 'false');
        $logProvider.debugEnabled('@@debugLogEnabled' !== 'false'); //
        // angular-storage settings
        //storeProvider.setStore('sessionStorage');
        storeProvider.setCaching(false); //cambiar en  angular-storage.js variable ln 166
        //
        jwtOptionsProvider.config({
            whiteListedDomains: ['localhost'],
            authPrefix: 'JWT ',
            unauthenticatedRedirectPath: '/about',
            tokenGetter: ['options', 'store', function(options, store) {
                // Skip authentication for any requests ending in .html
                if (options && options.url.substr(options.url.length - 5) === '.html') {
                    return null;
                }
                var user = store.get('currentUser');
                return user.token;
            }]
        });
        $httpProvider.interceptors.push('jwtInterceptor');
    }
    /* @ngInject */
    appRun.$inject = ['$rootScope', '$state', '$location', 'Auth', 'authManager'];

    function appRun($rootScope, $state, $location, Auth, authManager) {
        Auth.init();
        // Check auth on every refresh
        //authManager.checkAuthOnRefresh();
        // Redirect the user to the website configured above when API returns a 401.
        //authManager.redirectWhenUnauthenticated();
        $rootScope.$on('$stateChangeSuccess', function() {
            //console.log('$stateChangeSuccess');
        });
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (typeof toState.data === 'object') {
                if (!Auth.checkPermissionForView(toState.data)) {
                    event.preventDefault();
                    $state.go(toState.data.redirectTo);
                }
            }
        });
        $rootScope.$on('$stateChangeError', function() {
            //console.log('$stateChangeError');
        });
    }
    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        // Permite que las URLs no lleven el caracter
        // # al inicio (utilizado por defecto por angular)
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.tpl.html',
                controller: 'HomeController',
                controllerAs: 'homectrl'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'views/contacto.tpl.html',
                controller: 'ContactoController',
                controllerAs: 'contactctrl'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'views/about.tpl.html',
                controller: 'AboutController',
                controllerAs: 'aboutctrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.tpl.html',
                controller: 'DashboardController',
                controllerAs: 'dashboardctrl',
                data: {
                    authorization: true,
                    redirectTo: 'contact'
                }
            })
            .state('todolist', {
                url: '/todolist',
                templateUrl: 'views/todolist.tpl.html',
                controller: 'TodoListController',
                controllerAs: 'todolistctrl',
                resolve: {
                    dataInitial: function(dataService) {
                        return dataService.serviceTodoList.query().$promise.then(function(data) {
                            return data;
                        });
                    }
                },
                data: {
                    authorization: true,
                    redirectTo: 'contact'
                }
            });
    }

})();