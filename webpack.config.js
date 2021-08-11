const path = require('path');
const fs = require('fs');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevMode = process.env.NODE_ENV === 'development';
const mode = isDevMode ? 'development' : 'production';

const createHtml = function () {
  const pugs = fs
    .readdirSync(path.resolve(__dirname, 'src/views'))
    .filter((f) => /\.pug$/g.test(f));
  return pugs.map((pug) => {
    return new HtmlWebpackPlugin({
      template: `src/views/${pug}`,
      filename: pug.replace('pug', 'html'),
      inject: true,
      minify: false,
    });
  });
};
const plugins = [
  new WebpackBar({
    color: 'orange',
  }),
  ...createHtml(),
  new MiniCssExtractPlugin({
    filename: './assets/css/[name].css',
  }),
];

module.exports = {
  target: 'web',
  devtool: isDevMode ? 'inline-source-map' : 'source-map',
  mode,
  resolve: {
    extensions: ['*', '.pug', '.js', '.jsx', '.json'],
  },
  entry: {
    app: path.resolve(__dirname, './src/assets/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: 'auto',
    filename: './assets/js/[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: [
          path.resolve(__dirname, 'src/views/layout'),
          path.resolve(__dirname, 'src/views/partials'),
          path.resolve(__dirname, 'src/views/mixins'),
        ],
        use: [
          'html-loader',
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true,
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
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: true,
              modules: true,
            },
          },
          { loader: 'postcss-loader' },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          { loader: 'import-glob-loader' },
        ],
      },
      {
        test: /\.(jpeg|jpg|png|gif|svg|bmp)$/i,
        type: 'asset/resource',
        generator: {
          filename: './assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: './assets/fonts/[name][ext]',
        },
      },
    ],
  },
  plugins,
  devServer: {
    contentBase: './public',
    port: 8000,
    hot: true,
  },
};
