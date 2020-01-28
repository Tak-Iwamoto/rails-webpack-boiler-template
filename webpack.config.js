const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
let entries = {};
glob.sync('./frontend/**/*.{js,jsx,ts,tsx,css,scss,sass}').map((file) => {
  let name = file.split('/')[3].split('.')[0];
  entries[name] = file;
})
module.exports = {
  entry: entries,
  output: {
    filename: "[name]-[hash].js",
    path: path.join(__dirname, 'public', 'assets'),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use:['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          { loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader},
          { loader: 'css-loader',},
          { loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          { loader: 'sass-loader'}
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: "url-loader?limit=100000"
      },
    ],
  },
  resolve: {
    modules:[path.join(__dirname, 'node_modules')],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: 'jquery',
      jquery: 'jquery',
      "window.jQuery": 'jquery',
    }),
    new ManifestPlugin({
      writeToFileEmit: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
};