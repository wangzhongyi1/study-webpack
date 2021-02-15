/**
 * 实现 tapable
 */

class AsyncSeriesWaterfallHook { // 异步串行瀑布流钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tapAsync (name, task) {
    this.tasks.push(task);
  }

  callAsync (...args) { // ...args => ['wzy', fn]
    let [data, fn] = args;
    let index = 0, _this = this;

    let next = function (...args2) {
      if (index === _this.tasks.length) return fn();
      if (index === 0) {
        _this.tasks[0](data, next);
      } else {
        if (args2.length === 1 && args2[0] !== null) {
          // 直接执行最后的 fn
          return fn();
        }
        if (args2.length === 2 && args2[0] === null) {
          data = args2[1];
        }
        _this.tasks[index](data, next);
      }
      index++;
    }
    next();

  }

}

const hook = new AsyncSeriesWaterfallHook(['name']);
hook.tapAsync('react', function (name,cb) {
  setTimeout(() => {
    console.log('react ------ ', name);
    // cb(null, '数据');
    // cb('err');
    cb();
  }, 1000);
});
hook.tapAsync('vue', function (data,cb) {
  setTimeout(() => {
    console.log('vue ------ ', data)
    cb();
  }, 1000);
})
hook.tapAsync('webpack', function (data,cb) {
  setTimeout(() => {
    console.log('webpack ------ ', data)
    cb();
  }, 2000);
})

hook.callAsync('wzy', function () {
  console.log('end......')
});
