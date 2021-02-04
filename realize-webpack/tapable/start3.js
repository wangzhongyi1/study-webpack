const {SyncWaterfallHook} = require('tapable');

class Lesson {
  constructor () {
    this.hooks = {
      arch: new SyncWaterfallHook(['name']),

    }
  }

  tap () { // 注册监听函数
    this.hooks.arch.tap('node', function (name) {
      console.log('node-----', name)
      return 'node学的还不错' // 同步瀑布流钩子，将当前的返回值传递到下个函数中
    });
    this.hooks.arch.tap('react', function (data) {
      console.log('react-----', data)
    });
  }

  start () {
    this.hooks.arch.call('wzy');
  }
}

const l = new Lesson();
l.tap(); // 注册这两个事件
l.start(); // 启动钩子
