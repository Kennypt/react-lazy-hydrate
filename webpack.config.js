const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    'react-lazy-hydrate': path.resolve(__dirname, "./src/index.jsx"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [{ test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" }],
  },
  optimization: {
    runtimeChunk: "single",
  },
  plugins: [
    new webpack.ProgressPlugin({ percentBy: "entries" }),
  ],
};
