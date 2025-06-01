const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/scripts/calculator-main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, 
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html', // ваш исходный index.html
      filename: 'index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
        patterns: [
          { from: "src/styles", to: "styles" }, // копирует папку styles в dist
        ],
      }),
  ],
  mode: 'production', // или 'development' для отладки
  devtool: 'source-map',
};