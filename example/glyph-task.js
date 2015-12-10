/**
 * Created by gillbeits on 10.12.15.
 */

var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')()
;

$.fontello = require('../lib/index.js');

gulp.task('glyph', function () {
  return gulp.src('config.json')
    .pipe($.fontello())
    .pipe($.print())
    .pipe(gulp.dest('dist'))
});
