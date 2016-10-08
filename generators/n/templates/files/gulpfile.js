'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
gulp.task('i', () => {
  return gulp.src([
      'node_modules/react/dist/react.js',
      'node_modules/react-dom/dist/react-dom.js'
    ])
    .pipe(gulp.dest('build'));
});
