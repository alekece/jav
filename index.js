const JiraApi = require('jira-client');


const jira = new JiraApi({
  protocol: 'https',
  host: 'ledgerhq.atlassian.net',
  username: 'julien.rouzieres@ledger.fr',
  password: 'PyJ41iexvkLSSY6iS3xT4599',
  apiVersion: '2',
  strictSSL: true
});


async function displayJira() {
    const issue = await jira.findIssue('BACK-304');
    return issue;
}

async function searchJira() {
    const issues = await jira.searchJira('text ~ 1.4.0 AND project = MO');
    console.log(JSON.stringify(issues, null, 4));
}

async function createJira() {
    try {
	const res = await jira.addNewIssue({
	    fields: {
		project:
		{
		    id: "10010"
		},
		summary: "No REST for the Wicked.",
		description: "Creating of an issue using ids for projects and issue types using the REST API",
		issuetype: {
		    id: "10002"
		}
	    }
	});
	//console.log(res);
    } catch (err) {
	console.error(err);
    }
}

async function searchProject() {
    const projects = await jira.listProjects();
    return projects;
}

async function searchTypes() {
    const issueTypes = await jira.listIssueTypes();
    return issueTypes;
}

async function getProject() {
    const p = await jira.getProject('VD');
    return p;
}

(async () => {
    const o = await jira.getIssue('LV-1824');
    console.log(JSON.stringify(o));
})();
