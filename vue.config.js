module.exports = {
    devServer: {
        host: "0.0.0.0",
        disableHostCheck: true,
        port: '8080'
    },
    chainWebpack: config => {
        if (config.plugins.has('extract-css')) {
            const extractCSSPlugin = config.plugin('extract-css')
            extractCSSPlugin && extractCSSPlugin.tap(() => [{
                filename: 'css/app.css',
                chunkFilename: 'css/app.chunk.css'
            }])
        }
    },
    configureWebpack: {
        optimization: {
            splitChunks: false
        },
        output: {
            filename: 'js/app.js',
            chunkFilename: 'js/app.chunk.js'
        }
    }
}
