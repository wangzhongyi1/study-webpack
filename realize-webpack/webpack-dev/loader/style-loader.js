const loaderUtils = require('loader-utils');

// 创建 style 标签，插入 head 中
function loader(source) {
  let str = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `
  return str;
}

// 在 style-loader 上写了 pitch 就不会执行后面的 loader 了
// sremainRequest --> css-loader!less-loader!./index.less
loader.pitch = function (remainRequest) { // 剩余的请求
  // 让 style-loader 去处理 css-loader!less-loader!./index.less
  // require路径 返回的就是 css-loader 处理好的结果 require('!css-loader!less-loader!./index.less')
  let str = `
    let style = document.createElement('style');
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainRequest)});
    document.head.appendChild(style);
  `
  return str;
}

module.exports = loader;