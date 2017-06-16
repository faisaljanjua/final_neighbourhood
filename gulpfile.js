var gulp = require("gulp"),
    scss = require("gulp-scss"),
    jsmin = require("gulp-jsmin"),
    rename = require("gulp-rename"),
    connect = require("gulp-connect");

var path = {
    src: {
        js: 'dist/js/**/*.js',
        css: 'dist/css/**/*.scss',
        img: 'dist/img/*.*',
        html: './*.html'
    },
    build: {
        js: './js/',
        css: './css/',
        img: './img/'
    }
};

/* connect server */
gulp.task("connect", function () {
    connect.server({
        root: './',
        livereload: true
    });
});

/* SASS into css */
gulp.task("styles", function () {
    gulp.src(path.src.css)
        .pipe(scss())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
});

/* minified JS */
gulp.task("scripts", function () {
    gulp.src(path.src.js)
        .pipe(jsmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload());
});

/* html */
gulp.task("html",function(){
    gulp.src(path.src.html)
        .pipe(connect.reload());
});

/* watch */
gulp.task('watch', function(){
    gulp.watch([path.src.html],["html"]);
    gulp.watch([path.src.css],["styles"]);
    gulp.watch([path.src.js],["scripts"]);
});

gulp.task("default", ["connect", 'watch','html', 'styles', 'scripts']);