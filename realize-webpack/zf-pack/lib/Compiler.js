const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

/**
 * @babel/parser
 * @babel/traverse
 * @babel/types
 * @babel/generator
 */
const babylon = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;
const {SyncHook} = require('tapable');

class Compiler {
  constructor (config) {
    this.config = config;
    // 需要保存入口文件的路径
    this.entryId; // './src/index.js'
    // 需要保存所有的模块依赖
    this.modules = [];
    this.entry = config.entry; // 入口路径
    // 工作路径
    this.root = process.cwd();
    this.hooks = {
      entryOptions: new SyncHook(),
      compiler: new SyncHook(),
      afterCompiler: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(['run']),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    // 如果传递了 plugins 参数
    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(p => p.apply(this));
    }
    this.hooks.afterPlugins.call();
  }
  getSource (path) {
    let content = fs.readFileSync(path, 'utf8');
    let rules = this.config.module.rules;
    rules.forEach(rule => {
      let {test, use} = rule;
      let len = use.length - 1;
      if (test.test(path)) { // 需要通过 loader 来转换代码
        function normalLoader() {
          let loaderFn = require(use[len--]);
          content = loaderFn(content);
          if (len >= 0) {
            normalLoader();
          }
        }
        normalLoader();
      }
    })
    return content
  }
  // 解析源码
  parse (source, parentPath) {// AST 解析语法树
    let ast = babylon.parse(source);
    let dependencies = []; //依赖数组
    traverse(ast, {
      CallExpression(p){ // a() require()
        let node = p.node; // 对应节点
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__';
          let moduleName = node.arguments[0].value; // 模块引用名字
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js'); // ./a.js
          moduleName = './' + path.join(parentPath, moduleName); // ./src/a.js
          dependencies.push(moduleName);
          node.arguments = [t.stringLiteral(moduleName)];
        }
      }
    })
    let sourceCode = generator(ast).code;
    return {
      sourceCode,
      dependencies
    }
  }
  buildModule (modulePath, isEntry) { 
    // 拿到模块内容
    let source = this.getSource(modulePath);
    // 模块 id moduleId src/index.js
    let moduleName = './' + path.relative(this.root, modulePath);
    if (isEntry) this.entryId = moduleName; // 保存入口名字
    // 解析需要把 source 源码进行改造，返回一个依赖列表
    let {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName));
    // 把相对路径和模块内容对应起来
    // this.modules[moduleName] = sourceCode;
    this.modules.push({moduleName, sourceCode});
    dependencies.forEach(v => this.buildModule(path.join(this.root, v), false));
  }
  emitFile () { // 发射文件
    this.hooks.emit.call();
    // 用数据渲染 拿到输出到哪个目录下
    let main = path.join(this.config.output.path, this.config.output.filename);
    let templateStr = this.getSource(path.resolve(__dirname, 'main.ejs'));
    let code = ejs.render(templateStr, {modules: this.modules});
    
    this.assets = {// 资源中路径对应的代码
      [main]: code
    }
    fs.writeFileSync(main, this.assets[main]);

  }
  run () {
    this.hooks.run.call();
    this.hooks.compiler.call();
    // 创建模块的依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true);
    this.hooks.afterCompiler.call();
    // 发射一个文件 打包后的文件
    this.emitFile();
    this.hooks.done.call();
  }
}

module.exports = Compiler
