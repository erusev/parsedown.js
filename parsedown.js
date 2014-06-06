(function(global, undefined) {

    // For noConflict
    var previousParsedown = global.Parsedown,
        defaultBlockTypes = {
            '#': [ 'Atx' ],
            '*': [ 'Rule', 'List' ],
            '+': [ 'List' ],
            '-': [ 'Setext', 'Table', 'Rule', 'List' ],
            '0': [ 'List' ],
            '1': [ 'List' ],
            '2': [ 'List' ],
            '3': [ 'List' ],
            '4': [ 'List' ],
            '5': [ 'List' ],
            '6': [ 'List' ],
            '7': [ 'List' ],
            '8': [ 'List' ],
            '9': [ 'List' ],
            ':': [ 'Table' ],
            '<': [ 'Comment', 'Markup' ],
            '=': [ 'Setext' ],
            '>': [ 'Quote' ],
            '_': [ 'Rule' ],
            '`': [ 'FencedCode' ],
            '|': [ 'Table' ],
            '~': [ 'FencedCode' ]
        },
        defaultDefinitionTypes = {
            '[': [ 'Reference' ]
        },
        defaultUnmarkedBlockTypes = [
            'CodeBlock'
        ],
        defaultSpecialCharacters = [
            '\\',
            '`',
            '*',
            '_',
            '{',
            '}',
            '[',
            ']',
            '(',
            ')',
            '>',
            '#',
            '+',
            '-',
            '.',
            '!'
        ],
        defaultTextLevelElements = [
            'a',
            'abbr',
            'acronym',
            'b',
            'basefont',
            'bdo',
            'big',
            'blink',
            'br',
            'cite',
            'code',
            'del',
            'em',
            'font',
            'i',
            'ins',
            'listing',
            'mark',
            'marquee',
            'nextid',
            'nobr',
            'q',
            'rp',
            'rt',
            'ruby',
            's',
            'small',
            'spacer',
            'span',
            'strike',
            'strong',
            'sub',
            'sup',
            'time',
            'tt',
            'u',
            'var',
            'wbr',
            'xm'
        ],
        defaultSpanTypes = {
            '!': [ 'Link' ],
            '&': [ 'Ampersand' ],
            '*': [ 'Emphasis' ],
            '/': [ 'Url' ],
            '<': [ 'UrlTag', 'EmailTag', 'Tag', 'LessThan' ],
            '[': [ 'Link' ],
            '_': [ 'Emphasis' ],
            '`': [ 'InlineCode' ],
            '~': [ 'Strikethrough' ],
            '\\': [ 'EscapeSequence' ],
        },
        defaultSpanMarkerList = '*_!&[</`~\\',
        defaultStrongRegex = {
            '*': /^[*]{2}((?:[^*]|[*][^*]*[*])+?)[*]{2}(?![*])/,
            '_': /^__((?:[^_]|_[^_]*_)+?)__(?!_)/,
        },
        defaultEmRegex = {
            '*': /^[*](̨̨̨(?:[^*]|[*][*][^*]+?[*][*])+?)[*](?![*])/,
            '_': /^_((?:[^_]|__[^_]*__)+?)_(?!_)\b/,
        };

    function Parsedown() {

    }

    // Static methods
    // ==============

    Parsedown.noConflict = function() {
        global.Parsedown = previousParsedown;
        return Parsedown;
    };

    // Instance methods
    // ================

    Parsedown.prototype = {
        breaksEnabled: false,

        definitions: {},

        spanMarkerList: defaultSpanMarkerList,

        blockTypes: defaultBlockTypes,

        definitionTypes: defaultDefinitionTypes,

        unmarkedBlockTypes: defaultUnmarkedBlockTypes,

        specialCharacters: defaultSpecialCharacters,

        strongRegex: defaultStrongRegex,

        emRegex: defaultEmRegex,

        textLevelElements: defaultTextLevelElements,

        spanTypes: defaultSpanTypes,

        text: function(markdown) {

            // Make sure no definitions are set
            this.definitions = {};

            // Dummy
            return '<' + markdown + '>';
        },
        line: function(markdownLine) {
            // Dummy
            return '<' + markdownLine + '>';
        },
        setBreaksEnabled: function(breaksEnabled) {
            // Convert to boolean and set
            this.breaksEnabled = !!breaksEnabled;
            return this;
        }
    };

    if (global.exports !== undefined) {
        if (global.module !== undefined && global.module.exports) {
            global.exports = global.module.exports = Parsedown;
        }
        global.exports.Parsedown = Parsedown;
    } else {
        global.Parsedown = Parsedown;
    }

}(this));
