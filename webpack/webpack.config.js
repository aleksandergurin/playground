
module.exports = {
    entry: "./src/index.js",
    output: {
        path: "build/",
        filename: "bundle.js",
    },
    devtool: "source-map",
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ]
    }
};
