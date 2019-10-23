const blessed = require('blessed'),
    JiraApi = require('jira-client'),
    contrib = require('blessed-contrib'),
    styles = require('./styles'),
    widget = require('./widget'),
    fs = require('fs')

function login(screen) {
    const auth = fs.readFileSync('./auth', 'utf8').split('\n')

    const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })
    const form = grid.set(0, 0, 12, 12, blessed.form, {
        keys: true,
        vi: false,
        parent: screen,
        content: 'Authenticate'
    })
    const emailLabel = blessed.text({
        parent: form,
        left: 2,
        top: 2,
        name: 'emailLabel',
        content: 'Email:'
    });
    const tokenLabel = blessed.text({
        parent: form,
        left: 2,
        top: 5,
        name: 'tokenLabel',
        content: 'Token:'
    });
    const urlLabel = blessed.text({
        parent: form,
        left: 2,
        top: 8,
        name: 'jiraUrlLabel',
        content: 'JIRA URL:'
    })
    const rememberMeLabel = blessed.text({
        parent: form,
        left: 2,
        top: 11,
        name: 'rememberMe',
        content: 'Remember me:'
    })
    const email = blessed.textbox(styles.input({
        parent: form,
        inputOnFocus: true,
        left: 2,
        top: 3,
        height: 1,
        name: 'email',
        value: auth[0]
    }));
    const token = blessed.textbox(styles.input({
        parent: form,
        secret: true,
        inputOnFocus: true,
        left: 2,
        top: 6,
        height: 1,
        name: 'token',
        value: auth[1],
    }));
    const jiraUrl = blessed.textbox(styles.input({
        parent: form,
        inputOnFocus: true,
        left: 2,
        top: 9,
        height: 1,
        name: 'jiraUrl',
        value: auth[2],
    }));
    const rememberMe = blessed.checkbox({
        parent: form,
        inputOnFocus: true,
        left: 2,
        top: 12,
        height: 1,
        name: 'rememberMe'
    })

    form.on('submit', data => {
        const jira = new JiraApi({
            protocol: 'https',
            host: data.jiraUrl,
            username: data.email,
            password: data.token,
            apiVersion: '2',
            strictSSL: true
        });
        fs.writeFileSync('./auth', data.email + '\n' + data.token + '\n' + data.token)
    })

    var helper = grid.set(10, 0, 2, 12, widget.helper, {
        shortcuts: [
            { key: 'C-l', desc: 'Login', callback: () => form.submit() }
        ],
        shortcutByColumn: 4
    })

    helper.applyKeysTo(form)

    screen.render()
}

exports.login = login
