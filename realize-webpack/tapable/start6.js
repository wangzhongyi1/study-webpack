const {AsyncParallelHook} = require('tapable');
// 异步并发钩子，需要等待所有并发的异步事件执行后再执行回调函数

// 注册方法分为同步 tap，异步 tapAsync、tapPromise

class Lesson {
  constructor () {
    this.hooks = {
      arch: new AsyncParallelHook(['name']),
    }
  }

  tap () { // 注册监听函数
    this.hooks.arch.tapPromise('node', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node-----', name)
          resolve();
        }, 1000);
      })
    });
    this.hooks.arch.tapPromise('react', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react-----', name)
          resolve();
        },3000);
      })
    });
  }

  start () {
    this.hooks.arch.promise('wzy').then(function () {
      console.log('end......')
    });
  }
}

const l = new Lesson();
l.tap(); // 注册这两个事件
l.start(); // 启动钩子
