/**
 * 实现 tapable
 */

class SyncHook { // 同步钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tap (name, task) {
    this.tasks.push(task);
  }
  call (...args) { // ...args => ['wzy']
    this.tasks.forEach(task => {
      task(...args)
    })
  }
}

const hook = new SyncHook(['name']);
hook.tap('react', function (name) {
  console.log('react ------ ', name)
});
hook.tap('vue', function (name) {
  console.log('vue ------ ', name)
})

hook.call('wzy');
