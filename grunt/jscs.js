module.exports = {
    options: {
        config: '<%= gruntOptionsPath %>/.jscs.json',
    },
    src: '<%= sourcePath %>/*.js',
    gruntfile: '<%= gruntfilePath %>',
    gruntTasks: '<%= gruntOptionsPath %>/**/*.js'
};
