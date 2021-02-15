const HtmlWebpackPlugin = require('html-webpack-plugin');

class InlineSourcePlugin {
  constructor ({match}) {
    this.match = match
  }
  apply (compiler) {
    // 要通过 webpackPlugin 来实现
    compiler.hooks.compilation.tap('InlineSourcePlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alterPlugin', (data, cb) => {
        // console.log(data);
        data = this.processTags(data, compilation)
        cb(null, data);
      })
    })
  }

  processTags (data, compilation) { // 处理引入标签的数据
    let headTags = [], bodyTags = [];
    data.headTags.forEach(headTag => {
      headTags.push(this.processTag(headTag, compilation));
    });
    data.bodyTags.forEach(bodyTag => {
      bodyTags.push(this.processTag(bodyTag, compilation));
    });
    return {
      ...data,
      headTags,
      bodyTags
    }
  }

  processTag (tag, compilation) { // 处理某一个标签
    // console.log(tag)
    let newTag, url;
    if (tag.tagName === 'link' && this.match.test(tag.attributes.href)) {
      newTag = {
        tagName: 'style'
      }
      url = tag.attributes.href;
    }
    if (tag.tagName === 'script' && this.match.test(tag.attributes.src)) {
      newTag = {
        tagName: 'script'
      }
      url = tag.attributes.src;
    }
    if (url) {
      url = url.replace('./','');
      // console.log(compilation.assets[url].source())
      newTag.innerHTML = compilation.assets[url].source(); // 文件内容放在 innerHTML 属性上
      
      delete compilation.assets[url]; // 删除原有资源
    }
    if (newTag) return newTag;
    else return tag;
  }
}

module.exports= InlineSourcePlugin