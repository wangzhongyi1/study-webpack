const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        react: ['react', 'react-dom']
    },
    output: {
        filename: '_dll_[name].js',
        path: path.resolve(__dirname, 'src/dll'),
        library: '_dll_[name]', // 赋值的变量名称 _dll_react
        libraryTarget: 'var', // 规范：commonjs var this
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]', // 要和 output 里面的 library 一致
            path: path.resolve(__dirname, 'src/dll', 'manifest.json'), // 生成的清单文件名
        })
    ]
}