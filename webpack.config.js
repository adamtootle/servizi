const webpack = require('webpack');
const path = require('path');

module.exports = {

  devtool: 'eval',

  entry: ['./app/renderer/bootstrap.jsx'],

  output: {
    libraryTarget: 'umd',
    library: '[name]',
    path: path.join(__dirname, 'app-dist'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.jsx', '.js'],
    modules: [path.join(__dirname, 'node_modules')],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // NODE_ENV: '"production"',
      },
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json?$/,
        // exclude: /node_modules/,
        loader: 'json-loader',
      },
      {
        test: [/node_modules[\\\/](?:electron-settings|key-path-helpers)[\\\/]lib[\\\/](?:.+).js/],
        loaders: ['babel-loader']
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },

  target: 'electron',

};
