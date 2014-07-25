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

    // http://phpjs.org/functions/strpbrk/
    // example: 'This is a Simple text.'.strpbrk('is');
    // returns: 'is is a Simple text.'
    // 
    // Extending String prototype for development purposes only
    String.prototype.strpbrk = function(charList) {
        for (var i = 0, len = this.length; i < len; i += 1) {
            if (charList.indexOf(this.charAt(i)) >= 0) {
                return this.slice(i);
            }
        }

        return false;
    };

    String.prototype.replaceAt = function(index, character) {
        return this.substr(0, index) +
            character +
            this.substr(index + character.length);
    }

    function isFunction(functionToCheck) {
        var objLiteral = {};
        return functionToCheck && objLiteral.toString.call(functionToCheck) === '[object Function]';
    }

    // Private helper functions
    // ========================

    // Parsedown "class" and constructor
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
            var markup, lines;

            // Make sure no definitions are set
            this.definitions = {};

            // standardize line breaks
            markdown = markdown.replace('\r\n', '\n');
            markdown = markdown.replace('\r', '\n');

            // replace tabs with spaces
            markdown = markdown.replace('\t', '    ');

            // remove surrounding line breaks
            markdown = markdown.replace(/^\n+|\n+$/g, '');

            // split text into lines
            lines = markdown.split('\n');

            // iterate through lines to identify blocks
            markup = this.lines(lines);

            // trim new lines
            markup = markup.trim('\n');

            return markup;
        },

        lines: function(lineArr) {
            var currentBlock = {},
                elements = [],
                _this = this;

            lineArr.every(function(lineStr) {
                var indent = 0,
                    text, line, block, marker, skip = false;

                if (lineStr.replace(/\s$/, '').length === 0) {
                    if (currentBlock) {
                        currentBlock.interrupted = true;
                    }

                    return true;
                }

                while (lineStr.charAt(indent) && lineStr.charAt(indent) === ' ') {
                    indent += 1;
                }

                text = indent > 0 ? lineStr.substr(indent) : lineStr;

                line = {
                    body: lineStr,
                    indent: indent,
                    text: text
                };

                if (currentBlock.incomplete) {
                    block = _this['addTo' + currentBlock.type](line, currentBlock);

                    if (block) {
                        currentBlock = block;

                        return true;
                    } else {
                        if (isFunction(_this['complete' + currentBlock.type])) {
                            currentBlock = _this['complete' + currentBlock.type](
                                currentBlock
                            );
                        }

                        currentBlock.incomplete = null;
                    }
                }

                marker = text.charAt(0);

                if (_this.definitionTypes[marker]) {
                    _this.definitionTypes[marker].every(function(definitionType) {
                        var definition = _this['identify' + definitionType](
                            line,
                            currentBlock
                        );

                        if (definition) {
                            _this.definitions[definitionType][definition.id] = definition.data;

                            skip = true;
                            return false;
                        }
                    });
                }

                if (skip) {
                    return true;
                }

                var blockTypes = _this.unmarkedBlockTypes;

                if (_this.blockTypes[marker]) {
                    blockTypes = blockTypes.concat(_this.blockTypes[marker]);
                }

                blockTypes.every(function(blockType) {
                    var block = _this['identify' + blockType](
                        line,
                        currentBlock
                    );

                    if (block) {
                        block.type = blockType;

                        if (!block.identified) {
                            elements.push(currentBlock.element);

                            block.identified = true;
                        }

                        if (isFunction(_this['addTo' + blockType])) {
                            block.incomplete = true;
                        }

                        currentBlock = block;

                        skip = true;
                        return false;
                    }

                    return true;
                });

                if (skip) {
                    return true;
                }

                if (currentBlock &&
                    currentBlock.element &&
                    !currentBlock.type &&
                    !currentBlock.interrupted) {
                    currentBlock.element.text += '\n' + text;
                } else {
                    elements.push(currentBlock.element);

                    currentBlock = _this.buildParagraph(line);

                    currentBlock.identified = true;
                }

                return true;
            });

            if (currentBlock.incomplete && isFunction(this['complete' + currentBlock.type])) {
                currentBlock = this['complete' + currentBlock.type](currentBlock);
            }

            elements.push(currentBlock.element);

            elements.shift();

            return this.elements(elements);
        },

        identifyAtx: function(line) {
            var level, text, block;

            if (line.text.length > 1) {
                level = 1;

                while (line.text.length > level && line.text.charAt(level) === '#') {
                    level += 1;
                }

                text = line.text.replace(/^(#|\s)+|(#|\s)+$/g, '');

                block = {
                    element: {
                        name: 'h' + level,
                        text: text,
                        handler: 'line'
                    }
                };
            }

            return block;
        },

        identifySetext: function(line, block) {
            var rtrim;

            block = block || undefined;

            if (!block || block.type || block.interrupted) {
                return;
            }

            rtrim = new RegExp(line.text.charAt(0) + '+$');

            if (line.text.replace(rtrim, '') === '') {
                block.element.name = (line.text.charAt(0) === '=') ?
                    'h1' :
                    'h2';
            }

            return block;
        },

        identifyCodeBlock: function(line) {
            var text, block;

            if (line.indent >= 4) {
                text = line.body.substr(4);

                block = {
                    element: {
                        name: 'pre',
                        handler: 'element',
                        text: {
                            name: 'code',
                            text: text
                        }
                    }
                };
            }

            return block;
        },

        identifyRule: function(line) {
            var ruleRegex = new RegExp(
                '^([' + line.text.charAt(0) + '])([ ]{0,2}\\1) {2,}[ ]*$',
                'g'
            ),
                block;

            if (ruleRegex.test(line.text)) {
                block = {
                    element: {
                        name: 'hr'
                    }
                };
            }

            return block;
        },

        identifyComment: function(line) {
            var block;

            if (line.text &&
                line.text.length > 3 &&
                line.text.charAt(3) === '-' &&
                line.text.charAt(2) === '-' &&
                line.text.charAt(1) === '!') {

                block = {
                    element: line.body,
                };

                if (line.text.match(/-->$/)) {
                    block.closed = true;
                }
            }

            return block;
        },

        addToComment: function(line, block) {
            if (block && block.closed) {
                return;
            }

            block.element += '\n' + line.body;

            if (line.text.match(/-->$/)) {
                block.closed = true;
            }

            return block;
        },

        identifyTable: function(line, block) {
            var alignmentsCount = 0,
                alignments = [],
                headerElements = [],
                divider, header;

            if (!block || !block.element || block.type || block.interrupted) {
                return;
            }

            if (block.element.text.indexOf('|') !== -1 &&
                line.text.replace(/(-|:|\|)+$/, '') === '') {

                divider = line.text.replace(/^(\s|\|)+|(\s|\|)+$/g, '');

                divider.split('|').forEach(function(dividerCell) {
                    var alignment;

                    dividerCell = dividerCell.trim();

                    if (dividerCell === '') {
                        return;
                    }

                    if (dividerCell.charAt(0) === ':') {
                        alignment = 'left';
                    }

                    if (dividerCell.substr(-1) === ':') {
                        alignment = (alignment === 'left') ?
                            'center' :
                            'right';
                    }

                    alignmentsCount += 1;
                    alignments.push(alignment);
                });

                header = block.element.text.replace(/^(\s|\|)+|(\s|\|)+$/g, '');

                header.split('|').forEach(function(headerCell, index) {
                    var headerElement;

                    headerCell = headerCell.trim();

                    headerElement = {
                        name: 'th',
                        text: headerCell,
                        handler: 'line'
                    };

                    if (alignmentsCount > index) {
                        headerElement.attributes = {
                            align: alignments[index]
                        };
                    }

                    headerElements.push(headerElement);
                });

                block = {
                    alignments: alignments,
                    identified: true,
                    element: {
                        name: 'table',
                        handler: 'elements',
                        text: [
                            {
                                name: 'thead',
                                handler: 'elements',
                                text: [
                                    {
                                        name: 'tr',
                                        handler: 'elements',
                                        text: headerElements
                                    }
                                ]
                            },
                            {
                                name: 'tbody',
                                handler: 'elements',
                                text: []
                            }
                        ]
                    }
                };

                return block;
            }
        },

        addToTable: function(line, block) {
            var elements = [],
                row, cells;

            if (line.text.charAt(0) !== '|' && line.text.indexOf('|') === -1) {
                return;
            }

            elements = [];

            row = line.text;

            row = row.replace(/^(\s|\|)+|(\s|\|)+$/g, '');

            cells = row.split('|');

            cells.forEach(function(cell, index) {
                var element;

                cell = cell.trim();

                element = {
                    name: 'td',
                    handler: 'line',
                    text: cell
                };

                if (block.alignments && block.alignments.length > index) {
                    element.attributes = {
                        align: block.alignments[index]
                    };
                }

                elements.push(element);
            });

            block.element.text[1].text.push({
                name: 'tr',
                handler: 'elements',
                text: elements
            });

            return block;
        },

        identifyMarkup: function(line) {
            var matches = line.text.match(/^<(\w[\w\d]*)(?:[ ][^>\/]*)?(\/?)[ ]*>/),
                block;

            if (!matches) {
                return;
            }

            if (this.textLevelElements.indexOf(matches[1]) >= 0) {
                return;
            }

            block = {
                element: line.body
            };

            if (matches[2] || matches[1] === 'hr' || line.text.match(/<\/'.matches[1].'>[ ]*$/)) {
                block.closed = true;
            } else {
                block.depth = 0;
                block.name = matches[1];
            }

            return block;
        },

        addToMarkup: function(line, block) {
            var rOpening, rClosing;

            if (block.closed) {
                return;
            }

            rOpening = new RegExp('<' + block.name + '([ ][^\/]+)?>', 'i');

            // opening tag 
            if (rOpening.test(line.text)) {
                block.depth += 1;
            }

            rClosing = new RegExp('</' + block.name + '>', 'i');

            // closing tag
            if (rClosing.test(line.text)) {
                if (block.depth > 0) {
                    block.depth -= 1;
                } else {
                    block.closed = true;
                }
            }

            block.element += '\n' + line.body;

            return block;
        },

        line: function(markdownLine) {
            var markup = '',
                remainder = markdownLine,
                markerPosition = 0,
                i, len, excerpt, excerptString,
                marker, skip, handler, spanType, span;

            while ((excerptString = remainder.strpbrk(this.spanMarkerList))) {

                skip = false;

                marker = excerptString.charAt(0);

                markerPosition += remainder.indexOf(marker);

                excerpt = {
                    text: excerptString,
                    context: markdownLine
                };

                len = this.spanTypes[marker].length;

                for (i = 0; i < len; i += 1) {
                    spanType = this.spanTypes[marker][i];

                    handler = 'identify' + spanType;

                    if (!isFunction(this[handler])) {
                        continue;
                    }

                    span = this[handler](excerpt);

                    if (!span) {
                        continue;
                    }

                    // The identified span can be ahead of the marker
                    if (span.position && span.position > markerPosition) {
                        continue;
                    }

                    // Spans that start at the position of their marker
                    // don't have to set a position
                    if (!span.position) {
                        span.position = markerPosition;
                    }

                    markup += this.readPlainText(
                        markdownLine.substr(0, span.position)
                    );

                    markup += span.markup ?
                        span.markup :
                        this.element(span.element);

                    markdownLine = markdownLine
                        .substr(span.position + span.extent);

                    remainder = markdownLine;

                    markerPosition = 0;

                    skip = true;

                    break;
                }

                if (!skip) {
                    remainder = excerptString.substr(1);

                    markerPosition += 1;
                }
            }

            markup += this.readPlainText(markdownLine);

            return markup;
        },

        setBreaksEnabled: function(breaksEnabled) {
            // Convert to boolean and set
            this.breaksEnabled = !!breaksEnabled;
            return this;
        },

        buildParagraph: function(line) {
            return {
                element: {
                    name: 'p',
                    text: line.text,
                    handler: 'line'
                }
            };
        },

        element: function(element) {
            var markup = '<' + element.name;

            if (element.attributes) {
                Object.keys(element.attributes).forEach(function(name) {
                    markup += ' ' +
                        name +
                        '="' +
                        element.attributes[name] +
                        '"';
                });
            }

            if (element.text) {
                markup += '>';

                if (element.handler) {
                    markup += this[element.handler](element.text);
                } else {
                    markup += element.text;
                }

                markup += '</' + element.name + '>';
            } else {
                markup += ' />';
            }

            return markup;
        },

        elements: function(elements) {
            var markup = '',
                _this = this;

            elements.every(function(element) {
                if (!element) {
                    return true;
                }

                markup += '\n';

                // because of Markup
                if (typeof element === 'string') {
                    markup += element;

                    return true;
                }

                markup += _this.element(element);

                return true;
            });

            markup += '\n';

            return markup;
        },

        readPlainText: function(text) {
            return text.replace(
                this.breaksEnabled ? '\n' : '  \n',
                '<br />\n'
            );
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
