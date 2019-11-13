const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'dedupe-elasticsearch.js',
    library: 'DedupeES',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  target: 'node'
};