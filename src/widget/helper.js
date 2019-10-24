var blessed = require("blessed"),
    styles = require("../styles")

function helper(options) {
    options.label = ' Help '
    options.tag = true
    options.border = { type: 'line' }
    options.shortcuts.push({
        key: 'q',
        desc: 'Quit',
        callback: () => {
            return process.exit(0)
        }
    })

    var box = blessed.box(styles.helper(options))

    function stringifyKey(key) {
        return key instanceof Array ? key.join(', ') : key
    }

    var index = 0
    var maxLength = Math.max.apply(null, options.shortcuts.map(x => stringifyKey(x.key).length + x.desc.length + 1))

    options.shortcuts.forEach(function(shortcut) {
        var leftOffset = Math.floor(index / options.shortcutByColumn) * maxLength + 1
        var topOffset = index % options.shortcutByColumn + 1
        var keys = stringifyKey(shortcut.key)

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