/**
 * 实现 tapable
 */

class SyncBailHook { // 同步带保险钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tap (name, task) {
    this.tasks.push(task);
  }
  call (...args) { // ...args => ['wzy']
    let flag = true;
    this.tasks.forEach((task, index) => {
      // 看当前函数执行的返回值是否 undefined,如果非undefined 就停止向下执行
      if (flag) {
        const ret = task(...args); // 得到函数返回值
        ret===undefined ? flag=true : flag=false
      }
    })
  }
}

const hook = new SyncBailHook(['name']);
hook.tap('react', function (name) {
  console.log('react ------ ', name);
  return '停止执行'
});
hook.tap('vue', function (name) {
  console.log('vue ------ ', name)
})
hook.tap('webpack', function (name) {
  console.log('webpack ------ ', name)
})

hook.call('wzy');
