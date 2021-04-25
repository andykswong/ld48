const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const PRODUCTION = 'production';

const mode = process.env.NODE_ENV || PRODUCTION;
const isProd = mode === PRODUCTION;
const debug = process.env.DEBUG || !isProd;

const ASSET_DIR = path.resolve(__dirname, 'src/assets');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  mode,
  entry: {
    ld48: {
      import: './src'
    }
  },
  output: {
    filename: '[name].min.js',
    path: OUTPUT_DIR,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: 'source-map-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.jsx', '.js' ],
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2015,
          module: true,
          toplevel: true,
          compress: {
            passes: 5,
            drop_console: !debug
          },
          mangle: {
            properties: false
          }
        },
      }),
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'DEBUG': debug
    }),
    new CopyPlugin({
      patterns: [
        { from: ASSET_DIR, to: OUTPUT_DIR }
      ],
    })
  ],
  devtool: isProd ? false : 'source-map',
  devServer: {
    contentBase: ASSET_DIR
  }
};
