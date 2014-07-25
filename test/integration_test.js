var FIXTURES_PATH = 'test/fixtures',
    fs = require('fs'),
    Parsedown = require('../parsedown.js').Parsedown;

exports.testIntegration = function(test) {
    var files = fs.readdirSync(FIXTURES_PATH),
        parsedown = new Parsedown();

    test.expect(files.length / 2);

    files.forEach(function(file) {
        var inputMarkdown, expected, expectedHTML, actualHTML, testName;
        if (file.indexOf('.md') >= 0) {
            inputMarkdown = fs.readFileSync(FIXTURES_PATH + '/' + file, {
                encoding: 'utf8'
            });
            testName = file.substring(0, file.indexOf('.md'));
            expected = testName + '.html';
            expectedHTML = fs.readFileSync(FIXTURES_PATH + '/' + expected, {
                encoding: 'utf8'
            }).replace(/\n$/, '');
            actualHTML = parsedown.text(inputMarkdown);
            test.equal(actualHTML, expectedHTML, testName + ' did not match expected HTML!');
        }
    });
    test.done();
};
