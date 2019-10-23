const blessed = require('blessed');
const screen = blessed.screen();

const form = blessed.form({
  parent: screen,
  keys: true,
  left: 0,
  top: 0,
  width: 30,
  height: 4,
  bg: 'green',
  content: 'Submit or cancel?'
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
