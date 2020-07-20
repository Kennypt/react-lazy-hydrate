const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    'react-lazy-hydrate': path.resolve(__dirname, './src/index.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  devtool: 'source-map',
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      // React dep should be available as window.React, not window.react
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  },
  optimization: {
    minimize: false,
  },
  plugins: [new webpack.ProgressPlugin({ percentBy: 'entries' })],
};
