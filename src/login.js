const blessed = require('blessed'),
    JiraApi = require('jira-client'),
    contrib = require('blessed-contrib'),
    styles = require('./styles'),
    widget = require('./widget'),
    fs = require('fs')

function login(screen) {
    const auth = fs.readFileSync('./auth', 'utf8')
    console.log(auth)

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
        top: 4,
        name: 'tokenLabel',
        content: 'Token:'
    });
    const urlLabel = blessed.text({
        parent: form,
        left: 2,
        top: 6,
        name: 'jiraUrlLabel',
        content: 'JIRA URL:'
    })
    const rememberMeLabel = blessed.text({
        parent: form,
        left: 2,
        top: 8,
        name: 'rememberMe',
        content: 'Remember me:'
    })
    const email = blessed.textbox({
        parent: form,
        inputOnFocus: true,
        left: 15,
        top: 2,
        height: 1,
        name: 'email',
        style: styles.input()
    });
    const token = blessed.textbox({
        parent: form,
        secret: true,
        inputOnFocus: true,
        left: 15,
        top: 4,
        height: 1,
        name: 'token',
        style: styles.input()
    });
    const jiraUrl = blessed.textbox({
        parent: form,
        inputOnFocus: true,
        left: 15,
        top: 6,
        height: 1,
        name: 'jiraUrl',
        style: styles.input()
    });
    const rememberMe = blessed.checkbox({
        parent: form,
        inputOnFocus: true,
        left: 15,
        top: 8,
        height: 1,
        name: 'rememberMe'
    })
    const login = blessed.button({
        parent: form,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        left: 10,
        top: 10,
        name: 'login',
        content: 'login',
        style: styles.button()
    });

    form.on('submit', data => {
        try {
            const jira = new JiraApi({
                protocol: 'https',
                host: data.jiraUrl,
                username: data.email,
                password: data.token,
                apiVersion: '2',
                strictSSL: true
            });
            screen.clear()
        }
        catch (error) {
            console.error(error)
        }
    })
    form.on('cancel', () => {
        process.exit(0)
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
