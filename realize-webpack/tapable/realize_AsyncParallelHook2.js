/**
 * 实现 tapable
 */

class AsyncParallelHook { // 异步并发钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tapPromise (name, task) {
    this.tasks.push(task);
    this.count++
  }

  promise (...args) { // ...args => ['wzy']
    const newTasks = this.tasks.map(task => task(...args));
    return Promise.all(newTasks);
  }

}

const hook = new AsyncParallelHook(['name']);
hook.tapPromise('react', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('react ------ ', name);
      resolve();
    }, 1000);
  })
});
hook.tapPromise('vue', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('vue ------ ', name)
      resolve();
    }, 2000);
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
