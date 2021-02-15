const loaderUtils = require('loader-utils');
const {validate} = require('schema-utils');
const fs = require('fs');

function loader(source) {
  /* this.cacheable(false); // webpack 默认会启用缓存，我们可以手动禁止 */
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  // let cb = this.async();
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  };

  validate(schema, options, 'banner-loader'); // 校验传入的参数 (骨架，需要校验的选项，出错的返回信息)

  if (options.filename) {
    /* this.addDependency(options.filename) // 将该文件添加到 watch 依赖里面 */
    fs.readFile(options.filename, 'utf8', function (err, data) {
      cb(err, `/**${data}**/${source}`)
    })
    // fs.readFileSync(options.filename, 'utf8', function (err, data) {
    //   return `/**${data}**/${source}`
    // })
  } else {
    cb(null, `/**${options.text}**/${source}`)
    // return `/**${data}**/${source}`
  }
  // return source
}

module.exports = loader