module.exports = {
    'default': [
        'lint:dev',
        'style',
        'test'
    ],
    build: [
        'lint:dev',
        'test'
    ],
    'lint:dev': [
        'jshint:dev',
        'jshint:gruntfile',
        'jshint:gruntOptions'
    ],
    'lint:dist': [
        'jshint:dist',
        'jshint:gruntfile',
        'jshint:gruntOptions'
    ],
    style: [
        'jscs'
    ],
    dist: [
        'clean:pre-build',
        'lint:dist',
        'testprepare',
        'test',
        'concat',
        'uglify',
        'clean:post-build'
    ],
    testprepare: [
        'gitclone:fixtures',
        'copy:fixtures'
    ],
    test: [
        'nodeunit'
    ]
};
