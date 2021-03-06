const webpack = require('webpack');

module.exports = {
    entry: './app/index.js',

    output: {
        path: 'build/',
        publicPath: 'build/',
        filename: 'bundle.js',
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.ProvidePlugin({riot: 'riot'}),
    ],

    module: {
        preLoaders: [
            {
                test: /\.tag$/,
                exclude: /node_modules/,
                loader: 'riotjs-loader',
            }
        ],
        loaders: [
            {
                test: /\.js|\.tag$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ]
    },
};
