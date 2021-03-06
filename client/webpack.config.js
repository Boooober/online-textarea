const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const NODE_ENV = process.env.NODE_ENV || 'development';

const paths = {
  '@hooks': path.resolve(__dirname, 'src/hooks/'),
  '@components': path.resolve(__dirname, 'src/components/')
};

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
    new Dotenv({ defaults: true }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin('[hash].css'),
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
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true }
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    alias: {
      '@hooks': paths['@hooks'],
      '@components': paths['@components']
    }
  },

  devServer: {
    open: true,
    port: 3000,
    host: '0.0.0.0',
    useLocalIp: true,
    disableHostCheck: true
  }
};
