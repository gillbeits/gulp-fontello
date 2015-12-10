/**
 * Created by gillbeits on 10.12.15.
 */

var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')()
;

$.fontello = require('../lib/index.js');

gulp.task('glyph', function () {
  var failed = false;
  function onError(error) {
    failed = true;
  }
  return gulp.src('config.json')
    .pipe($.plumber())
    .pipe($.fontello())
    .on('error', onError)
    .pipe(gulp.dest('dist'))
    .on('finish', function() {
      if (failed) {
        throw new Error('Tests failed');
      }
    });
});
