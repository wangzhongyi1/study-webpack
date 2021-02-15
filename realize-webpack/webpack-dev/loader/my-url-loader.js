const loaderUtils = require('loader-utils');
const mime = require('mime'); // 获取文件 mime 类型

function loader(resource) {
  console.log(resource.length)
  let options = loaderUtils.getOptions(this);
  if (options.limit && options.limit > resource.length) {
    return `module.exports='data:${mime.getType(this.resourcePath)};base64,${resource.toString("base64")}'`
  } else {
    require('./my-file-loader').call(this, resource);
  }
}

loader.raw = true; // 二进制
module.exports = loader;