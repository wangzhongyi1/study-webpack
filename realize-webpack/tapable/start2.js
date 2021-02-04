const {SyncBailHook} = require('tapable');

class Lesson {
  constructor () {
    this.hooks = {
      arch: new SyncBailHook(['name']),

    }
  }

  tap () { // 注册监听函数
    this.hooks.arch.tap('node', function (name) {
      console.log('node-----', name)
      return '不想向下学习了' // 带保险的 hook，在上一个钩子 return 非undefined数据，就停止向下执行
    });
    this.hooks.arch.tap('react', function (name) {
      console.log('react-----', name)
    });
  }

  start () {
    this.hooks.arch.call('wzy');
  }
}

const l = new Lesson();
l.tap(); // 注册这两个事件
l.start(); // 启动钩子
