const { merge } = require('webpack-merge');
const base = require('./webpack.config.my.js');

module.exports = merge(base, {
    mode: 'production',
    output: {
        publicPath: './' //指定打包后的资源引用使用相对路径(在本地开发的时候不要打开)
    },
})