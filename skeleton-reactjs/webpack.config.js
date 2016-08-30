var CopyWebpackPlugin = require("copy-webpack-plugin");

var src_dir = __dirname + "/src";
var dst_dir = __dirname + "/build";

module.exports = {
    entry: src_dir + '/index.js',

    output: {
        path: dst_dir,
        filename: "bundle.js"
    },

    devtool: 'source-map',

    plugins: [
        new CopyWebpackPlugin([
            {
                context: src_dir,
                from: "**/*.html",
                to: dst_dir
            }
        ])
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};