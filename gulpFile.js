var os = require('os');
var Path = require('path');
var fs = require('fs');

var gulp = require("gulp"),
    ts = require("gulp-typescript"),
    merge = require('merge2'),
    fse = require('fs-extra'),
    sourcemaps = require('gulp-sourcemaps'),
    tslint = require("gulp-tslint");

gulp.task('default', ['compile-ts']);

gulp.task('tslint', function () {
    return gulp.src('./src/**/*.ts')
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report())
        .on("error", function () {
            process.exit(1);
        });;
});


// -----------------------------------
// Compilation
// -----------------------------------

gulp.task("compile-ts", ['tslint', 'clean'], function () {
    var tsProject = ts.createProject(
        './tsconfig.json', {
            typescript: require('typescript') // must be a project package dependency
        });

    var tsResult = gulp.src([
            "./src/**/*.ts"
        ])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .once("error", function () {
            this.once("finish", () => process.exit(1));
        });

    return merge([
        tsResult.dts
        .pipe(gulp.dest('dist')),
        tsResult.js
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: "../src/"
        }))
        .pipe(gulp.dest('dist'))
    ]);
});

gulp.task('clean', function (done) {
    fse.remove('dist', done);
});
