const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  entry: {
    app: path.resolve(__dirname, './src/assets/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
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
    ],
  },
  plugins: [
    ...createHtml(),
    new HtmlWebpackPlugin({
      template: 'src/views/index.pug',
    }),
  ],
  devServer: {
    contentBase: './public',
    hot: true,
  },
};
