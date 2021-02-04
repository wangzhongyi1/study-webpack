/**
 * 实现 tapable
 */

class AsyncSeriesHook { // 异步串行钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tapPromise (name, task) {
    this.tasks.push(task);
    this.count++
  }

  promise (...args) { // ...args => ['wzy']

    // 1. 按顺序执行 promise
    // 2. 返回一个 promise ，供外面使用

    /* let pro = new Promise((resolve, reject) => resolve());
    this.tasks.forEach((task, index) => {
      pro = pro.then(() => task(...args))
    })
    return pro */

    /* let p = this.tasks[0](...args); //取出第一个promise
    for (let i = 1; i < this.tasks.length; i ++) {
      p = p.then(() => this.tasks[i](...args))
    }
    return p; */

    // 利用数组 reduce 方法
    const [first, ...others] = this.tasks;
    others.reduce((p, n) => {
      return p.then(() => n(...args));
    }, first(...args));
  }

}

const hook = new AsyncSeriesHook(['name']);
hook.tapPromise('react', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react ------ ', name);
      resolve();
    }, 2000);
  })
});
hook.tapPromise('vue', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('vue ------ ', name)
      resolve();
    }, 1000);
  })
})
hook.tapPromise('webpack', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('webpack ------ ', name)
      resolve();
    }, 1000);
  })
})

hook.promise('wzy').then(function () {
  console.log('end......')
});
