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
    d = new Date(),
    df = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes(),
    headerComment = '/*Generated on:' + df + '*/';

//En la siguiente variable agregaremos las carpetas de origen/destino
var bases = {
    app: 'app/',
    dist: 'dist/'
};

//Opciones adicionales para la compatibilizacion de codigo angular
var opts = {
    conditionals: true,
    spare: true
};

//Ubicaciones de los distintos componentes de nuestra aplicacion
var paths = {
    //Incluiremos todos los componentes dentro de app, exceptuando la carpeta lib (administrada por bower)
    scripts: ['**/*.js', '!lib/**/*.*'],
    //Direccion de las librerias, estas las copiaremos integramente
    libs: ['lib/**/*.*'],
    //Ubicacion de los archivos de estilos que minificaremos
    styles: ['res/css/**/*.css'],
    //los archivos html que incluiremos en la minificacion
    html: ['**/*.html'],
    //La ruta de las imagenes que minificaremos
    images: ['res/img/**/*.*'],
    //Otros extras
    extras: []
};

// Limpiar la carpeta DIST
gulp.task('clean', function() {
    return gulp.src(bases.dist)
        .pipe(clean());
});

// Servidor web de desarrollo
gulp.task('server', function() {
    connect.server({
        root: 'app',
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
        root: './dist',
        hostname: '0.0.0.0',
        port: 8080,
        livereload: true,
        middleware: function(connect, opt) {
            return [historyApiFallback({})];
        }
    });
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
    return gulp.src('./app/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
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
    gulp.src('./app/**/*.html')
        .pipe(connect.reload());
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html

gulp.task('inject', function() {
    var sources = gulp.src(['./app/scripts/**/*.js', './app/stylesheets/**/*.css'], { read: false }, { relative: true });

    return gulp.src('index.html', { cwd: './app' })
        .pipe(inject(sources, { ignorePath: '/app' }))
        .pipe(gulp.dest('./app'));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function() {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: './app/lib'
        }))
        .pipe(gulp.dest('./app'));
});

// Compila las plantillas HTML parciales a JavaScript
// para ser inyectadas por AngularJS y minificar el código
gulp.task('templates', function() {
    gulp.src('./app/views/**/*.tpl.html')
        .pipe(templateCache({
            root: 'views/',
            module: 'blog.templates',
            standalone: true,
            //templateBody: '$templateCache.put("<%= url %>", "<%= contents %>");'
        }))
        .pipe(gulp.dest('./app/scripts'));
});

// Comprime los archivos CSS y JS enlazados en el index.html
// y los minifica.
gulp.task('compress', function() {
    gulp.src('./app/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify({ mangle: false })))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./dist'));
});

// Copia el contenido de los estáticos e index.html al directorio
// de producción sin tags de comentarios
gulp.task('copy', function() {
    gulp.src('./app/index.html')
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
    gulp.src('./app/lib/font-awesome/fonts/**')
        .pipe(gulp.dest('./dist/fonts'));
});

// Elimina el CSS que no es utilizado para reducir el pesodel archivo
gulp.task('uncss', function() {
    gulp.src('./dist/css/style.min.css')
        .pipe(uncss({
            html: ['./app/index.html', './app/views/post-list.tpl.html', './app/views/post-detail.tpl.html', './app/views/post-create.tpl.html']
        }))
        .pipe(gulp.dest('./dist/css'));
});

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
    gulp.watch(['./app/**/*.html'], ['html']);
    gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
    gulp.watch(['./app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
    gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
    gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server', 'templates', 'inject', 'wiredep', 'watch']);
gulp.task('build', ['templates', 'compress', 'copy', 'uncss']);