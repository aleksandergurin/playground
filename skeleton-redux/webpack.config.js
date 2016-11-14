
module.exports = {
    entry: __dirname + "/src/index.js",

    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".js", ".jsx"]
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-2', 'react']
                }
            }
        ]
    }
};
