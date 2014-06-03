module.exports = {
    fixtures: {
        files: [
            {
                expand: true,
                cwd: '<%= originalFixturesPath %>/',
                src: [
                    '**/*.html',
                    '**/*.md'
                ],
                dest: '<%= fixturesPath %>/'
            }
        ]
    }
};
