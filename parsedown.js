(function(global, undefined) {

    // For noConflict
    var previousParsedown = global.Parsedown;

    function Parsedown() {

    }

    if (global.exports !== undefined) {
        if (global.module !== undefined && global.module.exports) {
            global.exports = global.module.exports = Parsedown;
        }
        global.exports.Parsedown = Parsedown;
    } else {
        global.Parsedown = Parsedown;
    }

    Parsedown.noConflict = function() {
        global.Parsedown = previousParsedown;
        return Parsedown;
    };

    Parsedown.text = function(markdown) {
        // Dummy
        return '<' + markdown + '>';
    };
    
}(this));