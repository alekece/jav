const foregroundColor = '#ecf0f1'
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
        fg: foregroundColor
    }

    return options
}

function form(options) {
    options.style = {
        border: {
            type: borderType
        }
    }

    return options
}

function table(options) {
    options.fg = foregroundColor
    options.selectedFg = foregroundColor
    options.selectedBg = highlightBackgroundColor

    return options
}

function button(options) {
    return options
}

function helper(options) {
    options.style = {
        fg: foregroundColor,
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
    button: button,
    table: table,
    form: form
}