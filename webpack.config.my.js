/*
 * @Author: wangzhongyi
 * @Date: 2021-01-12 13:34:49
 * @LastEditTime: 2021-01-14 15:25:36
 * @LastEditors: Please set LastEditors
 * @Description: webpack 基本配置学习
 * @FilePath: \vue源码实现d:\Backup\桌面\常用重要文件\StudySpace\webpack_study\webpack.config.js
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

/*
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
        new EslintPlugin(),
        new webpack.ProvidePlugin({
            '$': 'jquery'
        })
    ],
    module: {
        rules: [
            { test: /\.(css|less)$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'] },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                        ],
                        exclude: /node_modules/,
                        include: path.resolve(__dirname, 'src')
                    }
                }
            },
            { test: /\.(png|jpg|jpeg|gif)$/, use: 'url-loader?limit=1024' },
            { test: /\.html$/, use: 'html-loader' }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ]
    },
    externals: {
        'jquery': '$'
    }
}
*/
module.exports = {
    // mode: 'development', // development production
    // entry: ['@babel/polyfill', './src/index.js'], // 入口
    entry: {
        home: './src/index.js',
        other: './src/other.js'
    },
    target: 'web',
    devServer: {
        host: '127.0.0.1',
        port: 3000,
        progress: true,
        hot: true,
        open: false,
        compress: true, // 压缩
        contentBase: './dist', // 指向的目录
        proxy: { // 配置跨域代理
            // '/api': 'http://localhost:5000'
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    // 配置解析规则
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],// 告诉 webpack 解析模块去哪个目录找，找不到会一直向上级目录找
        extensions: ['.js', '.json', '.css'],
        alias: {
            'bootstrap': 'bootstrap/dist/css/bootstrap.css'
        },
        mainFields: ['main', 'style'], // 入口主字段顺序
        // manFiles: ['index.js'],
    },
    output: {
        // [name] home, other
        filename: 'static/js/[name][contenthash].js', // 打包后的文件名 [hash:5] 添加 5 位的 hash 戳，防止浏览器缓存和文件覆盖
        path: path.resolve(__dirname, 'dist'), // 打包后的输出路径 路径必须是一个绝对路径
        chunkFilename: 'static/js/chunks/[name][contenthash].js'
        // publicPath: '/static'
        // publicPath: './' //指定打包后的资源引用使用相对路径(在本地开发的时候不要打开)
    },
    module: {
        noParse: /jquery/,
        rules: [
            // {test: /\.css$/, use: ['style-loader', 'css-loader']},
            // {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']}
            // {
            //     test: /\.css$/,
            //     use: [{
            //         loader: MiniCssExtractPlugin.loader,
            //         options: {
            //             // 打包后的 css 文件相对于打包后的根路径dist的相对路径
            //             publicPath: '../'
            //         }
            //     }, 'css-loader', 'postcss-loader']
            // },
            {
                // oneOf 会在以下 loader 命中以后，就停止向下匹配
                oneOf: [
                    {
                        test: /\.(c|le)ss$/,
                        use: [{
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // 打包后的 css 文件相对于打包后的根路径dist的相对路径
                                publicPath: '../../'
                            }
                        }, 'css-loader', 'postcss-loader', 'less-loader']
                    },
        
                    {
                        test: /\.js$/,
                        use: 'HappyPack/loader?id=babel',
                        // use: {
                        //     loader: 'babel-loader',
                        //     options: { // 用 babel-loader 将 es6 转 es5
                        //         presets: [
                        //             '@babel/preset-env'
                        //         ],
                        //         plugins: [
                        //             '@babel/plugin-transform-runtime'
                        //         ],
                        //     }
                        // },
                        exclude: /node_modules/,
                        include: path.resolve(__dirname, 'src')
                    },
                    // {test: require.resolve('jquery'), loader: 'expose-loader', options: {exposes: ['$', 'jquery']}}
                    { test: /\.(png|jpg|gif|jpeg)$/i, use: { loader: 'url-loader', options: { limit: 1, outputPath: 'static/img/', esModule: false } } },
                    { test: /\.(woff|woff2|ttf|eot|svg)$/i, use: { loader: 'url-loader', options: { limit: 1, outputPath: 'static/fonts/' } } },
                    {
                        test: /\.html$/i,
                        use: {
                            loader: 'html-loader',
                            options: {
                                attributes: {
                                    list: [{
                                        tag: 'img',
                                        attribute: 'src',
                                        type: 'src'
                                    }]
                                }
                            }
                        }
                    }
                ]
            },

        ]
    },
    // externals: {
    //     'jquery': '$'
    // },
    // 1) source-map 源码映射，会单独生成一个 sourcemap 文件，出错了会标识当前出错的行和列
    // 2) eval-source-map 不会单独生成映射文件，集成在打包后的文件中，出错会标识行和列
    // 3) cheap-module-source-map 会生成单独的映射文件，出错会标识行，但不会标识列
    // 4) cheap-module-eval-source-map 不会生成单独的映射文件，出错会标识行，但不会标识列
    // devtool: 'nosources-source-map', // 增加映射文件，可以帮我们调试源代码
    // 放所有 webpack 插件
    plugins: [
        /* 创建应用程序的 html 入口文件 */
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: { // 让打包后的 html 也进行压缩
                removeAttributeQuotes: true, // 删除 html 属性多余空格
                collapseWhitespace: true, // 一行展示
                removeComments: true, // 删除注释
            },
            hash: true, // 添加 hash 戳
            // chunks: ['home']
        }),
        /* new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'other.html',
            minify: { // 让打包后的 html 也进行压缩
                removeAttributeQuotes: true, // 删除 html 属性多余空格
                collapseWhitespace: true, // 一行展示
            },
            hash: true, // 添加 hash 戳
            chunks: ['other']
        }), */
        new MiniCssExtractPlugin({
            filename: 'static/css/main[contenthash].css', // 抽离出去的 css 叫什么名字
        }),
        // new EslintPlugin(),
        new webpack.ProvidePlugin({ // 将 $ 注入每个模块中
            '$': 'jquery'
        }),
        new CleanWebpackPlugin(), // 在打包出来之前先清除 dist 目录
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/doc', to: './static/doc' },
                // { from: './src/dll', to: './static/dll' }
            ],
            options: {
                concurrency: 100, // 并发 100
            }
        }),
        new webpack.DefinePlugin({
            Auther: JSON.stringify('王钟毅'),
            IsGood: 'true'
        }),
        new HappyPack({
            id: 'babel',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        // '@babel/preset-env',
                        [
                            '@babel/preset-env',
                            {
                                modules: false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
                                // corejs: 3,
                                // // 仅引入使用的语法转换
                                // useBuiltIns: 'usage', // or 'entry'
                                // // 需要兼容的浏览器
                                // targets: {
                                //     chrome: '60',
                                //     firefox: '60',
                                //     ie: '9',
                                //     safari: '10',
                                //     edge: '17'
                                // }
                            },
                        ],
                        '@babel/preset-react'
                    ],
                    plugins: [
                        // '@babel/plugin-transform-runtime'
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                // 配置 corejs: 3, 需要预先安装 @babel/runtime-corejs3
                                // 配置 corejs: 2, 需要预先安装 @babel/runtime-corejs2
                                // 配置 corejs: false, 需要预先安装 @babel/runtime
                                corejs: {
                                    version: 3,
                                    proposals: true
                                },
                                useESModules: true
                            }
                        ]
                    ],
                    cacheDirectory: true, // 开启 babel 缓存，第二次构建的时候，会读取缓存，只更新需要更新的模块
                }
            }]
        }),
        // 配置动态连接库寻找的 清单文件
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'src/dll', 'manifest.json')
        }),
        new AddAssetHtmlWebpackPlugin([
            {filepath: path.resolve(__dirname, 'src/dll/_dll_react.js'), outputPath: './static/dll', publicPath: './static/dll'}
        ])
        // new webpack.HotModuleReplacementPlugin(), // 热更新插件
    ],
    /* 开启压缩项 */
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(), // 压缩 css
            new UglifyJsPlugin({
                cache: true,
                parallel: true, // 开启多线程压缩
                sourceMap: true, // 开启源码映射
            })
        ],
        splitChunks: { // 分割代码块
            cacheGroups: { // 缓存组
                common: { // 公共的模块
                    chunks: 'initial',
                    minSize: 0, // 最小多少字节就抽离
                    minChunks: 2, // 最少被引用多少次就抽离 
                },
                venders: { // 第三方模块
                    priority: 1, // 优先级 相当于 z-index
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 2
                }
            }
        },
        // 分割 chunk 后，当前模块依赖引入其他模块的话，会记录其他模块的hash值，通过hash来引入其他模块
        // 这样依赖的模块改变的话，会带着当前模块一起改变，使用runtimeChunk 可以解决这个问题，将 hash 单独打包成一个文件
        runtimeChunk: {
            name: function (entrypoint) {
                return 'runtime-' + entrypoint.name
            }
        }
    },
}