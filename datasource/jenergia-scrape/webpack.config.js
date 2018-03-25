const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  target: 'node', 
  externals: ['aws-sdk'], 
  entry: ['@babel/polyfill', './src/handler.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          "presets": [
            ["@babel/preset-env", {
              "targets": {
                "node": "6.10"
              }
            }]
          ]
        }
      }
    }],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './aws-lambda.yaml' },
    ]),
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    new UglifyJsPlugin({
      parallel: true,
      sourceMap: false,
      uglifyOptions: {
        compress: true,
        beautify: false,
        output: {
          comments: false,
        }
      }
    }),
  ],
};
