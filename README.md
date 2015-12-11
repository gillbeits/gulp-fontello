gulp-fontello
=============

Import svg files to Fontello icon font project, use svg filename as glyph name. Also provide task for auto download exported css and font files into destinated folder.


[![Dependencies Status](https://david-dm.org/gillbeits/gulp-fontello.png)](https://david-dm.org/gillbeits/gulp-fontello)
[![Npm Version](https://badge.fury.io/js/gulp-fontello.svg)](https://www.npmjs.com/package/gulp-fontello)
[![Month Downloads](https://img.shields.io/npm/dm/gulp-fontello.svg)](http://npm-stat.com/charts.html?package=gulp-fontello)
[![Build Status](https://travis-ci.org/gillbeits/gulp-fontello.png?branch=master)](https://travis-ci.org/gillbeits/gulp-fontello)
[![Npm Licence](https://img.shields.io/npm/l/gulp-fontello.svg)](https://www.npmjs.com/package/gulp-fontello)

[![PayPal Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=K3QX22PH63BZ4)

[![NPM](https://nodei.co/npm/gulp-fontello.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-fontello/)

## Install

```bash
npm install --save-dev gulp-fontello
```
## Default Zip Archive Structure

<pre>
├── LICENSE.txt
├── README.txt
├── config.json
├── css
│   ├── animation.css
│   ├── fontello-codes.css
│   ├── fontello-embedded.css
│   ├── fontello-ie7-codes.css
│   ├── fontello-ie7.css
│   └── fontello.css
├── demo.html
└── font
    ├── fontello.eot
    ├── fontello.svg
    ├── fontello.ttf
    └── fontello.woff
</pre>

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

## CLI Arguments

Script can accept input parameters in CLI mode and extends options parameters in gulp task, for example:

* Gulp global install

```bash
    gulp <fontello-task> --no-assets-only    
```
* Gulp local install (_For this make `gulp` scripts in package.json_)

```bash
    npm run gulp <fontello-task> -- --no-assets-only
```

### Available arguments

* `--host=host`         Host for response
* `--css=css`           Destination dir for Fonts and Glyphs
* `--font=font`         Destination dir for CSS Styles
* `--no-assets-only`    Extract from ZipFile CSS Styles and Fonts `with` config.json, LICENSE.txt, README.txt and demo.html
* `--assets-only`       Extract from ZipFile only CSS Styles and Fonts `exclude` config.json, LICENSE.txt, README.txt and demo.html
