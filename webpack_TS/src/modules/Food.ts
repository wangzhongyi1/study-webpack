// 定义食物类
class Food {
  element: HTMLElement;

  constructor () {
    this.element = document.getElementById('food')!;
  }

  get X () {
    return this.element.offsetLeft;
  }

  get Y () {
    return this.element.offsetTop;
  }

  // 修改食物的位置
  change () {
    // 蛇每次移动一格，一格 10px
    // 食物的位置最小 0 * 10px， 最大 29 * 10px
    const left = Math.floor(Math.random() * 30) * 10 + 'px';
    const top = Math.floor(Math.random() * 30) * 10 + 'px';

    this.element.style.left = left;
    this.element.style.top = top;
  }
}

export default Food;