module.exports = {
    plugins: [
        require('postcss-nested'),
        require('postcss-for'),
        require('autoprefixer')({
            browsers: ['last 2 versions', 'ie >= 9']
        })
    ]
}