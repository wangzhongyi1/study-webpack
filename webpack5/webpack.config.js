const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader')

// fs.readdir(path.resolve(__dirname, 'dll'), function (err, files) {
//     if (!err) {
//         console.log(files);
//     }
// })

const env = process.env.NODE_ENV;

module.exports = {
    mode: env,
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'static/js/[name][contenthash].js',
        clean: true,
        environment: {
            arrowFunction: false,
        },
        // publicPath: './' //所有引入资源的地方，加上前缀
    },
    module: {
        rules: [
            {
                test: /\.vue$/i,
                loader: 'vue-loader' 
            },
            {
                test: /\.dll.js$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/dll/[name].js'
                }
            },
            {
                test: /\.js$/i,
                exclude: /(node_modules|dll)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true, //开启babel缓存，提高下次构建速度
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: {
                                        version: 3,
                                        proposals: true, //提案阶段的语法/api
                                    },
                                }
                            ]
                        ],
                        plugins: ['@babel/plugin-transform-runtime'],
                    }
                },
            },
            // {
            //     test: /\.(less|css)$/i,
            //     use: [
            //         MiniCssExtractPlugin.loader, //写了这个，就不用写 style-loader 了
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 importLoaders: 2, // 这个一定要开，后面的数量表示后面的loader数量
            //                 esModule: true, // 开启，便于 tree-shaking
            //                 modules: true, // 开启 css模块化，仅针对 类选择器和id选择器
            //             }
            //         },
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 postcssOptions: {
            //                     plugins: [
            //                         // 'autoprefixer'
            //                         // 'postcss-preset-env',
            //                         postcssPresetEnv()
            //                     ]
            //                 }
            //             }
            //         },
            //         'less-loader',
            //     ]
            // },
            {
                test: /\.(png|svg|webp|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/images/[hash][ext][query]'
                }
            },
            {
                test: /\.html$/i, // 用于处理在 html 中引入图片时的路径处理
                loader: 'html-loader'
            },
            {
                oneOf: [ // 使用 oneOf, 里面的文件后缀名匹配到就停止
                    {
                        test: /\.css$/i,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    esModule: true,
                                    modules: true
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            'postcss-preset-env'
                                        ]
                                    }
                                }
                            }
                        ]
                    },
                    {
                        test: /\.less$/i,
                        use: [
                            MiniCssExtractPlugin.loader, //写了这个，就不用写 style-loader 了
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 2, // 这个一定要开，后面的数量表示后面的loader数量
                                    esModule: true, // 开启，便于 tree-shaking
                                    modules: true, // 开启 css模块化，仅针对 类选择器和id选择器
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            // 'autoprefixer'
                                            // 'postcss-preset-env',
                                            postcssPresetEnv()
                                        ]
                                    }
                                }
                            },
                            'less-loader',
                        ]
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/[contenthash][name].css',
            chunkFilename: '[id][contenthash].css',
        }),
        new HtmlWebpackPlugin({
            title: '设置document.title',
            template: './public/index.html',
            //默认defer，在head中引入defer脚本: <script defer="defer" src="main.js"></script>
            scriptLoading: 'defer',
        }),
        // 用了这个插件，会根据outputPath 把相应文件拷贝到相对 dist 下的目录中，就不需要使用 CopyWebpackPlugin 了
        // new AddAssetHtmlPlugin([
        //     { filepath: path.resolve(__dirname, 'dll/lodash.dll.js'), outputPath: 'dll', publicPath: 'dll'},
        //     { filepath: path.resolve(__dirname, 'dll/vue.dll.js'), outputPath: 'dll', publicPath: 'dll'},
        //     { filepath: path.resolve(__dirname, 'dll/jquery.dll.js'), outputPath: 'dll', publicPath: 'dll'},
        // ]),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         // 将根目录下的 dll 文件夹内的 .dll.js 结尾的文件拷贝到 dist 下面
        //         { from: path.resolve(__dirname, 'dll/*.dll.js'), to: path.resolve(__dirname, 'dist') },
        //     ]
        // }),
        new webpack.DllReferencePlugin({ //引用动态连接库
            name: 'lodash',
            manifest: require(path.resolve(__dirname, 'dll', 'lodash-manifest.json')),
        }),
        new webpack.DllReferencePlugin({
            name: 'jquery',
            manifest: require(path.resolve(__dirname, 'dll', 'jquery-manifest.json'))
        }),
        new webpack.DllReferencePlugin({
            name: 'vue',
            manifest: require(path.resolve(__dirname, 'dll', 'vue-manifest.json')),
        }),
        new VueLoaderPlugin(),
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
            }),
            new CssMinimizerPlugin(), //压缩通过 mini-css-extract-plugin 抽离出来的 css文件
        ],
        runtimeChunk: 'single', //单独抽离出 记录运行时模块依赖关系 的文件
        // moduleIds: 'deterministic',
        splitChunks: {
            //例如：项目里引入的 lodash和jquery，下面设置了`chunks: 'all;`打包时默认把用到的node_modules里面的包只分割在一个chunk里面
            //设置了 maxSize 就会把大于后面设置的byte的包尝试分割成单独的chunk，也就是分成了两个文件 loadsh-chunk、jquery-chunk
            maxSize: 1024 * 200,
            // chunks: 'all' //如果不设置这个，项目里用到的第三方包(node_modules里的包)都会打到 main.js 一个文件里面,也可以使用 cacheGroup 来处理 node_modules 下的包
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    devServer: {
        host: 'localhost',
        port: 8089,
        hot: true,
        open: true,
        compress: true,
    },
    // devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.json']
    },
    externals: {
        // key 是用的时候的变量名，value 是包名
        _: 'lodash',
        $: 'jquery',
        Vue: 'vue',
    }
}
