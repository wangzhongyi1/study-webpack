import Snake from './Snake';
import Food from './Food';
import ScorePanel from './ScorePanel';

class GameControl {

  snake: Snake;
  food: Food;
  scorePanel: ScorePanel;
  direction: string = '';
  // 标记游戏是否结束
  isLive:boolean = true;
  // 上一次运动方向，防止蛇会掉头
  lastTimeDirection: string = '';

  constructor () {
    this.snake = new Snake();
    this.food = new Food();
    this.scorePanel = new ScorePanel();

    this.init();
  }

  // 游戏初始化
  init () {
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    this.run();
  }

  keydownHandler (e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
      case 'Up':
        this.direction = 'up';
        break;
      case 'ArrowDown':
      case 'Down':
        this.direction = 'down';
        break;
      case 'ArrowLeft':
      case 'Left':
        this.direction = 'left';
        break;
      case 'ArrowRight':
      case 'Right':
        this.direction = 'right';
        break;
    }
  }

  // 控制蛇移动的方法
  run () {
    let X = this.snake.X;
    let Y = this.snake.Y;

    // 防止蛇发生掉头现象
    if (this.lastTimeDirection === 'up' && this.direction === 'down') {
      this.direction = 'up';
    } else if (this.lastTimeDirection === 'down' && this.direction === 'up') {
      this.direction = 'down';
    } else if (this.lastTimeDirection === 'left' && this.direction === 'right') {
      this.direction = 'left';
    } else if (this.lastTimeDirection === 'right' && this.direction === 'left') {
      this.direction = 'right';
    }

    this.lastTimeDirection = this.direction;

    switch(this.direction) {
      case 'up':
        Y -= 10;
        break;
      case 'down':
        Y += 10;
        break;
      case 'left':
        X -= 10;
        break;
      case 'right':
        X += 10;
        break;
    }

    this.checkEat(X, Y);
    
    try {
      this.snake.X = X;
      this.snake.Y = Y;
      // this.snake.moveBody();
    } catch (err) {
      this.isLive = false;
      alert(err.message);
    }

    this.isLive && setTimeout(() => this.run(), 300 - (this.scorePanel.level - 1) * 30);
  }

  // 检查蛇是否吃到食物
  checkEat (X:number, Y:number) {
    if (X === this.food.X && Y === this.food.Y) {
      // 食物位置进行重置
      this.food.change();
      // 分数增加
      this.scorePanel.addScore();
      // 蛇要增加一节
      this.snake.addBody();
    }
  }

}

export default GameControl;