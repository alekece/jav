var { helper } = require('./widget/helper')
const blessed = require('blessed')

module.exports = {
    helper: helper,
    screen: function () {
        var r = blessed.screen();
        r.key('q', () => {
            return process.exit(0)
        })
        return r
    }
}
