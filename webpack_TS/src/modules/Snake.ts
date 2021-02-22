class Snake {
  head: HTMLElement;
  bodies: HTMLCollection;
  element: HTMLElement;

  constructor() {
    this.element = document.getElementById('snake') as HTMLElement;
    this.head = document.querySelector('#snake > div') as HTMLElement;
    this.bodies = this.element.getElementsByTagName('div') as HTMLCollection;
  }

  // 获取蛇头坐标
  get X() {
    return this.head.offsetLeft;
  }
  get Y() {
    return this.head.offsetTop;
  }

  // 设置蛇头坐标
  set X(value: number) {
    // 新值和旧值相同，直接返回不再修改
    if (this.X === value) {
      return;
    }
    if (value < 0 || value > 290) {
      // 蛇撞墙了
      throw new Error('蛇撞墙了')
    }

    this.moveBody();
    this.head.style.left = value + 'px';
    this.checkHeadBumpBody();
  }
  set Y(value: number) {
    // 新值和旧值相同，直接返回不再修改
    if (this.Y === value) {
      return;
    }
    if (value < 0 || value > 290) {
      // 蛇撞墙了
      throw new Error('蛇撞墙了')
    }

    this.moveBody();
    this.head.style.top = value + 'px';
    this.checkHeadBumpBody();
  }

  // 蛇增加身体的方法
  addBody() {
    this.element.insertAdjacentHTML('beforeend', '<div></div>');
  }

  // 移动蛇的身体
  moveBody () {
    /**
     * 将蛇身体的最后一节移动到倒数第二节位置上,以此类推
     */
    for (let i = this.bodies.length - 1; i > 0; i--) {
      let X = (this.bodies[i - 1] as HTMLElement).offsetLeft;
      let Y = (this.bodies[i - 1] as HTMLElement).offsetTop;

      (this.bodies[i] as HTMLElement).style.left = X + 'px';
      (this.bodies[i] as HTMLElement).style.top = Y + 'px';
    }
  }

  // 检查蛇头是否撞到身体
  checkHeadBumpBody () {
    var ele:HTMLElement;
    for (let j = 1; j < this.bodies.length; j ++) {
      ele = this.bodies[j] as HTMLElement
      if (this.X === ele.offsetLeft && this.Y === ele.offsetTop) {
        throw new Error('蛇头撞到身体了')
      }
    }
  }

}

export default Snake;