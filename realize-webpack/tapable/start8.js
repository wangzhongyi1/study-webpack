const {AsyncSeriesHook} = require('tapable');
// 异步串行钩子，一个个按顺序执行完异步事件执行后再执行回调函数

// 注册方法分为同步 tap，异步 tapAsync、tapPromise

class Lesson {
  constructor () {
    this.hooks = {
      arch: new AsyncSeriesHook(['name']),
    }
  }

  tap () { // 注册监听函数
    this.hooks.arch.tapAsync('node', function (name,cb) {
      setTimeout(() => {
        console.log('node-----', name)
        cb();
      }, 2000);
    });
    this.hooks.arch.tapAsync('react', function (name,cb) {
      setTimeout(() => {
        console.log('react-----', name)
        cb();
      }, 1000);
    });
  }

  start () {
    this.hooks.arch.callAsync('wzy', function () {
      console.log('end......')
    });
  }
}

const l = new Lesson();
l.tap(); // 注册这两个事件
l.start(); // 启动钩子
