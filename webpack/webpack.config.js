const {resolve}  = require('path');

module.exports = env => ({
    entry: './src/index.js',
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    }
});
