// 定义记分牌的类
class ScorePanel {
  // score 和 level 用来记录分数和等级
  score:number = 0;
  level:number = 1;

  scoreEle: HTMLElement;
  levelEle: HTMLElement;

  // 设置一个变量限制最高等级
  maxLevel: number;
  // 表示多少分升一级
  upScore: number;

  constructor (maxLevel:number = 10, upScore:number = 10) {
    this.scoreEle = document.getElementById('score') as HTMLElement;
    this.levelEle = document.getElementById('level') as HTMLElement;
    this.maxLevel = maxLevel;
    this.upScore = upScore;
  }
  
  // 加分的方法
  addScore () {
    this.score++;
    this.scoreEle.innerHTML = this.score + '';
    if (this.score % this.upScore === 0) this.levelUp();
  }
  // 提升等级的方法
  levelUp () {
    if (this.level < this.maxLevel) { // 最高等级为 10 
      this.level++;
      this.levelEle.innerHTML = this.level + '';
    }
  }
}

export default ScorePanel;