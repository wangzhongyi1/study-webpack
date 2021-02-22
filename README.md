<!--
 * @Author: your name
 * @Date: 2021-01-12 11:11:31
 * @LastEditTime: 2021-01-14 16:39:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue源码实现d:\Backup\桌面\常用重要文件\StudySpace\webpack_study\note.md
-->
# webpack 安装
- 安装本地的 webpack
- yarn add webpack webpack-cli -D

## webpack 可以进行 0 配置
- 打包工具 -> 输出后的结果(js模块)
- 打包 (支持我们的 js 的模块化)

## 手动配置 webpack
- 默认配置文件的文件叫 webpack.config.js
  + 使用指定的配置文件 在 package.json scripts 中配置 build: "webpack --config=webpack.config.my.js", 然后运行 npm run build 即可
  ```js
    "scripts": {
      "build": "webpack --config=webpack.config.my.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```
## webpack 5 中使用 webpack-dev-server 3
- `yarn add webpack-dev-server -D`
- yarn webpack serve
- 因为 webpack 5 和 webpack-dev-server 3 有些冲突，所以不能使用 npx webpack-dev-server 这种直接调用 webpack-dev-server 来启动服务
- 还有热更新的问题，请参考 https://www.cnblogs.com/xiaorong-9/p/14069684.html
  
## webpack 打包 css 
- loader 从右向左执行
```js
module: {
  rules: [
    {test: /\.css$/, use: ['style-loader', 'css-loader']} // 从右向左，先解析 css ，再生成 style 标签插入到 head 中
  ]
}
```

- 抽离 css 成单独的文件
  + `yarn add mini-css-extract-plugin -D`
  + 这是个 webpack 插件，使用如下：
  ```js
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  module.exports = {
    module: {
      rules: [
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader,'css-loader'] },
        { test: /\.less$/, use: [MiniCssExtractPlugin.loader,'css-loader','less-loader'] }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'main.css', // 抽离出去的 css 叫什么名字
      })
    ]
  }
  ``` 

- 给 css 属性自动加浏览器前缀方式一
  + `yarn add postcss postcss-loader autoprefixer -D`
  + 在 pakage.json 中 添加
  ```json
  {
    "browserslist": [
      "defaults",
      "not ie < 8",
      "last 2 versions",
      "> 1%",
      "iOS 7",
      "last 3 iOS versions"
    ],
  }
  ```
  + 在根目录新建 `postcss.config.js` 文件，并配置如下：
  ```js
  module.exports = {
    plugins: [require('autoprefixer')]
  }
  ```
  + 在 css-loader 之前添加 postcss-loader (从右往左解析 loader)
  ```js
    module: {
      rules: [
        { test: /\.css$/, use: ['style-loader','css-loader','postcss-loader'] },
        { test: /\.less$/, use: ['style-loader','css-loader','postcss-loader','less-loader'] }
      ]
    },
  ```
- 给 css 属性自动加浏览器前缀方式二
  + `yarn add postcss postcss-loader postcss-preset-env -D`
  ```js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.(css|less)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-preset-env',
                      {
                        browsers: [
                          "defaults",
                          "not ie < 8",
                          "last 2 versions",
                          "> 1%",
                          "iOS 7",
                          "last 3 iOS versions"
                        ]
                      }
                    ]
                  ]
                }
              }
            },
            'less-loader'
          ]
        }
      ]
    }
  }
  ```

- 使用 ***mini-css-extract-plugin*** 插件后分离出来的 css 文件进行压缩 (打包性能)
  + `yarn add postcss css-minimizer-webpack-plugin -D` 或者 `yarn add optimize-css-assets-webpack-plugin -D`
  + 开启压缩项
  ```js
  // 以下二选一即可
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
  // const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

  module.exports = {
    /* 开启压缩项 */
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        // new OptimizeCssAssetsPlugin(),
      ],
    },
  }
  ```

- 使用 ***mini-css-extract-plugin*** 插件后, 需要自己手动对 js 文件进行压缩 (打包性能)
  + `yarn add uglifyjs-webpack-plugin -D`
  + 手动进行 js 文件的压缩
  ```js
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

  module.exports = {
    /* 开启压缩项 */
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true, // 开启多线程压缩
          sourceMap: true, // 开启源码映射
        })
      ]
    }
  }
  ```

## webpack es6 转 es5
- es6 转 es5 --> 语法转换
  + `yarn add babel-loader @babel/core @babel-preset-env -D`
  + `yarn add core-js@3 -S`
  + 在 webpack.config.js 中配置 loader
  ```js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              cacheDirectory: true, // 开启 babel 缓存，下次打包构建速度更快
            }
          },
          exclude: /node_modules/, // 排除匹配 node_modules 中的 js 文件 (打包性能)
          include: path.resolve(__dirname, 'src') // 只匹配 src 目录下的 js 文件 (打包性能)
        }
      ]
    }
  }
  ```

- es6 转 es5 --> api 转换
  + es6 转 es5，分为高级语法转化低级语法，和高级 api 转化成低级 api
  + 有以下两种方案可以达到目的
  1. `yarn add @babel/plugin-transform-runtime -D` 和 `yarn add @babel/runtime-corejs3 -S`
  ```js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets:[
                [
                  '@babel/preset-env',
                  {
                    modules: false
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                {
                  // 配置 corejs: 3, 需要预先安装 @babel/runtime-core3
                  // 配置 corejs: 2, 需要预先安装 @babel/runtime-core2
                  // 配置 corejs: false, 需要预先安装 @babel/runtime
                  corejs: {
                    version: 3,
                    proposals: true
                  },
                  useESModules: true
                }
              ],
              cacheDirectory: true
            }
          },
          exclude: /node_modules/, // 排除匹配 node_modules 中的 js 文件 (打包性能)
          include: path.resolve(__dirname, 'src'), // 只匹配 src 目录下的 js 文件 (打包性能)
        }
      ]
    }
  }
  ```
  2. 有新旧两种方式
  - 新方式：`yarn add core-js regenerator-runtime -S`
    + 在 index.js 的顶部引入
    ```js
    import 'core-js/stable'
    import 'regenerator-runtime/runtime'
    ```
    + 在 webpack 配置文件中
    ```js
      module.exports = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        modules: false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
                        corejs: 3,
                        // 仅引入代码中使用到的高级语法进行转换
                        useBuiltIns: 'usage', // or 'entry'
                        // 需要兼容的浏览器
                        targets: {
                            chrome: '60',
                            firefox: '60',
                            ie: '9',
                            safari: '10',
                            edge: '17'
                        }
                      }
                    ],
                    '@babel/preset-react'
                  ],
                  cacheDirectory: true, // 开启 babel 缓存，下次打包构建速度更快
                }
              },
              exclude: /node_modules/, // 排除匹配 node_modules 中的 js 文件 (打包性能)
              include: path.resolve(__dirname, 'src') // 只匹配 src 目录下的 js 文件 (打包性能)
            }
          ]
        }
      }
    ```
  - 旧方式：`yarn add @babel/polyfill -S`
    + 使用方式有两种：
      1. 在 项目的入口文件 index.js 的顶部引入
      ```js
      require('@babel/polyfill');
      ```
      2. 在 webpack 配置文件中的 entry 字段添加
      ```js
      module.exports = {
        entry: ['@babel/polyfill', './src/index.js']
      }
      ```
> 总结：转义 ES 新语法 + 新API，有以下两套方案：<br>
> 方案1：@babel/preset-env + @babel/polyfill <br>
> 方案2：@babel/preset-env + @babel/plugin-transform-runtime + @babel/runtime-corejs3 <br>
> 参考：https://segmentfault.com/a/1190000020237817

- webpack5 中配置 babel 的方案
  + `yarn add @babel/core @babel/preset-env babel-loader core-js -D`
  ```js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false, // 对 es6 模块化不进行处理，有利于webpack进行tree-shaking
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3,
                      proposals: true
                    },
                    // 需要兼容的浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
              ]
            }
          }
        }
      ]
    }
  }
  ```

- webpack 中配置 eslint，启用代码校验
  + `yarn add eslint eslint-webpack-plugin -D`
  + 新建 `.eslintrc.js` 文件
  ```js
  module.exports = {
    root: true,
    env: {
      browser: true
    },
    rules: {
      'no-alert': 1
    }
  }
  // 也可以使用别人配置好的 eslint 文件 如：https://github.com/vuejs/eslint-plugin-vue
  ```
+ 在 webpack 配置文件中
```js
const EslintPlugin = require('eslint-webpack-plugin');

module.exports = {
  plugins: [
    new EslintPlugin({fix: true})
  ]
}
```
+ `//eslint-disable-line` 这个注释加在某行代码后面，暂时让一行代码不进行 eslint 校验
+ `<!-- eslint-disable --> code <!-- eslint-enable -->` 忽略代码块 eslint 校验

# 全局变量引入问题
- 将变量暴露给 window ，后续通过 window.xxx 的方式来访问
  + `yarn add expose-loader -D` (内联 loader)
  + expose-loader 有两种使用方式
    1. 在 index.js 中 ` import $ from "expose-loader?exposes[]=$&exposes[]=jQuery!jquery"; `
    2. 在 index.js 中 `import $ from 'jquery' `，在 webpack 配置文件中 `{test: require.resolve('jquery'), loader: 'expose-loader', options: {exposes: ['$', 'jquery']}}`
  
- 在每个模块中注入 jquery, 这种方式不能暴露给全局，不能通过 window.xxx 来取值
  + 在index.js 中 `import $ from 'jquery' `
  + 在 webpack 配置文件中
  ```js
  const webpack = require('webpack');
  module.exports = {
    plugins: [
      new webpack.ProvidePlugin({ // 将 $ 注入到每个模块中，但是没有暴露给 window
        '$': 'jquery'
      })
    ]
  }
  ```

- 如果用户在 index.html head 中使用 cdn 的方式已经引入了，然后又在代码中使用 import $ from 'jquery' 的方式又引入了一遍，这样
  就会造成打包的时候 node_modules 中的 jquery 被打包进来，我们不需要打包，只要使用 cdn 上的就行了。可以在 webpack.config.js 中
  配置忽略项
  + 在 webpack 配置文件中配置打包时的忽略项 (打包性能)
  ```js
  module.exports = {
    externals: {
      'jquery': '$'
    }
  }
  ```

## webpack 中引入处理并打包图片
  - 使用 file-loader 来处理图片资源
    + `yarn add file-loader -D`
    ```js
    module.exports = {
      module: {
        rules: [
          {test: /\.(png|jpg|jpeg|gif)$/i, use: 'file-loader'}
        ]
      }
    }
    ```
  + 然后就可以在文件中使用 `import bg from './images/bg.jpg' ` 的方式来引入图片资源

- 使用 url-loader 来处理图片资源，可以设置最小 size 转换 base64 图片编码
  + `yarn add url-loader -D`
  ```js
  module.exports = {
    module: {
      rules: [
        /* 以下二选一 */
        // {test: /\.(png|jpg|jpeg|gif)$/i, use: {loader: 'url-loader', options: { limit: '1024'}}}
        {test: /\.(png|jpg|jpeg|gif)$/i, use: 'url-loader?limit=1024'}}
      ]
    }
  }
  ```

- 当在 index.html 中直接使用 img 元素来引入图片资源时
  + 需要使用 `html-loader` 来处理直接在 html 文件中引入 图片
  + `yarn add html-loader -D`
  ```js
  module-exports = {
    module: {
      rules: [
        {
          test: /\.html$/i, 
          use: {
            loader: 'html-loader',
            options: {
              attributes: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src'
                }
              ]
            }
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024, // 8k
              // 因为 html-loader 使用的是 commonjs，所以这里也要关闭 es6模块化
              esModule: false,
            }
          }
        }
      ]
    }
  }
  ```

## webpack 中处理字体图标引入
  - 将字体图标和 css 打包到同一个文件中。
    + `yarn add url-loader -D`
    ```js
    module.exports = {
      module: {
        rules: [
          {test: /\.(woff|woff2|svg|ttf|eot)$/i, use: {
            loader: 'url-loader',
            options: {
              limit: 100000, // 这里一定要写的足够大，才能将所有的字体图标打包到 css 中
            }
          }}
        ]
      }
    }
    ```
  - 将字体图标单独打包到一个文件夹中
    + `yarn add file-loader -D`
    ```js
    module.exports = {
      module: {
        rules: [
          // 以下三选一即可
          {test: /\.(woff|woff2|ttf|svg|eot)/i, use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]' // 项目设置打包到 dist下的 fonts 文件夹下
            }
          }},
          {test: /\.(woff|woff2|svg|ttf|eot)$/i, use: {
            loader: 'url-loader',
            options: {
              limit: 1, // 这里一定要写很小，这样就会启用 file-loader 来处理了
              name: 'fonts/[name].[hash:8].[ext]'
            }
          }},
          {test: /\.(woff|woff2|svg|ttf|eot)$/i, use: {
            loader: 'url-loader',
            options: {
              limit: 1, // 这里一定要写很小，这样就会启用 file-loader 来处理了
              outputPath: 'fonts/'
            }
          }}
        ]
      }
    }
    ```

## webpack 中打包出来的文件分类
  - 将打包出来的文件按照 css，img 放入对应的文件夹内
  ```js
  module.exports = {
    module: {
      rules: [
        {test: /\.(png|jpg|gif|jpeg)$/i, use: {loader: 'url-loader', options: {limit: 1024 * 50, outputPath: '/imgs/'}}},
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '/css/main.css', // 抽离出去的 css 叫什么名字
      }),
    ]
  }
  ```
- 也可以将你的打包出来的js, css, img, 在引入这些资源的地方统一加上父路径
  + 所有引入资源的地方统一加
  ```js
  module.exports = {
    output: {
      filename: 'bundle[hash:5].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/static' // 统一加上 /static 父路径(在本地开发的时候不要打开)
    },
  }
  ```
  + 单独给 img 文件加父路径
  ```js
  module.exports = {
    module: {
      rules: [
        {test: /\.(png|jpg|gif|jpeg)$/i, use: {loader: 'url-loader', options: {limit: 1024 * 50, outputPath: '/img/', publicPath: '/static'}}},
      ]
    }
  }
  ```

## webpack 打包后使用 相对路径 代替默认的 绝对路径
  - webpack 打包后所有静态文件的相互引用都是以 / 开头的绝对路径
    + 配置 css 文件和大部分 img 文件使用相对路径
    ```js
    module.exports = {

      publicPath: './',

      module: {
        rules: [
          {test: /\.(png|jpg|gif|jpeg)$/i, use: {loader: 'url-loader', options: {limit: 1024 * 50, outputPath: 'img/' }}},
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: 'css/main.css', // 抽离出去的 css 叫什么名字
        }),
      ]
    }
    ```
    + 配置 `background-img: url(./a.png)` 这种背景图引用时候使用相对路径
    ```js
    module.exports = {
      module: {
        rules: [
          {
            test: /\.(css|less)$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    // 打包后的 css 文件相对于打包后的根路径dist的相对路径, 加上下面这句即可
                    publicPath: '../'
                }
            }, 'css-loader', 'postcss-loader', 'less-loader']
          },
        ]
      }
    }
    ```

## webpack 打包多页引用
  - 需要至少两个入口、两个出口、new 两次 HtmlWebpackPlugin 插件
  ```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      home: './src/home.js',
      other: './src/other.js'
    },
    output: {
      // [name] -> home other
      filename: '[name].js', // 打包输出的文件名
      path: path.resolve(__dirname, 'dist'), // 打包后的输入路径，必须是绝对路径
      publicPath: './' // 使用相对路径引用资源
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'home.html', // 打包后输出的文件名
        chunks: ['home'], // 只引入打包后的 home.js 文件，也可以写多个 ['home', 'other']，这样就会引入多个
        minify: { // 让打包后的 html 也进行压缩
          removeAttributeQuotes: true, // 删除 html 多余空格
          collapseWhitespace: true, // 一行展示
        }
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'other.html',
        chunks: ['other'],
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true
        }
      })
    ]
  }
  ``` 

## webpack 源码映射 (打包性能)
  - 有多种源码映射的配置，只列举常用几种
    ```js
    module.exports = {
      entry: './src/index.js',
      /*
        1) source-map 生成单独的源码映射文件，出错可以定位出错的行和列
        2) eval-source-map 不生成单独的映射文件，出错可以定位出错的行和列
        3) cheap-module-source-map 生成单独的映射文件，出错只可以定位到行不能到列
        4) cheap-module-eval-source-map 不生成单独的映射文件，出错只可以定位到行不能到列
        5) nosources-source-map 生成没有 sourceContent 的 sourceMap，出错可以知道出错的行，不会暴露源码
      */
      devtool: 'source-map'
    }
    ```

## webpack 清除和拷贝目录
  - 每次打包出来 dist 目录之前，先清除上一次的 dist 目录
    + `yarn add clean-webpack-plugin -D`
    ```js
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    
    module.exports = {
      plugins: [
        new CleanWebpackPlugin();
      ]
    }
    ```

  - 直接拷贝某些目录到打包后的 dist 里面
    + `yarn add copy-webpack-plugin@6 -D`
    + 最新的 7 版本有错误，降到 6 版本就可以正常使用了
    ```js
    const CopyWebpackPlugin = require('copy-webpack-plugin');

    module.exports = {
      plugins: [
        new CopyWebpackPlugin({
          patterns: [
            { from: './src/doc', to: './doc' } // 将 src 下面的整个 doc 文件夹内容拷贝到 dist 下面的 doc 文件夹内
          ],
          options: {
            concurrency: 100, // 并发 100
          }
        })
      ]
    }
    ```

## webpack 跨域问题
  - 服务端接口地址是 `http://localhost:5000/user`
  - webpack 服务地址 `http://localhost:3000`
  - xhr 请求地址 `axios.get('/api/user')`
  - webpack proxy 配置
  ```js
  module.exports = {
    devServer: {
      host: 'localhost',
      port: 3000,
      host: true,
      open: false,
      progress: true, // 进度条
      compress: true, // 压缩
      proxy: {
        '/api': {
          target: 'http://localhost:5000', // 代理的目标主机地址
          changeOrigin: true,
          pathRewrite: {
            '^/api': '' // 将 /api 替换成空字符串，最后请求的时候就是 http://localhost:5000/user
          }
        }
      }
    }
  }
  ```

## webpack 配置省略扩展名 别名
  - `import bootstrap from 'bootstrap' ` 默认引入 bootstrap 的 js 文件
    + 可以直接引入 css 文件，`import bootstrap from 'bootstrap/dist/css/bootstrap.css'; `
    + 也可通过修改 webpack 配置文件
    ```js
    module.exports = {
      resolve: { // 解析 第三方包
        modules: [path.resolve('node_modules')],
        alias: { // 别名
          'bootstrap': 'bootstrap/dist/css/bootstrap.css'
        },
        extensions: ['.js', '.json', '.css'], // 配置省略的扩展名
        mainFields: ['style', 'main'], // 配置引入第三方包时的寻找的主字段顺序
        mainFiles: [], // 入口文件名字 index.js
      }
    }
    ```
## webpack 定义环境变量 在全局都可以使用的变量
  > 这里的环境变量并不是指的 development | production，
  > 指的是可以定义一些在项目全局范围内都可以直接访问到的变量
  ```js
  const webpack = require('webpack');

  module.exports = {
    plugins: [
      new webpack.DefinePlugin({
        Author: JSON.stringify('王钟毅'),
        isGood: 'true'
      })
    ]
  }
  ```
  - 然后就可以在项目中的其他 js 文件中访问 `console.log(Author, isGood)`

## webpack 区分不同环境
  - 区分 development 还是 production，然后使用对应的配置文件
  - `yarn add webpack-merge -D`
  - 新建 *webpack.dev.js* 和 *webpack.prod.js* 文件
  ```js
  const { merge } = require('webpack-merge');
  const base = require('./webpack.config.my.js');

  // merge 第二个参数对象可以写对应环境下独有的配置
  module.exports = merge(base, {
    mode: 'development',
    // mode: 'production',
    devServer: {
      host: 'localhost',
      port: 3000,
      hot: true,
      open: false
    }
  })
  ```

## webpack noParse (打包性能)
  - 当你在项目中引入某个包的时候，webpack 会自动去解析这个包的依赖关系(有可能包内部依赖别的包)
  - 当你项目中引入的包确定不会依赖其他的包，配置 noParse，可以让 webpack 不去解析这个包的依赖关系, 加快打包速度
  ```js
  module.exports = {
    module: {
      noParse: /(jquery|bootstrap)/, //不去解析 jquery 和 bootstrap 中的依赖关系
      rules: [
        {test: /\.js$/, use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }}
      ]
    }
  }
  ```

## webpack 多线程打包 (打包性能)
- 使用 happypack 来开启多线程打包文件
  + `yarn add happypack -D`
  ```js
  const HappyPack = require('happypack');

  module.exports = {
    module: {
      rules: [
        {test: /\.css$/, use: 'HappyPack/loader?id=css'},
        {test: /\.js$/, use: 'HappyPack/loader?id=babel'}
      ]
    },
    plugins: [
      new HappyPack({
        id: 'css',
        loaders: ['style-loader','css-loader']
      }),
      new HappyPack({
        id: 'babel',
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                {
                    // 仅引入使用的语法转换
                    useBuiltIns: 'usage'
                },
              ],
              plugins: [
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ]
      })
    ]
  }
  ```

## webpack 使用动态连接库
  > 动态连接库的思想就是将项目中引入的部分不会变动的第三方包提前打包出去赋值给一个变量，
  > 在页面中需要用到的地方直接使用这个变量，而且下次整个项目打包的时候，就不再打包那部分第三方包
  - 新建 `webpack.dll.js`
    ```js
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
        library: '_dll_[name]', // 赋值的变量名称|向外暴露的变量名
        libraryTarget: 'var', // 规范：commonjs var this window ...
      },
      plugins: [
        new webpack.DllPlugin({
          name: '_dll_[name]', // 要和 output 的 library 名称一致
          path: path.resolve(__dirname, 'src/dll', 'manifest.json'), // 生成的清单文件名
        })
      ]
    }
    ```
  - 然后直接用这个配置文件打包
    ```js
    webpack --config=webpack.dll.js
    ```
  - 接着在主配置文件中添加如何寻找清单文件
    ```js
    cosnt path = require('path')
    const webpack = require('webpack')
    module.exports = {
      plugins: [
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, 'src/dll', 'manifest.json')
        })
      ]
    }
    ```
  - 最后你需要自己在打包后的 dist 里面的 index.html 中引入动态连接库文件
  >`<script src="./dll/_dll_react.js"></script>`
  ****
  > 如何才能不需要手动引入最后 script 文件，正在寻找和尝试中
  - 解决上面的手动引入的问题，不更改 dist 下的 index.html 文件
  1. `yarn add add-asset-html-webpack-plugin -D`
  2. 在配置文件中使用这个 plugin
  ```js
  const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
  module.exports = {
    plugins: [
      new AddAssetHtmlWebpackPlugin([
        {filepath: path.resolve(__dirname, './src/dll/_dll_react.js'), outputPath: './static/dll', publicPath: './static/dll'} // 这样就会在打包后的 html 以 script 引入这个文件
      ])
    ]
  }
  ```

## webpack 自带优化 (打包性能)
  - `tree-shaking`
    + 在 webpack 中使用 import 的方式引入资源会把没有使用的模块在打包时自动删除(删除无用代码)
    + 而使用 require 的方式引入资源就只要引入了就会打包，不会去分析无用代码
    + 问：为什么只有 esModule 才能实现 tree-shaking, 而 commonjs 不行？
      * ES6 module 特点：
        - 只能作为模块顶层的语句出现
        - import 的模块名只能是字符串常量
        - import binding 是 immutable的
      1. ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。 
      2. 所谓静态分析就是不执行代码，从字面量上对代码进行分析，ES6之前的模块化，比如我们可以动态require一个模块，只有执行后才知道引用的什么模块，这个就不能通过静态分析去做优化。
      3. 这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS，正是基于这个基础上，才使得 tree-shaking 成为可能，这也是为什么 rollup 和 webpack 2 都要用 ES6 module syntax 才能 tree-shaking。
  - `scope hosting` 作用域提升 
    + webpack 会在打包的时候会将重复冗余的代码进行优化
    ```js
    let a = 1;
    let b = 2; 
    let c = a + b;
    console.log(c);
    // webpack 会在打包的时候直接将 a + b 的值 3 赋值给 c，只会声明一个变量，并不会声明三个变量。
    ```

## webpack 抽离公共代码 (code split)
  - 在开发多页应用的时候，如果不同页面都引入了相同的文件，这样就会打包多份相同模块，现在就是将相同的模块抽离出去
  - chunks 指拆分模块的范围，它有三个值：async、initial、all。
    1. async 表示只从异步加载的模块里进行拆分（指动态 import() 加载）
    2. initial 表示只从入口模块进行拆分
    3. all 以上两者都包括
    > 动态 import 一定会拆分出一个新的 chunk , 而且可以实现懒加载
  - 还需要配合 `runtimeChunk` 来优化 
  ```js
  module.exports = {
    optimization: {
      splitChunk: { // 分割代码块
        cacheGroups: { // 缓存组
          common: {
            chunks: 'initial', // 可以写成异步 async, all, initial
            miniSize: 0, // 最小多少字节就抽离
            miniChunks: 2, // 最少被引用多少次就抽离
          },
          venders: { // 第三方模块
            priority: 1, // 优先级 相当于 z-index
            test: /node_modules/,
            chunks: 'initial',
            miniSize: 0,
            miniChunks: 2,
          }
        }
      },
      // 分割 chunk 后，当前模块依赖引入其他模块的话，会记录其他模块的hash值，通过hash来引入其他模块
      // 这样依赖的模块改变的话，会带着当前模块一起改变，使用runtimeChunk 可以解决这个问题，将 hash 单独打包成一个文件
      runtimeChunk: {
          name: function (entrypoint) {
              console.log('entrypoint:',entrypoint);
              return 'runtime-' + entrypoint.name
          }
      }
    }
  }
  ```

## webpack 实现懒加载和预加载
  - vue 和 react 中的路由懒加载就是基于这个实现的
  ```js
  let button = document.createElement('button');
  button.innerHTML = '按钮';
  button.addEventListener('click', function (e) {
    // es6 草案中的语法，原理是 jsonp 实现动态加载文件, 返回的是一个 promise
    import (/* webpackChunkName: 'chunk_bjs', webpackPrefetch: true */'./b.js').then(data => {
      console.log(data);
    })
  })
  document.body.appendChild(button);
  ```
  - 添加了 *webpackPrefetch: true* 就开启了预加载
  - 懒加载和预加载的区别
    + 懒加载是在使用的时候才加载对应的文件
    + 预加载是利用空闲资源提前加载好对应的文件，使用的时候直接从缓存中拿

## webpack oneOf (打包性能)
  - 在匹配文件的时候，默认会遍历一遍所有的 loader
  - oneOf 会在 loader 命中的时候就停止遍历
    + 需注意 oneOf 中不能有两个配置处理同一类型的文件
    ```js
    module.exports = {
      module: {
        rules: [
          {
            oneOf: [
              {test: /\.css$/, use: ['style-loader','css-loader']}
            ]
          }
        ]
      }
    }
    ```

## webpack 中的 hash chunkhash contenthash 区别
  - hash：webpack 每次打包构建时会生成唯一的 hash 值。缺点：一个文件改变，所有文件的 hash 值都变化
  - chunkhash：根据 chunk 生成 hash 值，同一个 chunk 的文件hash值一样。缺点：一个文件改变，同一 chunk 下的文件hash值都改变
  - contenthash：根据文件内容生成 hash 值，一个文件改变，只改变该文件的 hash 值，不影响其他文件。

## 

