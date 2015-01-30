/*
 * grunt-contrib-cssmin
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Tim Branyen, contributors
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var CleanCSS = require('clean-css');
var chalk = require('chalk');
var maxmin = require('maxmin');
var _ = require('lodash');

module.exports = function(grunt) {
  var minify = function(source, options) {
    try {
      return new CleanCSS(options).minify(source);
    } catch (err) {
      grunt.log.error(err);
      grunt.fail.warn('CSS minification failed.');
    }
  };

  grunt.registerMultiTask('cssmin', 'Minify CSS', function() {
    var options = this.options({
      report: 'min',
      sourceMap: true,
      separator: ''
    });

    this.files.forEach(function(file) {
      var valid = file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file ' + chalk.cyan(filepath) + ' not found.');
          return false;
        } else {
          return true;
        }
      });

      var max = valid.map(function(srcFile) {
        var src = grunt.file.read(srcFile);
        return src;
      }).join('');

      var minOptions = _.merge(options, {
        target: file.dest
      });

      var min = minify(valid, minOptions);

      if (min.styles.toString().length === 0) {
        return grunt.log.warn('Destination not written because minified CSS was empty.');
      }

      if (options.sourceMap && min.sourceMap) {
        min.sourceMap._file = path.basename(file.dest);
        grunt.file.write(file.dest, min.styles + '/*# sourceMappingURL=' + path.relative(path.dirname(file.dest), file.dest + '.map') + ' */');
        grunt.file.write(file.dest + '.map', min.sourceMap.toString());
      } else {
        grunt.file.write(file.dest, min.styles);
      }

      grunt.verbose.writeln('File ' + chalk.cyan(file.dest) + ' created: ' + maxmin(max, min.styles.toString(), options.report === 'gzip'));
    });
  });
};
