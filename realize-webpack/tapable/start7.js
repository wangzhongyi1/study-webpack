const {AsyncParallelBailHook} = require('tapable');
// 异步并发带保险的钩子，resolve或reject中添加参数调用，就会触发熔断
// resolve(123) reject(123) ,就会先去执行最后的回调函数, 再返回来往后执行

// 注册方法分为同步 tap，异步 tapAsync、tapPromise

class Lesson {
  constructor () {
    this.hooks = {
      arch: new AsyncParallelBailHook(['name']),
    }
  }

  tap () { // 注册监听函数
    this.hooks.arch.tapPromise('node', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node-----', name)
          // resolve(123);
          reject(333);
        }, 1000);
      })
    });
    this.hooks.arch.tapPromise('react', function (name) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react-----', name)
          resolve();
        },1000);
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
