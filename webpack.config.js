const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');


const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PAGES = fs.readdirSync(PAGES_DIR).map((filename) => filename);

module.exports = {
  mode: process.env.NODE_ENV ,

  entry: {
    scripts: './src/index.js',
  },

  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src', 'styles'),
      '@assets': path.resolve(__dirname, 'src', 'assets'),
      '@helpers': path.resolve(__dirname, 'src', 'helpers'),
    },
  },

  output: {
    filename: '[name].[contenthash].js',
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split('/')
        .slice(1)
        .join('/');
      return `${filepath}/[name][ext]`;
    },
    clean: true,
  },
  devServer: {
    open: '/start-page.html',
    static: {
      directory: './src',
      watch: true,
    },
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),

    ...PAGES.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}/${page}.pug`,
          filename: `./${page}.html`,
        })
    ),

    new CopyPlugin({
      patterns: [{ from: 'src/favicon/', to: 'favicon' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          process.env.NODE_ENV  === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                    },
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /(node_modules|bower_components)/,
        options: {
          root: path.resolve(__dirname, 'src', 'blocks'),
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
