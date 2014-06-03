var FIXTURES_PATH = 'test/fixtures',
    fs = require('fs'),
    Parsedown = require('../parsedown.js');

exports.testIntegration = function(test) {
    var files = fs.readdirSync(FIXTURES_PATH);

    test.expect(files.length / 2);

    files.forEach(function(file) {
        var inputMarkdown, expected, expectedHTML, actualHTML;
        if (file.indexOf('.md') >= 0) {
            inputMarkdown = fs.readFileSync(FIXTURES_PATH + '/' + file);
            expected = file.substring(0, file.indexOf('.md')) + '.html';
            expectedHTML = fs.readFileSync(FIXTURES_PATH + '/' + expected);
            actualHTML = Parsedown.text(inputMarkdown);
            test.equal(actualHTML, expectedHTML);
        }
    });
    test.done();
};
