const webpack = require('webpack');

module.exports = {

  devtool: 'eval',

  entry: ['./app/app.js'],

  output: {
    libraryTarget: 'umd',
    library: '[name]',
  },

  resolve: {
    extensions: ['', '.jsx', '.js'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"',
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
    ],
  },

  target: 'electron',

};
