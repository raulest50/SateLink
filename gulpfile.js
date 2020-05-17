
var gulp = require('gulp');
var sass = require('gulp-sass');
var browsersync = require('browser-sync');



// compile scss to css
function estilo(){
    // scss location
    return gulp.src('./scss/**/*.scss')
    //compile
    .pipe(sass())
    //compiled css destination
    .pipe(gulp.dest('./public/css'))
    // hacer streaming de los cambios a los navegadores
    .pipe(browsersync.stream());
}


// vigila cambios en el scss para actualizar automaticamente el navegador y asi hacer el workflow mas agil
function watch(){
    browsersync.init({
        server: {
            baseDir:'./np'
        }
    });
    gulp.watch('./scss/**/*.scss', estilo);
}


exports.estilo = estilo;
exports.watch = watch;