/**
 * 实现 tapable
 */

class SyncWaterfallHook { // 同步瀑布流钩子
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
        const ret = task(...args);
        if (ret !== undefined) {
          args = [ret]
        }
    })
  }
}

const hook = new SyncWaterfallHook(['name']);
hook.tap('react', function (name) {
  console.log('react ------ ', name);
  return 'react学的不错'
});
hook.tap('vue', function (data) {
  console.log('vue ------ ', data)
})
hook.tap('webpack', function (data) {
  console.log('webpack ------ ', data)
})

hook.call('wzy');
