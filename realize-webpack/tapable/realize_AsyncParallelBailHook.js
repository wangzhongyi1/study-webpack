/**
 * 实现 tapable
 */

class AsyncParallelBailHook { // 异步并行带保险（会熔断）的发钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tapPromise (name, task) {
    this.tasks.push(task);
  }

  promise (...args) { // ...args => ['wzy']
    const newTasks = this.tasks.map(task => task(...args));
    // 未实现
  }

}

const hook = new AsyncParallelBailHook(['name']);
hook.tapPromise('react', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react ------ ', name);
      resolve(123);
    }, 1000);
  })
});
hook.tapPromise('vue', function (name,cb) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('vue ------ ', name)
      resolve();
    }, 1000);
  })
})
hook.tapPromise('webpack', function (name,cb) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('webpack ------ ', name)
      resolve();
    }, 2000);
  })
})

hook.promise('wzy').then(function () {
  console.log('end......')
});
