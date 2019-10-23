var blessed = require('blessed')
    , screen = blessed.screen()
    , { login } = require('./login')

login(screen)

screen.key(['escape', 'q', 'C-c'], function() {
    return process.exit(0);
});
