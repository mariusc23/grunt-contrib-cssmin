'use strict';
var grunt = require('grunt');

exports.cssmin = {
  main: function(test) {
    test.expect(1);

    var expect = grunt.file.read('test/expected/style.css');
    var result = grunt.file.read('tmp/style.css');
    test.equal(expect, result, 'should concat and minify an array of css files in order using clean-css');

    test.done();
  },
  empty: function(test) {
    test.expect(1);

    test.ok(!grunt.file.exists('tmp/idontexist.css'), 'Empty minified file should not exist');

    test.done();
  },
  imports: function(test) {
    test.expect(1);

    var expect = grunt.file.read('test/expected/inline_import.css');
    var result = grunt.file.read('tmp/inline_import.css');
    test.equal(expect, result, 'should inline @import');

    test.done();
  },
  sourceMaps: function(test) {
    test.expect(1);

    var expect = grunt.file.read('test/expected/source_map.css.map');
    var result = grunt.file.read('tmp/source_map.css.map');
    test.equal(expect, result, 'should generate sourcemap');

    test.done();
  }
};
