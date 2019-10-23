var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    styles = require('./styles'),
    widget = require('./widget')

function createForm(screen, grid) {
    blessed.text({
        parent: form,
        mouse: true,
        left: 2,
        top: 2,
        name: 'emailLabel',
        content: 'Email:'
    });
    
    blessed.text({
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
    
    var token = blessed.textbox({
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

    form.on('submit', function() {
        form.setContent('Submitted.');
        screen.render();
    });
    
    form.on('reset', function() {
        form.setContent('Canceled.');
        screen.render();
    });

    return form
}

function login(screen) {
    var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})
    var form = grid.set(0, 0, 10, 12, blessed.form, {
        parent: screen,
        content: 'Authenticate'
    })
    var helper = grid.set(10, 0, 2, 12, widget.helper, { 
        shortcuts: [
            { key: 'C-q', desc: 'Authenticate', callback: () => form.submit() },
            { key: 'C-r', desc: 'Reset', callback: () => form.reset() }
        ],
        shortcutByColumn: 4 
    })

    helper.applyKeysTo(form)

    screen.render()
}

exports.login = login


