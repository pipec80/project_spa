(function() {
    'use strict';

    angular.module('Config', [])
        .constant('APP_NAME', 'App Tareas')
        //.constant('moment', moment)
        .constant('APP_VERSION', '1.0')
        .constant('VERSION_TAG', /*VERSION_TAG_START*/ new Date().getTime() /*VERSION_TAG_END*/ )
        .constant('DEBUG_MODE', true)
        .constant('APIURL', 'http://localhost:3000/api');
})();