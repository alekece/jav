var blessed = require('blessed')
    , { login } = require('./login')

function main() {
    var screen = blessed.screen()
    screen.key(['q'], function () {
        return process.exit(0);
    });
    login(screen)
}

main()
