const JiraApi = require("jira-client");

const jira = new JiraApi({
    protocol: "https",
    host: "ledgerhq.atlassian.net",
    username: "julien.rouzieres@ledger.fr",
    password: "CbyQjvuyVQLWE8nuYguT11A9",
    apiVersion: "2",
    strictSSL: true
});

let projects = [];

let projectId = null;
let issueTypeId = null;

const blessed = require("blessed");
const screen = blessed.screen();

const form = blessed.form({
    parent: screen,
    keys: true,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    content: "Create JIRA",
    align: "center"
});

const projectLabel = blessed.text({
    parent: form,
    left: 2,
    top: 2,
    name: "projectLabel",
    content: "Project:"
});

const projectInput = blessed.textbox({
    parent: form,
    mouse: true,
    inputOnFocus: true,
    left: 15,
    top: 2,
    height: 1,
    name: "projectInput",
    style: {
	bg: "blue",
	focus: {
	    bg: "red"
	},
	hover: {
	    bg: "red"
	}
    }
});

const typeLabel = blessed.text({
    parent: form,
    left: 2,
    top: 4,
    name: "typeLabel",
    content: "Type:"
});

const typeInput = blessed.textbox({
    parent: form,
    mouse: true,
    inputOnFocus: true,
    left: 15,
    top: 4,
    height: 1,
    name: "typeInput",
    style: {
	bg: "blue",
	focus: {
	    bg: "red"
	},
	hover: {
	    bg: "red"
	}
    }
});

const summaryLabel = blessed.text({
    parent: form,
    left: 2,
    top: 6,
    name: "summaryLabel",
    content: "Summary:"
});

const summaryInput = blessed.textbox({
    parent: form,
    mouse: true,
    inputOnFocus: true,
    left: 15,
    top: 6,
    height: 1,
    name: "summaryInput",
    style: {
	bg: "blue",
	focus: {
	    bg: "red"
	},
	hover: {
	    bg: "red"
	}
    }
});

const descriptionLabel = blessed.text({
    parent: form,
    left: 2,
    top: 8,
    name: "descriptionLabel",
    content: "Description:"
});

const descriptionInput = blessed.textarea({
    parent: form,
    mouse: true,
    keys: true,
    left: 15,
    top: 8,
    bottom: 4,
    name: "descriptionInput",
    style: {
	bg: "blue",
	focus: {
	    bg: "red"
	},
	hover: {
	    bg: "red"
	}
    }
});

const cancel = blessed.button({
    parent: form,
    mouse: true,
    right: 20,
    bottom: 2,
    shrink: true,
    name: "cancel",
    content: "Cancel",
    style: {
	bg: "blue",
	focus: {
	    bg: "red"
	},
	hover: {
	    bg: "red"
	}
    }
});

const submit = blessed.button({
    parent: form,
    mouse: true,
    right: 10,
    bottom: 2,
    shrink: true,
    name: "submit",
    content: "Ok",
    style: {
	bg: "blue",
	focus: {
	    bg: "red"
	},
	hover: {
	    bg: "red"
	}
    }
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

typeInput.on("blur", async () => {
    if (projectInput.getValue()) {
	const projectKey = projects.filter(
	    project => project.key === projectInput.getValue()
	)[0].key;
	const project = await jira.getProject(projectKey);

	const value = typeInput.getValue();
	const filtered = project.issueTypes.filter(
	    issueTypes => !issueTypes.subtask && issueTypes.name === value
	);

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

submit.on("press", () => {
    form.submit();
});

cancel.on("press", () => {
    form.reset();
});

form.on("submit", async () => {
    if (
	projectInput.getValue() &&
	    typeInput.getValue() &&
	    summaryInput.getValue() &&
	    descriptionInput.getValue()
    ) {
	const issue = await jira.addNewIssue({
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

	form.setContent("" + issue.id)
	screen.render();
    }
});

form.on("reset", data => {
    form.setContent("Canceled.");
    screen.render();
});

screen.key("q", () => {
    process.exit(0);
});

(async () => {
    projects = await jira.listProjects();
    screen.render();
})();
