var blessed = require('blessed'),
    JiraApi = require('jira-client'),
    contrib = require('blessed-contrib'),
    styles = require('./styles'),
    widget = require('./widget'),
    tickets = require('./tickets.js')
    fs = require('fs')


function login(screen) {
    var auth = []
    try{
        auth = fs.readFileSync('./.login', 'utf8').split('\n')
    }
    catch(error) {
    }

    var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })
    var form = grid.set(0, 0, 10, 12, blessed.form, styles.form({
        keys: true,
        vi: false,
        parent: screen,
        label: ' Authenticate '
    }))
    const image = contrib.picture({
        parent: form,
        left: screen.width / 4,
        top: 2,
        file: './assets/ledger.png',
        cols: screen.width / 2,
        onReady: () => screen.render()
    })
    var headlineLabel = blessed.text(styles.label({
        parent: form,
        top: 20,
        left: 'center',
        content: 'Welcome to Jira Avocado, a terminal user interface to make JIRA great again'
    }))
    var pushlineLabel = blessed.text(styles.label({
        parent: form,
        top: 21,
        left: 'center',
        content: '... and also for those who both hate JIRA a lot and like avocados'
    }))
    var emailLabel = blessed.text(styles.label({
        parent: form,
        left: 2,
        top: 25,
        name: 'emailLabel',
        content: 'Email:'
    }));
    var tokenLabel = blessed.text(styles.label({
        parent: form,
        left: 2,
        top: 28,
        name: 'tokenLabel',
        content: 'Token:'
    }));
    var urlLabel = blessed.text(styles.label({
        parent: form,
        left: 2,
        top: 31,
        name: 'jiraUrlLabel',
        content: 'JIRA URL:'
    }))
    var rememberMeLabel = blessed.text(styles.label({
        parent: form,
        left: 2,
        top: 34,
        name: 'rememberMe',
        content: 'Remember me:'
    }))
    var email = blessed.textbox(styles.input({
        parent: form,
        inputOnFocus: true,
        left: 2,
        top: 26,
        height: 1,
        width: '97%',
        name: 'email',
        value: auth[0]
    }));
    var token = blessed.textbox(styles.input({
        parent: form,
        censor: true,
        inputOnFocus: true,
        left: 2,
        top: 29,
        height: 1,
        width: '97%',
        name: 'token',
        value: auth[1],
    }));
    var jiraUrl = blessed.textbox(styles.input({
        parent: form,
        inputOnFocus: true,
        left: 2,
        top: 32,
        width: '97%',
        height: 1,
        name: 'jiraUrl',
        value: auth[2],
    }));
    var rememberMe = blessed.checkbox(styles.label({
        parent: form,
        inputOnFocus: true,
        left: 2,
        top: 35,
        height: 1,
        name: 'rememberMe'
    }))

    var helper = grid.set(10, 0, 2, 12, widget.helper, {
        shortcuts: [
            { key: 'C-l', desc: 'Login', callback: () => form.submit() }
        ],
        shortcutByColumn: 4,
        parent: screen
    })

    helper.applyKeysTo(form)

    form.on('submit', data => {
        var jira = new JiraApi({
            protocol: 'https',
            host: data.jiraUrl,
            username: data.email,
            password: data.token,
            apiVersion: '2',
            strictSSL: true
        });
        if(data.rememberMe){
            fs.writeFileSync('./.login', data.email + '\n' + data.token + '\n' + data.jiraUrl)
        }
        screen.remove(helper)
        screen.remove(form)
        tickets.renderTableView(screen, jira)
    })

    screen.render()
}

exports.login = login
