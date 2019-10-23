const foregroundColor = '#ecf0f1'
const backgroundColor = '#2c3e50'
const inputBackgroundColor = '#34495e'

function input() {
    return {
        bg: inputBackgroundColor,
        focus: {
            bg: 'red'
        },
        hover: {
            bg: 'red'
        }
    }
}

function button() {
    return {
        bg: 'blue',
        focus: {
            bg: 'red'
        },
        hover: {
            bg: 'red'
        }
    }
}

function label() {
    return {
        bg: backgroundColor,
        fg: foregroundColor
    }
}

function helper() {
    return {
        fg: foregroundColor,
        bg: backgroundColor,
        border: {
            bg: backgroundColor
        }
    }
}

module.exports = {
    input: input,
    helper: helper,
    label: label,
    button: button
}
