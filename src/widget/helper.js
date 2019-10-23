var blessed = require("blessed"),
    styles = require("../styles")

function helper(options) {
    options.label = ' Help '
    options.tag = true
    options.border = { type: 'line' }

    var box = blessed.box(styles.helper(options))

    var index = 0

    options.shortcuts.forEach(function(shortcut) {
        var leftOffset = Math.floor(index / options.shortcutByColumn) * 10 + 1
        var topOffset = index % options.shortcutByColumn + 1
        var keys = shortcut.key instanceof Array ? shortcut.key.join(', ') : shortcut.key

        console.log(index)

        blessed.text(styles.input({
            parent: box,
            left: leftOffset,
            top: topOffset,
            content: keys,
        }))

        blessed.text(styles.label({
            parent: box,
            left: leftOffset + keys.length + 1,
            top: topOffset,
            content: shortcut.desc,
        }))

        index += 1
    })

    box.applyKeysTo = function(element) {
        options.shortcuts.forEach(function(shortcut) {
            element.key(shortcut.key, shortcut.callback)
        })
    }
    
    return box
}

exports.helper = helper