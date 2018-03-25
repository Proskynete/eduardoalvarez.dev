const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src/app');
const BUILD_DIR = path.resolve(__dirname, './public/');
const IMAGES = path.resolve(__dirname, 'src/assets/img/');

const config = {
	devtool: "source-map",
	entry: APP_DIR + '/index.jsx',
	output: {
  	path: BUILD_DIR,
  	filename: 'bundle.js'
	},
  devServer: {
		contentBase: './',
    port: 8080,
    compress: true,
    inline: true
  },
	module : {
  	loaders : [
			{
				test: /\.(sass|scss)$/,
				loaders: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader',
						options: { sourceMap: true, sourceMapContents: true }
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true, sourceMapContents: true }
					}
				]
			},
 			{
      	test : /\.jsx?/,
      	include : APP_DIR,
				exclude: ["bower_components", "node_modules"],
      	loader : 'babel-loader'
    	},
			{
        test: /\.(jpe?g|png|gif|mp3)$/i,
        include: IMAGES,
				exclude: ["bower_components", "node_modules"],
        loader: 'file-loader'
      }
  	]
	},
	plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};

module.exports = config;
