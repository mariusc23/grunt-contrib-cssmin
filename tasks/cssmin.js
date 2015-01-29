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
var Concat = require('concat-with-sourcemaps');
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

      var concat = new Concat(true, file.dest, options.separator);

      var max = valid.map(function(file) {
        var src = grunt.file.read(file);

        var srcMap;
        if (typeof options.sourceMap === 'string' && grunt.file.exists(options.sourceMap)) {
          srcMap = grunt.file.read(options.sourceMap);
        }
        else if (options.sourceMap === true && grunt.file.exists(file + '.map')) {
          srcMap = grunt.file.read(file + '.map');
        }

        var min = minify(src, _.merge(options, {
          sourceMap: srcMap,
          relativeTo: path.dirname(file)
        }));

        concat.add(file, min.styles, min.sourceMap);

        return src;
      }).join('');

      if (concat.content.toString().length === 0) {
        return grunt.log.warn('Destination not written because minified CSS was empty.');
      }

      grunt.file.write(file.dest, concat.content.toString());

      if (options.sourceMap) {
        grunt.file.write(file.dest + '.map', concat.sourceMap);
      }

      grunt.verbose.writeln('File ' + chalk.cyan(file.dest) + ' created: ' + maxmin(max, concat.content.toString(), options.report === 'gzip'));
    });
  });
};
