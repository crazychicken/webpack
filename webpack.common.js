/* webpack.config.js */
const path    = require('path');
const webpack = require('webpack');
const package = require('./package.json');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// We need Nodes fs module to read directory contents
const fs = require('fs')

// Our function that generates our html plugins
function generateHtmlPlugins (templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
    return templateFiles.map(item => {
      // Split names and extension
      const parts = item.split('.')
      const name = parts[0]
      const extension = parts[1]
      // Create new HTMLWebpackPlugin with options
      return new HTMLWebpackPlugin({
        filename : `${name}.html`,
        title : `${name}`,
        template : path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
      })
    })
}

function root(filePath) {
  return path.resolve(__dirname, filePath)
}

// Call our function on our css library directory.
var vendorLib = Object.keys(package.dependencies);
vendorLib.push('./src/styles/vendor.scss')

// Call our function on our views directory.
const path_dir = './src/templates/pages/';
const htmlPluginsPages = generateHtmlPlugins(path_dir)

module.exports = {
	mode   : 'production',
  	entry  : {
  		vendor : vendorLib,
  		app    : [
	        './src/scripts/app.js',
	  		'./src/styles/app.scss'
	    ]
  	},
  	output: {
	    // path: path.resolve(__dirname, './dist'), // Output folder
	    path: root('./dist'), // Output folder
	    filename: 'src/scripts/[name].bundle.js', // JS output path,
	    publicPath: '/'
  	},
  	performance: { 
		hints: false
	},
  	resolve: { 
  		extensions: ['.js', '.jsx', '.scss', '.css']
  	},
  	module: {
    	rules: [
			// {
			// 	// ES6
			// 	test: /\.js$/,
			// 	exclude: /node_modules/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 			presets: ['es2015']
			// 		}
			// 	}
			// },
      		// Include html-loader to process the html files
			{
				test: /\.(html)$/,
				include: path.join(__dirname, 'src/templates'),
				use: {
					loader: 'html-loader',
					options: {
					  interpolate: true
					}
				}
			},{
				// Sass
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
				  fallback: 'style-loader',
				  use: ['css-loader', 'sass-loader']
				})
			},
			{
				// File Images
				test: /\.(png|svg|gif|jpe?g)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [{
					loader: 'file-loader',
					options: { 
						limit: 8000, // Convert images < 8kb to base64 strings
						name: '[hash]-[name].[ext]',
						outputPath: './src/images/',
						verbose: false
					}
				}]
			},{
				// Fonts
				test: /\.(eot|tiff|woff2|woff|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[hash].[ext]',
						outputPath: './src/fonts/',
						verbose: false
					}
				}]
			}
    	]
  	},
	plugins: [
		// fix error loading jquery with bootstrap
		new webpack.ProvidePlugin({
            "$": "jquery",
            "jquery": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        }),
		// Extract our css to a separate css file vendor styles
		new ExtractTextPlugin({
			filename: 'src/styles/[name].bundle.css'
		})
	]
	// We join our htmlPlugin array to the end
	// of our webpack plugins array.
  	.concat(htmlPluginsPages)
}