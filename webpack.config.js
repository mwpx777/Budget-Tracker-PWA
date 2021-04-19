const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const fileLoader = require('file-loader');


const config = {
    entry: {
        app: './public/js/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    },
    plugins : [
        new webpack.ProvidePlugin({
            $ : 'jQuery',
            jQuery: 'jquery'
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ],
    mode: 'development'
};

module.exports = config;