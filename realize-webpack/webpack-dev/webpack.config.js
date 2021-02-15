const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineSourcePlugin = require('./plugins/InlineSourcePlugin.js');

class P{
  apply (compiler) {
    console.log('start');
    compiler.hooks.run.tap('run', function () {
      console.log('this is run hook')
    })
  }
}
class P1{
  apply (compiler) {
    compiler.hooks.emit.tap('emit', function () {
      console.log('this is run emit')
    })
  }
}

class FileListPlugin {
  constructor (props) {
    this.filename = props.filename
  }
  
  apply (compiler) {
    // 文件准备好了，要进行发射
    compiler.hooks.emit.tap('FileListPlugin', compilcation => {
      let assets = compilcation.assets;
      let content = `## 文件名    资源大小\r\n`
      // console.log(assets)
      Object.entries(assets).forEach(v => { // Object.entries 可以将对象转化成数组
        content += `- ${v[0]}   ${v[1].size()}\r\n`
      })
      assets[this.filename] = {
        source () {
          return content;
        },
        size () {
          return content.length;
        }
      }
    })
  }
}


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loader')], // 先去 node_modules 中需要相关 loader，找不到再去 loader 文件夹找
    // alias: {
    //   loader1: path.resolve(__dirname, 'loader', 'style-loader.js'),
    //   loader2: path.resolve(__dirname, 'loader', 'less-loader.js')
    // }
  },
  // watch: true,
  module: {
    /**
     * 真正的 loader 分为两部分：pitch + normal
     * loader顺序: pre > normal > inline > post
     * 
     * -! -->  require('-!line-loader!./a.js') 不让该文件再去通过 pre + normal loader来处理了
     * !  -->  require('!line-loader!./a.js') 不让 normal loader来处理
     * !! --> require('!!line-loader!./a.js') 不让 pre + normal + post loader来处理
     * let str = require('!inline-loader!./a.js')
     * 
     */
    rules: [
      {
        test: /\.js$/, //自己试下 babel-loader
        use: [
          {
            loader: 'my-babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          },
          {
            loader: 'banner-loader.js',
            options: {
              text: '珠峰',
              filename: path.resolve(__dirname, 'banner.js')
            }
          }
        ]
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'
        ]
        // use: [
        //   'loader1',
        //   'style-loader.js',
        //   'css-loader.js',
        //   'less-loader.js'
        //   // 'loader1',
        //   // 'loader2',
        //   // path.resolve(__dirname, 'loader', 'style-loader.js'),
        //   // path.resolve(__dirname, 'loader', 'less-loader.js')
        // ]
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        // 根据图片生成一个 md5 发射到 dist 目录下，还会返回当前的图片路径
        // use: 'my-file-loader',
        use: {
          loader: 'my-url-loader',
          options: {
            limit: 1024 * 2000 // 200k
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      publicPath: './',
      scriptLoading: 'blocking'
    }),
    new InlineSourcePlugin({
      match: /\.(css|js)$/
    }),
    new P(),
    new P1(),
    new FileListPlugin({
      filename: 'list.md'
    }),
  ]
}
