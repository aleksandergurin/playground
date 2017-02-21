var path = require('path');

module.exports = {
    entry: {
        'index': './src/index.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry'
    },
    output: {
        path: path.join(__dirname, './build/'),
        filename: '[name].bundle.js',
        publicPath: 'build',
    },
    plugins: []
};
