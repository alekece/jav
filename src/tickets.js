const blessed = require('blessed')
const contrib = require('blessed-contrib')
const colors = require('colors/safe')
const styles = require('./styles')
const widget = require('./widget')
const { edit } = require('./edit.js')
const { create } = require('./create.js')

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

function formatDate(stringDate) {
    return new Date(stringDate).toLocaleDateString("en-US",
        { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

function refreshData(screen, context) {
    context.table.setData(
        {
            headers: header,
            data: context.rows.map(row => {
                //return Object.values(row)
                return Object.values(row).map(function (part, index) {
                    return part.substring(0, context.columnWidth[index]);
                });
                return tab
            })
        })
    if (screen) {
        screen.render()
    }
}

function renderTableView(jira) {
    var screen = widget.screen()
    const context = {
        rows: [],
        topBox: false,
        table: {},
        filter: (s) => true,
        jql: "",
        columnWidth: [10, 8, 17, 30, 15, 20, 20, 50]
    }

    // Fetch Data
    fetchJiraTickets(jira).then(function (dataz) {
        context.rows = formatData(dataz)
        refreshData(screen, context)
    })

    // Create empty component
    var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

    var box = grid.set(0, 0, 10, 12, blessed.box, styles.box({
        parent: screen,
        label: ' Issues navigation '
    })) 

    context.table = contrib.table(styles.table({
        keys: true
        , parent: box
        , interactive: true
        , left: 1
        , top: 1
        , columnSpacing: 5 //in chars
        , columnWidth: context.columnWidth
    }))

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
                        //return Object.values(row)
                        return Object.values(row).map(function (part, index) {
                            //                            if(part) {
                            return part.substring(0, context.columnWidth[index]);
                            //                          }
                        });
                        return tab
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
    shortcts.push({
        key: '/',
        desc: 'Search table',
        callback: () => {
            var prompt = blessed.prompt({
                parent: screen,
                left: 'center',
                top: 'center'
            })
            prompt.readInput('Search', '', (err, value) => {
                if (value) {
                    context.filter = (s) => JSON.stringify(s).includes(value)
                    refreshData(screen, context)
                }
            })
        }
    })
    shortcts.push({
        key: 'C-d',
        desc: 'Clear search',
        callback: () => {
            context.filter = (s) => true
            refreshData(screen, context)
        }
    })
    shortcts.push({
        key: 'enter',
        desc: 'Edit selected ticket',
        callback: () => {
            if (context.rows.length > 0) {
                screen.destroy()
                screen = null
                edit(jira, context.rows[context.table.rows.selected].key)
            }
        }
    })

    shortcts.push({
        key: 'C-c', desc: 'Create JIRA', callback: () => {
            screen.destroy()
            screen = null
            create(jira)
        }
    })

    var help = grid.set(10, 0, 2, 12, widget.helper, styles.helper(
        {
            parent: box,
            shortcutByColumn: 4,
            shortcuts: shortcts
        }))
    help.applyKeysTo(screen)
    screen.render()
}
// Export rendering function only
module.exports.renderTableView = renderTableView