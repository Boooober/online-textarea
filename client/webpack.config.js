const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  mode: NODE_ENV,

  devtool: 'source-map',

  entry: {
    app: path.resolve(__dirname, './src/index.tsx')
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '',
    filename: '[name].[hash].js',
    chunkFilename: '[name].chunk.js'
  },

  plugins: [
    new CleanWebpackPlugin(),
    new ExtractTextPlugin('[hash].css'),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    ...(process.env.ANALYZE
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'webpack-report.html',
            openAnalyzer: true
          })
        ]
      : [])
  ],

  module: {
    rules: [
      { test: /\.(woff|woff2|ttf|eot)/, loader: 'file-loader' },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['file-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve('./node_modules'), path.resolve('./src')]
  }
};
