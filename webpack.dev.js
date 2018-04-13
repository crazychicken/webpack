const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase : './dist',
    // host        : '192.168.111.94',
    port        : 9000
  }
});