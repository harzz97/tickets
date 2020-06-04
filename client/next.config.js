const withFonts = require('next-fonts')
module.exports = withFonts({
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300
        return config
    }
})