'use strict';

var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var tiny = require('gulp-tinypng-nokey');
var gcmq = require('gulp-group-css-media-queries');

//Sass to css
gulp.task('sass', function() {
  return gulp.src('src/scss/style.scss')
    .pipe(gp.plumber())
    .pipe(gp.sourcemaps.init())
    .pipe(gp.sass())
    .pipe(gp.autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
    .pipe(gcmq())
    .on("error", gp.notify.onError("Error: <%= error.message %>"))
    .pipe(gp.csso())
    .pipe(gp.sourcemaps.write())
    .pipe(gp.plumber.stop())
    .pipe(gulp.dest('src/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//BrowserSync
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
    browserSync.watch('src',browserSync.reload);
});

//Watch
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss',gulp.series('sass'));
});

//Default
gulp.task('default',gulp.series (
  gulp.parallel('sass'),
  gulp.parallel('watch','serve')
));

//Clean build folder
gulp.task('clean', function () {
    return gulp.src('build', {read: false})
    .pipe(gp.clean());
});

//CSS build
gulp.task('css:build', function() {
  return gulp.src('src/css/**/*.css')
  .pipe(gulp.dest('build/css/'));
})

//Scripts build
gulp.task('scripts:build', function() {
  return gulp.src('src/js/**.*js')
    .pipe(gp.uglify())
    .pipe(gulp.dest('build/js/'));
});

//TinyPng build
gulp.task('tinypng:build', function() {
    gulp.src('src/img/**/*.{png,jpg,jpeg,gif}')
      .pipe(tiny())
      .pipe(gulp.dest('build/img/'));
});

//SVG build
gulp.task('svg:build', function() {
    return gulp.src('src/img/svg/*.svg')
        .pipe(gp.svgmin())
        .pipe(gulp.dest('build/img/svg/'));
});

//HTML build
gulp.task('html:build', function() {
    return gulp.src('src/*.html')
      .pipe(gulp.dest('build/'));
});

//Fonts build
gulp.task('fonts:build', function() {
    return gulp.src('src/fonts/**/*')
      .pipe(gulp.dest('build/fonts/'));
});


//Build
gulp.task('build',gulp.series (
  gulp.parallel('html:build','fonts:build','css:build','scripts:build'),
  gulp.parallel('tinypng:build','svg:build')
));

