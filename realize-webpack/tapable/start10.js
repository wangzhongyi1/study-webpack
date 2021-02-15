const {AsyncSeriesWaterfallHook} = require('tapable');
// 异步串行瀑布流钩子，当前 reject(123) 中传入错误，就跳过后面监听函数，执行最后的 promise 回调函数
// 当前 resolve(123) 传入数据，那么下个监听函数会拿到这个数据

// 注册方法分为同步 tap，异步 tapAsync、tapPromise

class Lesson {
  constructor () {
    this.hooks = {
      arch: new AsyncSeriesWaterfallHook(['name']),
    }
  }

  tap () { // 注册监听函数
    this.hooks.arch.tapPromise('node', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node-----', name)
          resolve(789);
          // reject(987);
        }, 2000);
      })
    });
    this.hooks.arch.tapPromise('react', function (data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react-----', data)
          resolve();
        }, 1000);
      })
    });
  }

  start () {
    this.hooks.arch.promise('wzy').then(function () {
      console.log('end......')
    }).catch(err => console.log(err));
  }
}

const l = new Lesson();
l.tap(); // 注册这两个事件
l.start(); // 启动钩子
