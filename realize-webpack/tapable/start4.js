const {SyncLoopHook} = require('tapable');

class Lesson {
  constructor () {
    this.index = 0
    this.hooks = {
      arch: new SyncLoopHook(['name']),
    }
  }

  tap () { // 注册监听函数
    var _this = this;
    this.hooks.arch.tap('node', function (name) {
      console.log('node-----', name)
      return ++_this.index>3?undefined:'node学的不错' // 同步循环钩子,返回 undefined 向下执行，返回非undefined 进行循环当前函数
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
