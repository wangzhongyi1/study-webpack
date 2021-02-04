/**
 * 实现 tapable
 */

class SyncLoopHook { // 同步循环钩子
  constructor (args) { // args => ['name']
    this.tasks = []
  }

  tap (name, task) {
    this.tasks.push(task);
  }
  call (...args) { // ...args => ['wzy']
    /* let result, index = 0;
    do {
      result = this.tasks[index++](...args);
    }while(result===undefined && index < this.tasks.length) */
    
    this.tasks.forEach(task => {
      // 将当前函数 return 的结果传递给下个函数
        let ret = task(...args);
        while (ret) {
          ret = task(...args);
        }
    })
  }
}

let total = 0;
const hook = new SyncLoopHook(['name']);
hook.tap('react', function (name) {
  console.log('react ------ ', name);
  return ++total>3? undefined : 'react学的不错'
});
hook.tap('vue', function (name) {
  console.log('vue ------ ', name)
})
hook.tap('webpack', function (name) {
  console.log('webpack ------ ', name)
})

hook.call('wzy');
