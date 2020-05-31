var path = require('path');
var webpack = require('webpack');

const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },

    devServer: {
        proxy: [{
            path: '/api/',
            target: 'http://localhost:3001'
        }]
    },

    module: {
        rules: [{
            test: /\.(png|jpe?g|gif|nes)$/i,
            loader: 'file-loader',
            options: {
                name: '[path][name].[ext]',
            },
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.js|\.jsx$/,
            exclude: /node_modules/,
            loaders: ['babel-loader'],
            include: path.join(__dirname, 'src')
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            loaders: [
                'style-loader',
                'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                'typed-css-modules-loader',
                'postcss-loader'
            ]
        }, {
            test: /\.tsx?$/,
            loader: 'awesome-typescript-loader',
            exclude: /node_modules/,
            include: path.join(__dirname, 'src')
        }]
    },

    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    plugins: [
        new CheckerPlugin()
    ]
}