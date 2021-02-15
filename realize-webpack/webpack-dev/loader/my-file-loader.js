const loaderUtils = require('loader-utils');

function loader(source) {
  // interpolateName 作用是获取文件hash值，并插入值，生成唯一的文件名
  let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {content: source});
  this.emitFile(filename, source); // 发射文件,会在 dist 下面生成一个文件
  return `module.exports='${filename}'`; // 把原来的路径变成编译后的路径
}
loader.raw = true; // 二进制

module.exports = loader
