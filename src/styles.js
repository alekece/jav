const foregroundColor = '#ecf0f1'
const backgroundColor = 'black'
const highlightBackgroundColor = '#2a2c20'
const borderType = 'line'

function input(options) {
    options.style = {
        bg: highlightBackgroundColor
    }

    return options
}

function label(options) {
    options.style = {
        fg: foregroundColor,
        bg: backgroundColor
    }

    return options
}

function form(options) {
    options.style = {
        bg: backgroundColor,
        border: {
            type: borderType,
            bg: backgroundColor,
            fg: foregroundColor
        }
    }

    return options
}

function table(options) {
    options.fg = foregroundColor
    options.selectedFg = foregroundColor
    options.selectedBg = highlightBackgroundColor
    options.bg = backgroundColor
    options.style = {
        border: {
            fg: backgroundColor,
            bg: backgroundColor
        }
    }

    return options
}

function box(options) {
    options.style = {
        bg: backgroundColor,
        fg: foregroundColor,
        border: {
            type: 'line',
            fg: foregroundColor,
            bg: backgroundColor
        }
    }

    return options
}

function helper(options) {
    options.style = {
        fg: foregroundColor,
        bg: backgroundColor,
        border: {
            type: borderType
        }
    }

    return options
}

module.exports = {
    input: input,
    helper: helper,
    label: label,
    table: table,
    form: form,
    box: box
}