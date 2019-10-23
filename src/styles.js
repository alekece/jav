const foregroundColor = '#ecf0f1'
const backgroundColor = '#2c3e50'
const inputBackgroundColor = '#34495e'

function input(options) {
    options.style = {
        bg: inputBackgroundColor,
        focus: {
            bg: 'red'
        },
        hover: {
            bg: 'red'
        }
    }

    return options
}

function button(options) {
    options.style = {
        bg: 'blue',
        focus: {
            bg: 'red'
        },
        hover: {
            bg: 'red'
        }
    }

    return options
}

function label(options) {
    options.style = {
        bg: backgroundColor,
        fg: foregroundColor
    }

    return options
}

function table(options) {
    options.fg = 'white'
    options.selectedFg = 'white'
    options.selectedBg = 'blue'
    return options
}

function helper(options) {
    options.style = {
        fg: foregroundColor,
        bg: backgroundColor,
        border: {
            bg: backgroundColor,
            type: 'line'
        }
    }

    return options
}

module.exports = {
    input: input,
    helper: helper,
    label: label,
    button: button,
    table: table
}