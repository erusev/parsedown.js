module.exports = {
    options: {
        spawn: false
    },
    gruntfile: {
        files: '<%= gruntfilePath %>',
        tasks: [ 'jshint:gruntfile' ]
    },
    gruntOptions: {
        files: '<%= gruntOptionsPath %>/**/*.js',
        tasks: [ 'jshint:gruntOptions' ]
    },
    js: {
        files: '<%= sourcePath %>/*.js',
        tasks: [ 'jshint:dev' ]
    }
};
