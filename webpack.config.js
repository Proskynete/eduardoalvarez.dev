const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, 'src/client/app');
const BUILD_DIR = path.resolve(__dirname, 'src/client/');
const IMAGES = path.resolve(__dirname, 'src/client/assets/img/');

const config = {
	entry: APP_DIR + '/index.jsx',
	output: {
  	path: BUILD_DIR,
  	filename: 'bundle.js'
	},
  devServer: {
		contentBase: BUILD_DIR,
    port: 8080,
    compress: true,
    inline: true
  },
	module : {
  	loaders : [
 			{
      	test : /\.jsx?/,
      	include : APP_DIR,
      	loader : 'babel-loader'
    	},
			{
        test: /\.(jpe?g|png|gif|mp3)$/i,
        include: IMAGES,
        loader: 'file-loader'
      }
  	]
	}
};

module.exports = config;
