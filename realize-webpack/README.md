# 实现简易 webpack 的步骤

## 搭建本地调试环境
- 在 `zf-pack` 文件夹下的 `package.json` 中的加
```js
{
  "bin": {
    "zf-pack": "./bin/zf-pack.js" // 指向的文件
  }
}
```
- 然后在 `bin/zf-pack.js` 文件的首行写 **#! /usr/bin/env node**, 告诉计算机用什么语言来执行这个文件
- 接着在 `zf-pack` 文件夹下运行 `npm link`
  + `npm link` 是将当前这个包映射到全局环境中
  + 然后其他地方就可以通过 `npm link zf-pack` 来链接到这个包
  + 接着可以通过 `npx zf-pack` 运行 `zf-pack.js` 这个文件
- 下一步是在 `webpack-dev` 文件夹中配置编写正常的基于 webpack 的代码
- 最后在 `webpack-dev` 文件夹下运行 `npx zf-pack` 来代替 `npx webpack` 进行打包。