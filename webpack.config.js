const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const APP_DIR = path.resolve(__dirname, 'src/');
const BUILD_DIR = path.resolve(__dirname, './public/');
const IMAGES = path.resolve(__dirname, 'src/assets/img/');

const config = {
  entry: path.resolve(__dirname, 'src', 'main.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
      extensions: ['.jsx', '.js']
  },
  devServer: {
    contentBase: './',
    port: 8080,
    compress: true,
    inline: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true, sourceMapContents: true } },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        include: APP_DIR,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json-loader',
      },
      {
        test: /\.(jpe?g|png|gif|mp3|icon)$/i,
        include: IMAGES,
        exclude: /(node_modules|bower_components)/,
        loader: 'file-loader',
      },
    ],
  },
  externals: ['window'],
  plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin({ template: './src/index.html' })],
};

module.exports = config;
