// File: Gulpfile.js
'use strict';
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    angularFilesort = require('gulp-angular-filesort'),
    templateCache = require('gulp-angular-templatecache'),
    historyApiFallback = require('connect-history-api-fallback'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    minifyHTML = require('gulp-htmlmin'),
    header = require('gulp-header'),
    paths = require('./gulp-paths.json'),
    plugins = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    jscs = require('gulp-jscs'),
    del = require('del'),
    st = require('st'),
    d = new Date(),
    df = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes(),
    headerComment = '/*Generated on:' + df + '*/';



// Limpiar la carpeta DIST
gulp.task('clean', function() {
    return gulp.src(paths.dist)
        .pipe(clean());
});

// Servidor web de desarrollo
gulp.task('server', function() {
    connect.server({
        root: paths.app,
        hostname: '0.0.0.0',
        port: 8080,
        livereload: true,
        middleware: function(connect, opt) {
            return [historyApiFallback({})];
        }
    });
});

// Servidor web para probar el entorno de producción
gulp.task('server-dist', function() {
    connect.server({
        root: paths.dist,
        hostname: '0.0.0.0',
        port: 8081,
        livereload: true,
        middleware: function(connect, opt) {
            return [historyApiFallback({})];
        }
    });
});

// Starts a server with the docs
gulp.task('server-docs', ['ngdocs'], function() {
    plugins.connect.server({
        root: paths.docs,
        hostname: '0.0.0.0',
        port: 8082
    });
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
    return gulp.src(paths.js, { cwd: paths.app })
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

// Looks for code style errors in JS and prints them
gulp.task('jscs', function() {
    return gulp.src(paths.js, { cwd: paths.app })
        .pipe(plugins.jscs())
        .pipe(plugins.jscs.reporter())
        .pipe(plugins.jscs.reporter('fail'));
});

// Preprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
    gulp.src('./app/stylesheets/main.styl')
        .pipe(stylus({
            use: nib()
        }))
        .pipe(gulp.dest('./app/stylesheets'))
        .pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
    gulp.src(paths.htmls, { cwd: paths.app })
        .pipe(connect.reload());
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
    return gulp.src('index.html', { cwd: paths.app })
        .pipe(plugins.inject(
            gulp.src(paths.jsApp, { cwd: paths.app }).pipe(plugins.angularFilesort()), {
                relative: true,

            }))
        .pipe(plugins.inject(
            gulp.src(paths.css, { cwd: paths.app, read: false }), {
                relative: true
            }))
        .pipe(gulp.dest(paths.app));
});

// Inyecta las librerias que instalemos vía Bower blocks "bower:xx"
gulp.task('wiredep', ['inject'], function() {
    return gulp.src('index.html', { cwd: paths.app })
        .pipe(wiredep({
            'ignorePath': '..',
            directory: paths.lib
        }))
        .pipe(gulp.dest(paths.app));
});

// Compila las plantillas HTML parciales a JavaScript
// para ser inyectadas por AngularJS y minificar el código
gulp.task('template:init', function() {
    return gulp.src(paths.views, { cwd: paths.app })
        .pipe(plugins.htmlmin({ collapseWhitespace: true }))
        .pipe(templateCache({
            root: 'views/',
            module: 'blog.templates',
            standalone: true,
            moduleSystem: 'IIFE',
            //templateBody: '$templateCache.put("<%= url %>", "<%= contents %>");'
        }))
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(gulp.dest(paths.scripts));
});

gulp.task('template:app', function() {
    return gulp.src(paths.views, { cwd: paths.app })
        .pipe(templateCache({
            root: 'views/',
            module: 'blog.templates',
            standalone: true
        }))
        .pipe(gulp.dest(paths.scripts));
});
gulp.task('templates:build', function() {
    return gulp.src(paths.views, { cwd: paths.app })
        .pipe(plugins.htmlmin({ collapseWhitespace: true }))
        .pipe(plugins.angularTemplatecache({
            root: 'views/',
            module: 'blog.templates',
            standalone: true,
            moduleSystem: 'IIFE',
        }))
        .pipe(plugins.uglify({
            mangle: true
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('templates:concat', ['templates:build'], function() {
    return gulp.src([paths.jsMin, paths.templatesCache], { cwd: paths.dist })
        .pipe(plugins.concat(paths.jsMin))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('templates:clean', ['templates:concat'], function() {
    return del(paths.dist + paths.templatesCache);
});

// Comprime los archivos CSS y JS enlazados en el index.html
// y los minifica.
gulp.task('compress', ['wiredep'], function() {
    return gulp.src('index.html', { cwd: paths.app })
        .pipe(plugins.useref({ searchPath: ['./', paths.app] }))
        .pipe(plugins.if('*/app.min.js', plugins.replaceTask({
            patterns: [{
                    match: 'debugInfoEnabled',
                    replacement: 'false'
                },
                {
                    match: 'debugLogEnabled',
                    replacement: 'false'
                }
            ]
        })))
        .pipe(plugins.if('**/*.js', plugins.ngAnnotate()))
        .pipe(plugins.if('**/*.js', plugins.uglify({
            mangle: true
        }).on('error', plugins.util.log)))
        .pipe(plugins.if('**/*.css', plugins.cssnano()))
        .pipe(header(headerComment))
        .pipe(gulp.dest(paths.dist));
});

// Copia el contenido de los estáticos e index.html al directorio
// de producción sin tags de comentarios
gulp.task('copy', function() {
    gulp.src('./index.html', { cwd: paths.app })
        .pipe(useref())
        .pipe(gulp.dest(paths.dist));
    gulp.src('./app/lib/font-awesome/fonts/**')
        .pipe(gulp.dest(paths.dist + '/fonts'));
});

// Elimina el CSS que no es utilizado para reducir el pesodel archivo
gulp.task('uncss', function() {
    gulp.src('css/style.min.css', { cwd: paths.dist })
        .pipe(uncss({
            html: ['./app/index.html', './app/views/post-list.tpl.html', './app/views/post-detail.tpl.html', './app/views/post-create.tpl.html']
        }))
        .pipe(gulp.dest(paths.dist + '/css'));
});

//crea la documentacion
gulp.task('ngdocs', [], function() {
    var gulpDocs = require('gulp-ngdocs');
    var options = {
        scripts: ['http://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js', ],
        html5Mode: false,
        //startPage: '/api',
        title: 'Web App Documentation',
        inlinePartials: true,
        bestMatch: true,
        //image: "path/to/my/image.png",
        //imageLink: "http://my-domain.com",
        // titleLink: "/api"
    };
    return gulp.src(paths.jsAppScripts)
        .pipe(gulpDocs.process(options))
        .pipe(gulp.dest(paths.docs));
});

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
    gulp.watch(['./app/**/*.html'], ['html']);
    gulp.watch(paths.js, { cwd: paths.app }, ['jshint', 'jscs', 'inject']);
    gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
    gulp.watch(paths.css, { cwd: paths.app }, ['inject']);
    gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
    gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['watch']);
gulp.task('serverApp', ['server', 'watch']);
gulp.task('build', function(done) {
    //runSequence('jshint', 'jscs', 'clean', 'compress', 'templates:clean', 'copy:assets', done);
    runSequence('clean', 'compress', 'templates:clean', 'copy', 'uncss', done);
});
gulp.task('start', function(done) {
    runSequence('template:init', 'inject', 'wiredep', done);
});