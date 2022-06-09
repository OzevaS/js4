const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebplackPlugin = require('terser-webpack-plugin');

const optimization = () => {
    const config = { 
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd)
        config.minimizer = [
            new MinimizerWebpackPlugin(),
            new TerserWebplackPlugin()
        ]

    return config;
}

const filename = ext => isDev ? `${ext}/[name].${ext}` : `${ext}/[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
      MiniCssExtractPlugin.loader,
      "css-loader",
      "postcss-loader"
    ]

    if (extra)
        loaders.push(extra);

    return loaders;
};

const babelOptions = (preset) => {
    const opts = {
      presets: [["@babel/preset-env"]],
    };
    if (preset) {
      opts.presets.push(preset);
    }
    return opts;
};

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log(isDev);

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill','./js/script.js'],
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'app')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
                removeComments: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './img',
              to: isDev ? 'img/[name][ext]' : 'img/[name].[contenthash][ext]'
            },
          ]
        }),
       new MiniCssExtractPlugin({
            filename: filename('css'),
       }),
    ],
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev,
        open: true
    },
    devtool: isDev ? 'source-map' : false,
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: babelOptions()
                },
            },
            {
                test: /\.css$/,
                use: cssLoaders(),
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader'),
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: () => {
                        return isDev ? 'img/[name][ext]' : 'img/[name].[contenthash][ext]';
                    },
                },
            },
            {
                test: /\.(?:|ttf)$/,
                type: 'asset/resource',
                generator: {
                    filename: () => {
                        return isDev ? 'fonts/[name][ext]' : 'fonts/[name].[contenthash][ext]';
                    },
                },
            },
        ]
    }
}