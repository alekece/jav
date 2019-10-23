var blessed = require("blessed"),
    styles = require("../styles")

function helper(options) {
    options.content = 'Help'
    options.tag = true
    options.border = { type: 'line' }

    var box = blessed.box(styles.helper(options))

    var index = 0

    options.shortcuts.forEach(function(shortcut) {
        var leftOffset = Math.floor(index / options.shortcutByColumn) * 10
        var topOffset = index % options.shortcutByColumn + 2

        console.log(index)

        blessed.text(styles.label({
            parent: box,
            left: leftOffset,
            top: topOffset,
            name: shortcut.key,
            content: shortcut.key,
        }))

        blessed.text(styles.label({
            parent: box,
            left: leftOffset + shortcut.key.length + 1,
            top: topOffset,
            name: shortcut.desc,
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