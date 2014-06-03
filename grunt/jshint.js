var extend = require('underscore').extend,
    options = {
        boss: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        eqnull: true,
        forin: true,
        immed: true,
        indent: 4,
        jquery: false,
        latedef: true,
        maxdepth: 5,
        maxcomplexity: 9,
        maxlen: 80,
        maxparams: 3,
        maxstatements: 10,
        newcap: true,
        noarg: true,
        node: true,
        nonbsp: true,
        nonew: true,
        plusplus: true,
        quotmark: 'single',
        sub: true,
        trailing: true,
        undef: true,
        unused: true
    },
    gruntOptions = options,
    distOptions = options,
    devOptions = extend({}, distOptions, {
        devel: true
    }),
    sourcePath = '<%= sourcePath %>/parsedown.js';

module.exports = {
    dev: {
        src: sourcePath,
        options: devOptions
    },
    dist: {
        src: sourcePath,
        options: distOptions
    },
    gruntfile: {
        src: '<%= gruntfilePath %>',
        options: gruntOptions
    },
    gruntOptions: {
        src: '<%= gruntOptionsPath %>/**/*.js',
        options: gruntOptions
    }
};
