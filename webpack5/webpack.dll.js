const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    // 这种数组的写法，会把三个包都打到一个文件里，文件太大不好，可以用对象的形式，就会分别打出三个文件了
    // entry: {
    //     vender: ['lodash', 'vue', 'jquery'],
    // },
    entry: {
        lodash:  'lodash', //这样写，就会直接去 node_modules 里去找模块了
        vue: 'vue',
        jquery: 'jquery'
    },
    output: {
        path: path.resolve(__dirname, 'dll'),
        filename: '[name].dll.js',
        library: {
            name: '[name]',
            type: 'var'
        },
        // clean: true, 直接这样写，会导致下面的 xxx-manifest.json 文件生成不出来
        clean: {
            keep: /-manifest\.json/
        }
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]', //和 output.library.name 保持一致，不写也可以
            type: 'var', //和 output.library.type 保持一致, 不写也可以
            path: path.resolve(__dirname, 'dll', '[name]-manifest.json'), // manifest.json 的输出路径
            format: true,
            entryOnly: true, //说是利于 tree-shaking,不知道会不会影响其他
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false, //删除注释
                    }
                },
                extractComments: false, //不把 .LICENSE.txt 文件剥离开
            })
        ]
    }
}