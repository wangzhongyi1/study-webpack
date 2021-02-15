const less = require('less');

function loader(source) {
  let css = '';
  less.render(source, function (err, c) {
    css = c.css;
  })
  // css = css.replace(/\n/g, '\\n') // 将 \n 转化成 \\n
  // css = css.replace(/\s+/g, '') // 去除空白符
  return css;
}

module.exports = loader
