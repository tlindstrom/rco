module.exports = {
    mode: 'development',
    entry: './source/bundle/main.js',
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
}