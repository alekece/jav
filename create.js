var blessed = require('blessed')
, screen = blessed.screen();

var form = blessed.form({
    parent: screen,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    content: 'Create JIRA'
});

var projectLabel = blessed.text({
    parent: form,
    mouse: true,
    left: 2,
    top: 2,
    name: 'projectLabel',
    content: 'Project:'
});

var projectInput = blessed.textbox({
    parent: form,
    mouse: true,
    keys: true,
    vi: false,
    inputOnFocus: true,
    left: 15,
    top: 2,
    height: 1,
    name: 'projectInput',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});

var typeLabel = blessed.text({
    parent: form,
    mouse: true,
    left: 2,
    top: 4,
    name: 'typeLabel',
    content: 'Type:'
});

var typeInput = blessed.textbox({
    parent: form,
    mouse: true,
    keys: true,
    vi: false,
    inputOnFocus: true,
    left: 15,
    top: 4,
    height: 1,
    name: 'typeInput',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});

var summaryLabel = blessed.text({
    parent: form,
    mouse: true,
    left: 2,
    top: 6,
    name: 'summaryLabel',
    content: 'Summary:'
});

var summaryInput = blessed.textbox({
    parent: form,
    mouse: true,
    keys: true,
    vi: false,
    inputOnFocus: true,
    left: 15,
    top: 6,
    height: 1,
    name: 'summaryInput',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});

var descriptionLabel = blessed.text({
    parent: form,
    mouse: true,
    left: 2,
    top: 8,
    name: 'descriptionLabel',
    content: 'Description:'
});

var descriptionInput = blessed.textarea({
    parent: form,
    mouse: true,
    keys: true,
    vi: false,
    inputOnFocus: true,
    left: 15,
    top: 8,
    height: 10,
    name: 'descriptionInput',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});


var submit = blessed.button({
    parent: form,
    mouse: true,
    keys: true,
    right: 10,
    bottom: 2,
    shrink: true,
    name: 'submit',
    content: 'Ok',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});

var cancel = blessed.button({
    parent: form,
    mouse: true,
    keys: true,
    right: 20,
    bottom: 2,
    shrink: true,
    name: 'cancel',
    content: 'Cancel',
    style: {
	bg: 'blue',
	focus: {
	    bg: 'red'
	},
	hover: {
	    bg: 'red'
	}
    }
});

submit.on('press', function() {
    form.submit();
});

cancel.on('press', function() {
    form.reset();
});

form.on('submit', function(data) {
    form.setContent('Submitted.');
    screen.render();
});

form.on('reset', function(data) {
    form.setContent('Canceled.');
    screen.render();
});

screen.key('q', function() {
    process.exit(0);
});

screen.render();
