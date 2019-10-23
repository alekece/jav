const JiraApi = require('jira-client');


const jira = new JiraApi({
  protocol: 'https',
  host: 'ledgerhq.atlassian.net',
  username: '',
  password: '',
  apiVersion: '2',
  strictSSL: true
});


async function displayJira() {
    const issue = await jira.findIssue('BACK-304');
    console.log(JSON.stringify(issue, null, 4));
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
	console.log(res);
    } catch (err) {
	console.error(err);
    }
}

//displayJira();
//searchJira();
//createJira();

