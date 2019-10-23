const blessed = require('blessed')
const contrib = require('blessed-contrib')
const colors = require('colors/safe')
const styles = require('./styles')
const widget = require('./widget')
const {edit} = require('./edit.js')

// Here are common variable (They can actually be passed through function, keep them here for readability)

const header = ['Issue (i)', colors.red('Type (t)'), 'Creator (c)', 'Creation Date (d)', 'Project (p)', colors.magenta('Status (s)'), 'Component (o)', 'Summary (s)']
const keyBindings = [['i', 'key'], ['t', 'type'], ['c', 'creator'],
['d', 'created'], ['p', 'project'], ['s', 'status'], ['o', 'component'], ['s', 'summary']]

async function fetchJiraTickets(jira) {
    const issues = await jira.searchJira('assignee in (currentUser())');
    return issues;
}

function formatData(dataz) {
    var rows = []
    var issues = dataz.issues
    for (ticket in issues) {
        var row = {
            key: issues[ticket]["key"],
            type: issues[ticket]["fields"]["issuetype"]["name"],
            creator: issues[ticket]["fields"]["creator"]["name"],
            created: formatDate(issues[ticket]["fields"]["created"]),
            project: issues[ticket]["fields"]["project"]["name"],
            status: issues[ticket]["fields"]["status"]["name"],
            component: issues[ticket]["fields"]["components"][0] ? issues[ticket]["fields"]["components"][0]["name"] : "None",
            summary: issues[ticket]["fields"]["summary"]

        }
        rows.push(row)
    }
    return rows
}

function bindTopBox(screen) {

}

function bindColumnSortingKeys(screen, context) {
    keyBindings.forEach(
        function (keyB) {
            screen.key(keyB[0], function (ch, key) {
                var attribute = keyB[1]
                keyB[2] = !keyB[2]
                context.rows.sort(function (r1, r2) {
                    return r1[attribute].localeCompare(r2[attribute]) * (keyB[2] ? 1 : -1)
                })
                context.table.setData(
                    {
                        headers: header,
                        data: context.rows.map(row => {
                            return Object.values(row)
                        })
                    })
                screen.render()
            });
        })
}


function formatDate(stringDate) {
    return new Date(stringDate).toLocaleDateString("en-US",
        { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}


function renderTableView(screen, jira) {
    const context = {
        rows: [],
        topBox: false,
        table: {},
        filter: (s) => true,
        jql: "",
        columnWidth: [10, 8, 17, 40, 20, 15, 20, 30]
    }

    // Fetch Data
    fetchJiraTickets(jira).then(function (dataz) {
        context.rows = formatData(dataz)
        context.table.setData(
            {
                headers: header,
                data: context.rows.filter((v) => context.filter(v)).map(o => Object.values(o))

            })
        screen.render()
    })

    // Create empty component
    var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

    context.table = grid.set(0, 0, 10, 12, contrib.table, styles.table({
        keys: true
        , parent: screen
        , interactive: true
        , label: 'Issues Navigator'
        , width: '80%'
        , height: '80%'
        , border: { type: "line", fg: "cyan" }
        , columnSpacing: 5 //in chars
        , columnWidth: context.columnWidth
    }))

    // bindColumnSortingKeys(screen, context)
    context.table.focus()
    // allow control the table with the keyboard
    context.table.setData(
        {
            headers: header,
            data: []
        })
    function orderer(attr, order) {
        return function () {
            order *= -1
            context.rows.sort(function (r1, r2) {
                return r1[attr].localeCompare(r2[attr]) * order
            })
            context.table.setData(
                {
                    headers: header,
                    data: context.rows.map(row => {
                        /*if (row) {
                             var arr = Object.values(row)
                             arr.forEach(
                                 function (value, index) {
                                     console.log("Value is type of : " + typeof value)
                                 }
                             )
                         } */
                        return Object.values(row)
                    })
                })

            screen.render()
        }
    }
    shortcts = []
    keyBindings.forEach(function (bind) {
        var short = {
            'key': bind[0],
            'desc': "Sort by " + bind[1],
            'callback': orderer(bind[1], 1)
        }
        shortcts.push(short)
    })

    var help = grid.set(10, 0, 2, 12, widget.helper, styles.helper(
        {
            parent: screen,
            shortcutByColumn: 4,
            shortcuts: shortcts
        }))
    screen.key('/', function (ch, key) {
        var prompt = blessed.prompt({
            parent: screen,
            left: 'center',
            top: 'center'
        })
        prompt.readInput('Search', '', (err, value) => {
            if (value) {
                context.filter = (s) => JSON.stringify(s).includes(value)
                renderTableView(screen, jira)
            }
        })
    })
    screen.key('escape', function (ch, key) {
        context.filter = (s) => true
        renderTableView(screen, jira)
    })
    screen.key('enter', function (ch, key) {
        screen.remove(context.table)
        screen.remove(help)
        edit(screen, jira, context.rows[context.table.rows.selected].key)
    })
    help.applyKeysTo(screen)
    screen.render()
}
// Export rendering function only
module.exports.renderTableView = renderTableView