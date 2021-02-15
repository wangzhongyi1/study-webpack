let str = require('./a.js');
require('./index.less');

class Animal {
  constructor(type){
    this.type = type
  }
  run () {
    console.log('running...')
  }
}
console.log(new Animal('dog').run());

console.log(str);

import p from './er.png'
console.log(p)
let img = document.createElement('img');
img.src = p;
// document.body.appendChild(img);
