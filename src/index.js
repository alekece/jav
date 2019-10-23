var blessed = require('blessed')
    , screen = blessed.screen()
    , { login } = require('./login')

screen.clear = function() {
    screen.children.forEach(element => screen.remove(element))
}

login(screen)

screen.key(['escape', 'q', 'C-c'], function() {
    return process.exit(0);
});
