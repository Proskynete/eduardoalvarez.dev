const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'src/client');
const APP_DIR = path.resolve(__dirname, 'src/client/app');
const PUBLIC_PATH = path.resolve(__dirname, '/src/client');

const config = {
	entry: APP_DIR + '/index.jsx',
	output: {
  	path: BUILD_DIR,
  	filename: 'bundle.js',
    publicPath: PUBLIC_PATH
	},
  devServer: {
    host: '0.0.0.0',
    port: 8093,
    compress: true,
    inline: true
  },
	module : {
  	loaders : [
 			{
      	test : /\.jsx?/,
      	include : APP_DIR,
      	loader : 'babel-loader'
    	}
  	]
	}
};

module.exports = config;
