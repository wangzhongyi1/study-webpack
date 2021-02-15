const {AsyncSeriesWaterfallHook} = require('tapable');
// 异步串行瀑布流钩子，当前 cb('err') 中传入错误，就跳过后面监听函数，执行最后的 callAsync 回调函数
// 当前 cb(null, '数据') 中没有传入错误，传入数据，那么下个监听函数会拿到这个数据

// 注册方法分为同步 tap，异步 tapAsync、tapPromise

class Lesson {
  constructor () {
    this.hooks = {
      arch: new AsyncSeriesWaterfallHook(['name']),
    }
  }

  tap () { // 注册监听函数
    this.hooks.arch.tapAsync('node', function (name,cb) {
      setTimeout(() => {
        console.log('node-----', name)
        cb(null, '数据');
        // cb('err', '数据');
      }, 2000);
    });
    this.hooks.arch.tapAsync('react', function (data,cb) {
      setTimeout(() => {
        console.log('react-----', data)
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
