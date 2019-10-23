var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    styles = require('./styles')

function login(screen) {
    var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})
    var form = grid.set(0, 0, 12, 12, blessed.form, {
        parent: screen,
        content: 'Authenticate'
    })    
    var emailLabel = blessed.text({
        parent: form,
        mouse: true,
        left: 2,
        top: 2,
        name: 'emailLabel',
        content: 'Email:'
    });
    var tokenLabel = blessed.text({
        parent: form,
        mouse: true,
        left: 2,
        top: 4,
        name: 'tokenLabel',
        content: 'Token:'
    });
    var email = blessed.textbox({
        parent: form,
        mouse: true,
        keys: true,
        vi: false,
        inputOnFocus: true,
        left: 15,
        top: 2,
        height: 1,
        name: 'email',
        style: styles.input()
    });
    var token =  blessed.textbox({
        parent: form,
        mouse: true,
        keys: true,
        vi: false,
        inputOnFocus: true,
        left: 15,
        top: 4,
        height: 1,
        name: 'token',
        style: styles.input()
    });

    screen.render()
}

exports.login = login


