## html-webpack-plugin
- 使用这个插件来管理你的其他的文件的引入，因为后期每个文件会根据 contenthash 生成文件名，你不可能每次都手动导入所有文件
    + npm i postcss-loader postcss-preset-env -D
    + postcss-preset-env 这个包引用了 autoprefixer包，所以不用单独再下 autoprefixer包了

## 引入图片，字体图标的处理
- 在 webpack4 处理这两种文件需要借助 url-loader 和 file-loader
- 但在 webpack5 中只需要在 rules 中新增一条规则，然后写上 type: 'asset' 即可
    + 更多，请参考：https://webpack.docschina.org/guides/asset-management/#loading-images

## html-loader
- 处理在 html 文件中引入图片等资源的路径处理

## babel-loader
- core-js 和 @babel/polyfill 的区别
    + 两者的作用一样，都是用于生产环境，用于给新API提供垫片，下载的时候选其一即可
    + @babel/polyfill(目前已弃用) 里包含了 core-js@2 版本，所以配置时只能写: `corejs.version: '2.0'`
    + 而单独使用 core-js 就可以下载 2或3 版本了
- @babel/plugin-transform-runtim
    + 上面下载的垫片有两种使用方式
        * 一是在你项目的入口文件顶端全局导入，省事但是体积大
        * 二是在你用到新API的文件顶端手动按需引入，体积小但是麻烦
    + 使用这个插件，就能帮我们在用到新API的地方自动帮我们按需引入
- @babel/runtime
    + 上面的自动按需引入，可能有个问题，就是它会在用到的文件里都引入垫片，这样可能会造成重复引入
        * a.js 和 b.js 里都需要用到 Promise的垫片，它会在两个文件中都引入Promise垫片，但实际我们只需要在公共的文件里引入一次就够了
    + 所以这个插件就是在模块化开发的时候，多个文件写重复的新API，只帮我们加载一次垫片
## 动态连接库
### webpack.DllPlugin 用于定义动态连接库
- 需要新建 `webpack.dll.js` 的配置文件专门用于提前打包第三方库的
- 在 output 中,需要写上 library，已经 clean.keep
```js
{
    output: {
        path: path.resolve(__dirname, 'dll'),
        filename: '[name].dll.js'
        library: {
            name: '[name]',
            type: 'var'
        },
        clean: {
            keep: /-manifest\.json$/, //不写，会导致打包后的 manifest.json 结尾相关文件被删除
        }
    }
}
```
- 然后在 plugins 数组中新增插件
```js
{
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, 'dll', '[name]-manifest.json') //生成 manifest 文件的地方
        })
    ]
}
```
### webpack.DllReferencePlugin 用于引入连接库
- 在主配置文件 webpack.config.js 中的 plugin 引入动态连接库
```js
{
    plugins: [
        new webpack.DllReferencePlugin({ //引用动态连接库
            manifest: require(path.resolve(__dirname, 'dll', 'lodash-manifest.json')),
        }),
        new webpack.DllReferencePlugin({
            name: 'vue',
            manifest: require(path.resolve(__dirname, 'dll', 'vue-manifest.json'))
        }),
    ]
}
```
- 然后可以在 externals 中排除一下相关包(用了动态连接库，这里不写，默认会排除)
```js
{
    externals: {
        _: 'lodash',
        $: 'jquery',
        Vue: 'vue',
    }
}
```
- 最后需要我们自己在打包后的 index.html 中通过 script-src 的方式引入所需的文件
1. 可以通过 `add-asset-html-webpack-plugin` 插件帮我们自动做这件事
```js
{
    plugins: [
        new AddAssetHtmlPlugin([
            // outputPath 相对于 dist目录来写，会自动将 filepath的文件复制到 dist/dll 目录下
            {filepath: path.resolve(__dirname, 'dll/vue.dll.js'), outputPath: 'dll', publicPath: './dll'}
        ])
    ]
}
```
2. 可以使用 webpack5 的方式处理这个问题(webpack4借助file-loader应该也可以实现，没试过)
+ 在 public 的 index.html 这个模板文件中写上要引入的文件
```html
<html>
    <head>
        <!-- <script defer="defer" src="../dll/lodash.dll.js"></script> -->
        <!-- <script defer="defer" src="../dll/vue.dll.js"></script> -->
    </head>
    <body>
        <!-- 可以在head中写带defer的脚步引入，或者在body的最下面这里引入 -->
        <script src="../dll/lodash.dll.js"></script>
        <script src="../dll/vue.dll.js"></script>
    </body>
</html>
```
+ 新增一条规则
```js
{
    module: {
        rules: [
            {
                test: /\.dll.js$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/dll/[name].js'
                }
            }
        ]
    }
}
```
+ 然后在原来的 babel-loader 匹配时排除动态连接库提前打包出去的文件夹
```js
{
    module: {
        rules: [
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
                use: 'babel-loader'
            }
        ]
    }
}
```