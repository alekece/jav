var { helper } = require('./widget/helper')
const blessed = require('blessed')

module.exports = {
    helper: helper,
    screen: function (loading) {
        var r = blessed.screen();
        if (loading) {
            var loading = blessed.loading({
                parent: r,
                left: 'center',
                top: 'center'
            })
            r.append(loading)
            loading.load('loading ...')
            r.loaded = () => loading.stop()
        }
        return r
    }
}
