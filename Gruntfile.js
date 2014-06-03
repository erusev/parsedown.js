/*global module:false*/
module.exports = function(grunt) {

    'use strict';

    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> - ' +
         '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
         '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
         '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
         ' <%= pkg.author.name %>' +
         ', <%= _.pluck(pkg.contributors, "name").join(", ");' +
         ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        env: process.env,
        sourcePath: '.',
        testPath: 'test',
        originalRepository: 'https://github.com/erusev/parsedown.git',
        originalRepositoryClonePath: '<%= testPath %>/parsedown-php',
        originalFixturesPath: '<%= originalRepositoryClonePath %>/test/data',
        fixturesPath: '<%= testPath %>/fixtures',
        stagingPath: '.tmp',
        gruntfilePath: 'Gruntfile.js',
        gruntOptionsPath: 'grunt'
    };

    require('load-grunt-config')(grunt, {
        data: gruntConfig
    });
};
