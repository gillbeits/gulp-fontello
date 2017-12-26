/**
 * Created by gillbeits on 01/04/15.
 */

var
  HOST        = 'http://fontello.com',

  fs          = require('fs'),
  crypto      = require('crypto'),
  needle      = require('needle'),
  through2    = require('through2'),
  AdmZip      = require('adm-zip'),
  path        = require('path'),
  Vinyl       = require('vinyl'),
  log         = require('fancy-log'),
  yargs       = require('yargs'),
  extend      = require('util')._extend,

  PluginError = require('gulp-error')
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

    var process = function (zipContents, callback) {
      var
        zip = new AdmZip(zipContents),
        zipEntries = zip.getEntries()
        ;

      zipEntries.forEach(function (zipEntry) {
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

        var file = new Vinyl({
          cwd: "./",
          path: (dirName ? ((opts[dirName] ? opts[dirName] : dirName) + '/') : '') + fileName,
          contents: content
        });
        self.push(file);
      });

      callback();
    };

    var fetchFromHost = function (callback) {
      var stream = through2.obj(function (file) {
        if (!file.toString()) {
          throw new PluginError(PLUGIN_NAME, "No session at Fontello for zip archive");
        }

        needle.get(opts.host + "/" + file.toString() + "/get", function (error, response) {
          if (error) {
            throw error;
          }

          // store in cache if configured
          if (opts.cache) {
            opts.cache.set(configHash, response.body);
          }

          process(response.body, callback);
        });
      });

      needle.post(opts.host, {
        config: {
          buffer: file.contents,
          filename: 'fontello.json',
          content_type: 'application/json'
        }
      }, {multipart: true}).pipe(stream);
    };

    // create SHA256 of the contents of the config file
    var configHash = crypto.createHash('sha256').update(file.contents).digest('hex');

    // use cache if configured
    if (opts.cache) {
      // check cache first
      opts.cache.get(configHash, function (error, cachedResponseBody) {
        // on cache err or empty response use normal fetch
        if (error || !cachedResponseBody) {
          fetchFromHost(callback);
        } else {
          log('using cached fontello zip for config with sha1: ' + configHash);
          process(cachedResponseBody, callback);
        }
      });
    } else {
      fetchFromHost(callback);
    }
  });
}

/**
 * simple file-system based cache
 *
 * @param cacheDir
 * @returns {{get: 'get', set: 'set'}}
 */
fontello.simpleFsCache = function(cacheDir) {
  if (!fs.lstatSync(cacheDir).isDirectory()) {
    fs.mkdirSync(cacheDir);
  }

  return {
    'get': function(file, cb) {
      fs.readFile(path.join(cacheDir, file + ".cached.zip"), function(err, result) {
        if (err || !result) {
          cb();
        } else {
          cb(null, result);
        }
      });
    },
    'set': function(file, response) {
      fs.writeFile(path.join(cacheDir, file + ".cached.zip"), response, function noop() {});
    }
  }
};

module.exports = fontello;
