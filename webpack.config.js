const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
	return {
		entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'main.js')],
		output: {
			path: path.resolve(__dirname, 'build'),
			publicPath: '/',
			filename: 'bundle.js',
		},
		devServer: {
			contentBase: './',
			port: 8080,
			compress: true,
			hot: true,
			inline: true,
			historyApiFallback: true,
		},
		resolve: {
			extensions: ['.jsx', '.js'],
			alias: {
				'@Actions': path.resolve(__dirname, 'src', 'actions'),
				'@Assets': path.resolve(__dirname, 'assets'),
				'@Helpers': path.resolve(__dirname, 'src', 'helpers'),
				'@Components': path.resolve(__dirname, 'src', 'components'),
				'@Contents': path.resolve(
					__dirname,
					'src',
					'config',
					'content',
					'components',
				),
				'@Config': path.resolve(__dirname, 'src', 'config'),
				'@Sass': path.resolve(__dirname, 'src', 'assets', 'scss'),
				'@Images': path.resolve(__dirname, 'src', 'assets', 'images'),
				'@Reducers': path.resolve(__dirname, 'src', 'reducers'),
				'@Views': path.resolve(__dirname, 'src', 'views'),
			},
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: [{ loader: 'babel-loader' }],
				},
				{
					test: /\.(sass|scss)$/,
					exclude: /(node_modules|bower_components)/,
					loaders: [
						{ loader: 'style-loader' },
						{ loader: 'css-loader', options: { sourceMap: true } },
						{
							loader: 'sass-loader',
							options: { sourceMap: true },
						},
					],
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					use: [
						{
							loader: 'file-loader',
						},
					],
				},
				{
					test: /\.html$/,
					use: [
						{
							loader: 'html-loader',
						},
					],
				},
			],
		},
		externals: ['window'],
		plugins: [
			new webpack.ProgressPlugin(),
			new HtmlWebpackPlugin({
				template: './src/index.html',
				hash: true,
			}),
			new MiniCssExtractPlugin({
				filename: 'styles.css',
			}),
			new webpack.DefinePlugin({
				ENVIRONMENT: JSON.stringify(env.NODE_ENV),
			}),
		],
	};
};
