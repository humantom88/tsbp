var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.js',
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
        rules: [
            {
                test: /\.jpg$/i,
                loader: 'file-loader',
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.js$/i,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'postcss-loader'
                ]
            }
        ]
    }
}
