const path = require('path');
const fs = require('fs');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevMode = process.env.NODE_ENV !== 'production';
const mode = isDevMode ? 'development' : 'production';

const createHtml = function () {
  const pugs = fs
    .readdirSync(path.resolve(__dirname, 'src/views'))
    .filter((f) => /\.pug$/g.test(f));
  return pugs.map((pug) => {
    return new HtmlWebpackPlugin({
      template: `src/views/${pug}`,
      filename: pug.replace('pug', 'html'),
    });
  });
};

module.exports = {
  target: 'web',
  devtool: 'source-map',
  mode,
  resolve: {
    extensions: ['*', '.pug', '.js', '.jsx', '.json'],
  },
  entry: {
    app: path.resolve(__dirname, './src/assets/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
    filename: 'assets/js/[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: [
          path.resolve(__dirname, 'src/views/partials'),
          path.resolve(__dirname, 'src/views/mixins'),
        ],
        use: [
          { loader: 'raw-loader' },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
          'import-glob-loader',
        ],
      },
    ],
  },
  plugins: [
    new WebpackBar({
      color: 'orange',
    }),
    ...createHtml(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),
  ],
  devServer: {
    contentBase: './public',
    port: 8000,
    hot: true,
  },
};
