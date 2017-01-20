var path = require('path');
var webpack = require('webpack');

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

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    module: {
        loaders: [
            { 
                test: /\.tsx?$/,
                loader: 'ts-loader',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            },{
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: [
                    'style-loader', 
                    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 
                    'typed-css-modules-loader',
                    'postcss-loader'
                ]
            }
        ],

        preLoaders: [
            { test: /\.js$/, loader: 'source-map-loader' }
        ]
    }
}