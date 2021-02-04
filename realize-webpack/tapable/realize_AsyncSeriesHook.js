/**
 * 实现 tapable
 */

class AsyncSeriesHook { // 异步串行钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tapAsync (name, task) {
    this.tasks.push(task);
    this.count++
  }

  callAsync (...args) { // ...args => ['wzy', fn]
    const [data, fn] = args;
    let count = 0; //计数器
    const _this = this;
    let cb = function () {
      if (count === _this.tasks.length) {
        return fn();
      }
      _this.tasks[count++](data, cb);
    }
    cb();
  }

}

const hook = new AsyncSeriesHook(['name']);
hook.tapAsync('react', function (name,cb) {
  setTimeout(() => {
    console.log('react ------ ', name);
    cb();
  }, 2000);
});
hook.tapAsync('vue', function (name,cb) {
  setTimeout(() => {
    console.log('vue ------ ', name)
    cb();
  }, 1000);
})
hook.tapAsync('webpack', function (name,cb) {
  setTimeout(() => {
    console.log('webpack ------ ', name)
    cb();
  }, 1000);
})

hook.callAsync('wzy', function () {
  console.log('end......')
});
