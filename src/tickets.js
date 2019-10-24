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

async function fetchJiraTickets(jira, jql) {
    const issues = await jira.searchJira(jql);
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
    var countPerType = {}
    var total = 0;

    context.rows.forEach(function (row) {
        countPerType[row.type] = countPerType[row.type] ? countPerType[row.type] + 1 : 1
        total ++
    })
    
    var percent =[]
    Object.values(countPerType).forEach(function mapApply(value, key, map) {
        var perc = value * 100 / total;
        var stackElem = {
            percent : perc ,
            stroke :  256 / 100 * perc
        }
        percent.push(stackElem)
    })

    context.table.setData(
        {
            headers: header,
            data: context.rows.filter((e) => context.filter(e)).map(row => {
                return Object.values(row).map(function (part, index) {
                    return part.substring(0, context.columnWidth[index]);
                });
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
        jql: "assignee in (currentUser())",
        columnWidth: [10, 8, 17, 30, 15, 20, 20, 50]
    }

    // Create empty component
    var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

    context.gauge = grid.set(0, 0, 2, 12, contrib.gauge, styles.gauge({
        parent: screen,
        label: ' KPIs ',
    }))

    var navBox = grid.set(2, 0, 8, 12, blessed.box, styles.box({
        parent: screen,
        label: ' Issues navigation '
    }))

    context.table = contrib.table(styles.table({
        keys: true
        , parent: navBox
        , interactive: true
        , left: 1
        , top: 1
        , columnSpacing: 5 //in chars
        , columnWidth: context.columnWidth
    }))
    
    // Fetch Data
    fetchJiraTickets(jira, context.jql).then(function (dataz) {
        context.rows = formatData(dataz)
        refreshData(screen, context)
    })
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
                        return Object.values(row).map(function (part, index) {
                            return part.substring(0, context.columnWidth[index]);
                        });
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
            'callback': orderer(bind[1], -1)
        }
        shortcts.push(short)
    })
    shortcts.push({
        key: '/',
        desc: '',
        callback: () => {
            var prompt = blessed.prompt(styles.prompt({
                parent: screen,
                left: 'center',
                top: 'center',
                height: 10
            }))
            prompt.readInput('Search', '', (err, value) => {
                if (value) {
                    context.filter = (s) => JSON.stringify(s).includes(value)
                    refreshData(screen, context)
                }
            })
        }
    })
    shortcts.push({
        key: 'C-f',
        desc: 'Custom JQL',
        callback: () => {
            var prompt = blessed.prompt(styles.prompt({
                parent: screen,
                left: 'center',
                top: 'center',
                height: 10
            }))
            prompt.readInput('Custom JQL ', context.jql, (err, value) => {
                if (value) {
                    context.jql = value.trim()
                    fetchJiraTickets(jira, context.jql).then(function (dataz) {
                        context.rows = formatData(dataz)
                        refreshData(screen, context)
                    }).catch(error => {
                        context.jql = "assignee in (NONE)"
                        fetchJiraTickets(jira, context.jql).then(function (dataz) {
                            context.rows = formatData(dataz)
                            refreshData(screen, context)
                        })
                    })
                }
            })
        }
    })
    shortcts.push({
        key: 'C-u',
        desc: 'Assigned to me',
        callback: () => {
            context.jql = "assignee in (currentUser())"
            fetchJiraTickets(jira, context.jql).then(function (dataz) {
                context.rows = formatData(dataz)
                refreshData(screen, context)
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

    shortcts.push({
        key: 'C-e', desc: 'Edit JIRA', callback: () => {
            var prompt = blessed.prompt({
                parent: screen,
                left: 'center',
                top: 'center'
            })
            prompt.readInput('Ticket Key', '', (err, value) => {
                if (value) {
                    screen.destroy()
                    screen = null
                    edit(jira, value)
                } else {
                    screen.render()
                }
            })
        }
    })

    var help = grid.set(10, 0, 2, 12, widget.helper, styles.helper(
        {
            parent: screen,
            shortcutByColumn: 4,
            shortcuts: shortcts
        }))
    help.applyKeysTo(screen)
    screen.render()
}
// Export rendering function only
module.exports.renderTableView = renderTableView
