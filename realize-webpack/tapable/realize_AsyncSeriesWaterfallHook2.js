/**
 * 实现 tapable
 */

class AsyncSeriesWaterfallHook { // 异步串行瀑布流钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tapPromise (name, task) {
    this.tasks.push(task);
  }

  promise (...args) { // ...args => ['wzy']
    /**
     * 1. 当前调用 resolve(123), 传入参数，则将这个参数向下传递
     * 2. 当前调用 reject(456), 传入参数，则停止后面的监听函数执行，跳转到最后的 catch 中
     */
    let [first, ...others] = this.tasks;
    let p = first(...args);
    for (let i = 0; i < others.length; i ++) {
      p = p.then(res => {
        if (res !== undefined) args=[res];
        return others[i](...args);
      }).catch(err => {
        // 跳过后面的监听函数的执行
        return Promise.reject(err);
      });
    }
    return p;
  }

}

const hook = new AsyncSeriesWaterfallHook(['name']);
hook.tapPromise('react', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react ------ ', name);
      // resolve(123);
      reject(123456);
    }, 1000);
  })
});
hook.tapPromise('vue', function (data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('vue ------ ', data)
      resolve();
    }, 1000);
  })
})
hook.tapPromise('webpack', function (data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('webpack ------ ', data)
      resolve();
    }, 2000);
  })
})

hook.promise('wzy').then(function () {
  console.log('end......')
}).catch(err => console.log(err));
