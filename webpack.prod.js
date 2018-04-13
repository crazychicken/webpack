const merge  = require('webpack-merge');
const common = require('./webpack.common.js');

const UglifyJSPlugin     = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    // new UglifyJSPlugin({
    //   sourceMap: true
    // }),
    new CleanWebpackPlugin([
      'dist'
    ])
  ]
});