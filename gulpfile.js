'use strict';
const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');
const nsp = require('gulp-nsp');

gulp.task('static', function() {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function(cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function() {
  return gulp.src('lib/**/*.js')
    .pipe(excludeGitignore());
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static']);
