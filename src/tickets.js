const blessed = require('blessed')
const contrib = require('blessed-contrib')
const colors = require('colors/safe')
const styles = require('./styles')
// Export rendering function only
module.exports.renderTableView = renderTableView

// Here are common variable (They can actually be passed through function, keep them here for readability)
const header = [colors.cyan('Issue (i)'), colors.red('Type (t)'), 'Creator (c)', 'Creation Date (d)', 'Project (p)', colors.magenta('Status (s)'), 'Component (o)']
const keyBindings = [['i', 'key', false], ['t', 'type', false], ['c', 'creator', false], 
['d', 'created', false], ['p', 'project', false], ['s', 'status', false], ['o', 'component', false]]

const context = {
    rows : [],
    table : {},
    jql : ""
}
/**
 * Entry point 
 */
function renderTable(screen, context) {
    context.table.setData(
        {
            headers: header,
            data: context.rows.map(o => Object.values(o))
        })
    screen.render()
}

async function fetchJiraTickets(jira) {
    const issues = await jira.searchJira('assignee in (currentUser())');
    return issues;
}

async function createTable(dataz) {
    var screen = blessed.screen()
    screen.key(['escape', 'q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });
    
    context.rows = formatData(dataz)
    var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })
    context.table = grid.set(0, 0, 10, 12, contrib.table, styles.table({
        keys: true
        , interactive: true
        , label: 'Issues Navigator'
        , width: '80%'
        , height: '80%'
        , border: { type: "line", fg: "cyan" }
        , columnSpacing: 10 //in chars
        , columnWidth: [10, 8, 20, 40, 20, 15, 20]
    }))

    bindColumnSortingKeys(screen, context)

    // allow control the table with the keyboard
    context.table.focus()
    renderTable(screen, context)
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
            component: issues[ticket]["fields"]["components"][0] ? issues[ticket]["fields"]["components"][0]["name"] : "None"
        }
        rows.push(row)
    }
    return rows
}

function bindTopBox(screen){

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
                         data: context.rows.map(o => Object.values(o))
                     })
                 screen.render()
            });
        })
}

function refreshTable(context){}
async function renderTableView(jira) {
    fetchJiraTickets(jira).then(data => createTable(data)).catch(console.log);
}

function formatDate(stringDate) {
    return new Date(stringDate).toLocaleDateString("en-US",
        { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}
