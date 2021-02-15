const babel = require('@babel/core');
const { options } = require('less');
const loaderUtils = require('loader-utils');

function loader(source) {
  let options = loaderUtils.getOptions(this);
  // console.log(param, this.async); 
  let cb = this.async(); // 异步返回，需要使用 cb
  babel.transform(source, {
    presets: options.presets,
    sourceMap: true,
    filename: this.resourcePath.split('\\').pop(), // 默认 sourceMap 名字是 unknown, 可以在这里指定
  }, function (err, result) {
    cb(err, result.code, result.map);
  })
  // return source; // 同步返回无效
}

module.exports = loader
