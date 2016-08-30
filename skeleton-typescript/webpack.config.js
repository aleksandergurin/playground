var CopyWebpackPlugin = require("copy-webpack-plugin");

var src_dir = __dirname + "/src";
var dst_dir = __dirname + "/build";

module.exports = {
    entry: src_dir + "/index.tsx",

    output: {
        path: dst_dir,
        filename: "bundle.js"
    },

    devtool: "source-map",

    resolve: {
        extensions: ["", ".ts", ".tsx", ".js", ".jsx"]
    },

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
            {test: /\.tsx?$/, loader: "ts"}
        ]
    }
};
