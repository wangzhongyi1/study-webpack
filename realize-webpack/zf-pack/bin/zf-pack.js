#! /usr/bin/env node

// 1） 找到执行本文件的执行路径，拿到 webpack 配置文件

const path = require('path');
// webpack.config.js
let config = require(path.resolve(process.cwd(), './webpack.config.js'));

let Compiler = require('../lib/Compiler.js');
let compiler = new Compiler(config);
compiler.hooks.entryOptions.call();
// 运行编译
compiler.run();
