var gulp = require('gulp');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var cssnano = require('gulp-cssnano');
var fs = require("fs");
var inject = require('gulp-inject-string');
var runSequence = require('gulp-run-sequence');

gulp.task('minify', function () {
    gulp.src('./css/style.css')
        .pipe(plumber())
        .pipe(cssnano())
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
    var cssContent = fs.readFileSync("./dist/style.css", "utf8");
    cssContent = cssContent.replace('@charset "utf-8";', "");
    cssContent = cssContent.replace(/\.\.\/images\//ig,"images/");

    var reg = new RegExp("<style amp-custom>.*<\/style>","ig");

    gulp.src("./index_amp.html")
        .pipe(replace(reg,"<style amp-custom></style>"))
        .pipe(inject.after('style amp-custom>', cssContent))
        .pipe(gulp.dest("./"));

});
