/**
 * Created by gillbeits on 01/04/15.
 */

var
  HOST        = 'http://fontello.com',

  needle      = require('needle'),
  through2    = require('through2'),
  AdmZip      = require('adm-zip'),
  path        = require('path'),
  $           = require('gulp-util'),
  yargs       = require('yargs'),
  extend      = require('util')._extend,

  PluginError = $.PluginError
  ;

const PLUGIN_NAME = 'gulp-fontello';

function fontello (opts) {
  "use strict";

  opts = extend({
    assetsOnly: true,
    host: HOST
  }, extend(opts || {}, yargs.argv));

  return through2.obj(function (file, enc, callback) {
    var self = this;

    var stream = through2.obj(function (file) {
      if (!file.toString()) {
        throw new PluginError(PLUGIN_NAME, "No session at Fontello for zip archive");
      }

      needle.get(opts.host + "/" + file.toString() + "/get", function(error, response) {
        if (error) {
          throw error;
        }

        var
          zip = new AdmZip(response.body),
          zipEntries = zip.getEntries()
          ;

        zipEntries.forEach(function(zipEntry) {
          var dirName, fileName, pathName, _ref;

          if (zipEntry.isDirectory) return;

          pathName = zipEntry.entryName;
          dirName = (_ref = path.dirname(pathName).match(/\/([^\/]*)$/)) != null ? _ref[1] : void 0;
          fileName = path.basename(pathName);

          if (opts.assetsOnly && !dirName) return;

          var content = zipEntry.getData();
          if (opts['font'] && opts['font'] != 'font' && path.extname(fileName) == '.css') {
            content = new Buffer(String(content).replace(new RegExp('\.\.\/font\/', 'g'), '../' + opts['font'] + '/'));
          }

          var file = new $.File({
            cwd : "./",
            path : (dirName ? ((opts[dirName] ? opts[dirName] : dirName) + '/') : '')+ fileName,
            contents: content
          });
          self.push(file);
        });

        callback();
      });
    });

    needle.post(opts.host, {
      config: {
        buffer: file.contents,
        filename: 'fontello.json',
        content_type: 'application/json'
      }
    }, { multipart: true }).pipe(stream);
  });
}

module.exports = fontello;
