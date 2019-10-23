const blessed = require("blessed");
const contrib = require('blessed-contrib');
const tickets = require('./tickets.js')
const { create } = require('./create.js')

const styles = require("./styles");
const widget = require('./widget');

exports.edit = function (screen, jira, ticketId) {
    let projects = [];
    let issue = null;
    let projectId = null;
    let issueTypeId = null;

    const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

    const form = grid.set(0, 0, 10, 10, blessed.form, {
        parent: screen,
        keys: true,
        left: 0,
        top: 0,
        label: `Edit JIRA: ${ticketId}`
    });

    const list = grid.set(0, 10, 10, 2, blessed.list, {
        parent: screen,
        left: 0,
        top: 0,
        border: {
            type: 'line'
        }
    });

    const projectLabel = blessed.text({
        parent: form,
        left: 2,
        top: 2,
        name: "projectLabel",
        content: "Project:"
    });

    const projectInput = blessed.textbox(styles.input({
        parent: form,
        mouse: true,
        inputOnFocus: true,
        left: 2,
        top: 3,
        height: 1,
        name: "projectInput"
    }));

    const typeLabel = blessed.text({
        parent: form,
        left: 2,
        top: 5,
        name: "typeLabel",
        content: "Type:"
    });

    const typeInput = blessed.textbox(styles.input({
        parent: form,
        mouse: true,
        inputOnFocus: true,
        left: 2,
        top: 6,
        height: 1,
        name: "typeInput"
    }));

    const summaryLabel = blessed.text({
        parent: form,
        left: 2,
        top: 8,
        name: "summaryLabel",
        content: "Summary:"
    });

    const summaryInput = blessed.textbox(styles.input({
        parent: form,
        mouse: true,
        inputOnFocus: true,
        left: 2,
        top: 9,
        height: 1,
        name: "summaryInput"
    }));

    const descriptionLabel = blessed.text({
        parent: form,
        left: 2,
        top: 11,
        name: "descriptionLabel",
        content: "Description:"
    });

    const descriptionInput = blessed.textarea(styles.input({
        parent: form,
        mouse: true,
        keys: true,
        left: 2,
        top: 12,
        name: "descriptionInput"
    }));

    projectInput.on("focus", () => {
        list.setItems(projects.map(project => project.key));
        screen.render();
    });

    projectInput.on("blur", () => {
        const value = projectInput.getValue();
        const filtered = projects.filter(project => project.key === value);

        if (filtered.length === 0) {
            projectInput.clearValue();
        } else {
            projectId = filtered[0].id;
        }

        screen.render();
    });

    typeInput.on("focus", async () => {
        if (projectInput.getValue()) {
            const projectKey = projects.filter(project => project.key === projectInput.getValue())[0].key;
            const project = await jira.getProject(projectKey);

            const value = typeInput.getValue();
            list.setItems(project.issueTypes.filter(issueType => !issueType.subtask).map(issueType => issueType.name));
        } else {
            list.setItems([]);
        }

        screen.render();
    });

    typeInput.on("blur", async () => {
        if (projectInput.getValue()) {
            const projectKey = projects.filter(project => project.key === projectInput.getValue())[0].key;
            const project = await jira.getProject(projectKey);

            const value = typeInput.getValue();
            const filtered = project.issueTypes.filter(issueType => !issueType.subtask && issueType.name === value);

            if (filtered.length === 0) {
                typeInput.clearValue();
            } else {
                issueTypeId = filtered[0].id;
            }
        } else {
            typeInput.clearValue();
        }

        screen.render();
    });

    summaryInput.on("focus", () => {
        list.setItems([]);
        screen.render();
    })

    descriptionInput.on("focus", () => {
        list.setItems([]);
        screen.render();
    });

    form.on("submit", async () => {
        if (projectInput.getValue() && typeInput.getValue() && summaryInput.getValue() && descriptionInput.getValue()) {
            const issue = await jira.updateIssue(ticketId, {
                fields: {
                    project: {
                        id: projectId
                    },
                    summary: summaryInput.getValue(),
                    description: descriptionInput.getValue(),
                    issuetype: {
                        id: issueTypeId
                    }
                }
            });

            screen.render();
        }
    });

    form.on("reset", data => {
        screen.render();
    });

    screen.key("q", () => {
        process.exit(0);
    });

    const helper = grid.set(10, 0, 2, 12, widget.helper, {
        shortcuts: [
            { key: 'C-e', desc: 'Edit input with editor', callback: () => form.submit() },
            {
                key: 'C-h', desc: 'Go to list view', callback: () => {
                    screen.realloc()
                    tickets.renderTableView(screen, jira)
                }
            },
            {
                key: 'C-c', desc: 'Create JIRA', callback: () => {
                    screen.realloc()
                    create(screen, jira)
                }
            }
        ],
        shortcutByColumn: 4
    })

    helper.applyKeysTo(form);

    (async () => {
        projects = await jira.listProjects();
        issue = await jira.getIssue(ticketId);
        projectInput.setValue(issue.fields.project.key);
        projectId = issue.fields.project.id;
        typeInput.setValue(issue.fields.issuetype.name);
        issueTypeId = issue.fields.issuetype.id;
        summaryInput.setValue(issue.fields.summary);
        descriptionInput.setValue(issue.fields.description);
        screen.render();
        form.focus();
    })();    
};

