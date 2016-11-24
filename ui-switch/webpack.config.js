module.exports = {
    entry: "./src/index.js",

    output: {
        path: "build/",
        filename: "bundle.js",
        publicPath: "build/"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".js", ".jsx"]
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: '/node_modules',
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-2', 'react']
                },
            },
            {
                test: /\.styl$/,
                exclude: '/node_modules',
                loader: 'style!css!stylus',
            }
        ]
    }
};
