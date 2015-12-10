gulp-fontello
=============

Import svg files to Fontello icon font project, use svg filename as glyph name. Also provide task for auto download exported css and font files into desinated folder.


[![Build Status](https://david-dm.org/gillbeits/gulp-fontello.png)](https://david-dm.org/gillbeits/gulp-fontello)
[![npm version](https://badge.fury.io/js/gulp-fontello.svg)](https://badge.fury.io/js/gulp-fontello)
[![Build Status](https://travis-ci.org/gillbeits/gulp-fontello.png?branch=master)](https://travis-ci.org/gillbeits/gulp-fontello)

[![NPM](https://nodei.co/npm/gulp-fontello.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-fontello/)

## Install

```bash
npm install --save-dev gulp-fontello
```

## Usage

* You should get a `config.json` file from <http://fontello.com> project and save it somewhere in your project;
* create Gulp Task:

```javascript
var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')()
;

gulp.task('glyph', function () {
  return gulp.src('config.json')
    .pipe($.fontello())
    .pipe($.print())
    .pipe(gulp.dest('dist'))
});
```

## Options

```javascript
var options = {
  host          :         'http://fontello.com',      // Host for response
  font          :         'font',                     // Destination dir for Fonts and Glyphs
  css           :         'css',                      // Destination dir for CSS Styles,
  assetsOnly    :         true                        // extract from ZipFile only CSS Styles and Fonts exclude config.json, LICENSE.txt, README.txt and demo.html
}
```