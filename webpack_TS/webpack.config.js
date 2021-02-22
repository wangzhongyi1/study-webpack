const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundel.js',
    path: path.resolve(__dirname, 'dist'),
    environment: {
      // 关闭打包结果使用箭头函数
      arrowFunction: false,
      // 不使用 const
      const: false
    }
  },
  devServer: {
    host: '127.0.0.1',
    port: '8000',
    hot: true,
    progress: true
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|ts)$/,
            use:[
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        modules: false, // 对 es6 模块化不做处理，有利于进行 tree-shaking
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
              },
              'ts-loader'
            ],
            exclude: /node_modules/
          },
          {
            test: /\.(css|less)$/,
            use: ['style-loader', 'css-loader', {
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
            } ,'less-loader']
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      publicPath: './',
      scriptLoading: 'blocking'
    }),
    new CleanWebpackPlugin()
  ]
}
