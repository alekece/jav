const blessed = require('blessed')
const contrib = require('blessed-contrib')
const colors = require('colors/safe')


module.exports.renderTable = renderTable

async function fetchJiraTickets(jira) {
    const issues = await jira.searchJira('assignee in (currentUser())');
    //console.log('Log fetchJira : '+JSON.stringify(issues, null, 4));
    return issues;
}

async function createTable(dataz) {
    var screen = blessed.screen()
    var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })
    var table = grid.set(0, 0, 10, 12, contrib.table, {
        keys: true
        , fg: 'white'
        , selectedFg: 'white'
        , selectedBg: 'blue'
        , interactive: true
        , label: 'Issues Navigator'
        , width: '80%'
        , height: '80%'
        , border: { type: "line", fg: "cyan" }
        , columnSpacing: 10 //in chars
        , columnWidth: [10, 8, 20, 40, 20, 15, 20]
    })

    screen.key(['escape', 'q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });
    /* var table = contrib.table(
         { keys: true
         , fg: 'white'
         , selectedFg: 'white'
         , selectedBg: 'blue'
         , interactive: true
         , label: 'Issues Navigator'
         , width: '80%'
         , height: '80%'
         , border: {type: "line", fg: "cyan"}
         , columnSpacing: 10 //in chars
         , columnWidth: [16, 12, 12,16, 12, 12, 12] })
    */

    // allow control the table with the keyboard
    table.focus()

    var issues = dataz.issues

    // TODO move this properly to a date stringify method
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    var rows = []
    for (ticket in issues) {
        var row = {
            key: issues[ticket]["key"],
            type: issues[ticket]["fields"]["issuetype"]["name"],
            creator: issues[ticket]["fields"]["creator"]["name"],
            created: new Date(issues[ticket]["fields"]["created"]).toLocaleDateString("en-US", options),
            project_name: issues[ticket]["fields"]["project"]["name"],
            status: issues[ticket]["fields"]["status"]["name"],
            component_name: issues[ticket]["fields"]["components"][0] ? issues[ticket]["fields"]["components"][0]["name"] : "None"
        }
        rows.push(row)
        console.log("Here is the row : " + JSON.stringify(row, null, 4))
    }
    var header = [colors.cyan('Issue'), colors.red('Type'), 'Creator', 'Creation Date', 'Project', colors.magenta('Status'), 'Component']

    table.setData(
        {
            headers: header,
            data: rows.map(o => Object.values(o))
        })

    screen.render()
}

async function renderTable(jira) {
    fetchJiraTickets(jira).then(data => createTable(data)).catch(console.log);
}


