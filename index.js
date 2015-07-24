/**
 * Created by gillbeits on 01/04/15.
 */

var
  HOST        = 'http://fontello.com',

  needle      = require('needle'),
  through2    = require('through2'),
  unzip       = require('unzip'),
  path        = require('path'),
  $           = require('gulp-util'),

  PluginError = $.PluginError
  ;

const PLUGIN_NAME = 'gulp-fontello';

function fontello () {
  "use strict";

  return through2.obj(function (file, enc, callback) {

    if (!file.isBuffer() || !file.path) {
      throw new PluginError(PLUGIN_NAME, "No config file for Fontello");
    }
    var self = this;

    var stream = through2.obj(function (file) {
      if (!file.toString()) {
        throw new PluginError(PLUGIN_NAME, "No session at Fontello for zip archive");
      }

      var zipFile;
      zipFile = needle.get(HOST + "/" + file.toString() + "/get", function(error) {
        if (error) {
          throw error;
        }
      });

      zipFile
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
          var dirName, fileName, pathName, type, _ref, chunks = [];
          pathName = entry.path, type = entry.type;

          entry.pipe(through2.obj(function (chunk, enc, cb) {
            chunks.push(chunk);
            cb();
          }, function (cb) {
            if(chunks.length > 0){
              dirName = (_ref = path.dirname(pathName).match(/\/([^\/]*)$/)) != null ? _ref[1] : void 0;
              fileName = path.basename(pathName);
              entry.path = fileName;

              var file = new $.File({
                cwd : "./",
                path : (dirName ? (dirName + '/') : '')+ entry.path,
                contents: Buffer.concat(chunks)
              });
              self.push(file);
            }
            cb()
          }))
        }).on('close', function(){
          callback()
        });
    });

    needle.post(HOST, {
      config: {
        file: file.path,
        content_type: 'application/json'
      }
    }, { multipart: true }).pipe(stream);
  });
}

module.exports = fontello;