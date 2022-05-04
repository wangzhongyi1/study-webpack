// require('@babel/polyfill');

import _ from 'lodash'
import $ from 'jquery'
import { sum } from './js/a.js';
import { sayHello } from './js/b.js'
import Vue from 'vue'
import App from './view/App.vue'

import './css/1.css';
import './css/2.less';
import './css/3.css';

// import baidu from './assets/images/baidu.png'
// import baidu from './assets/images/hua.webp'
import baidu from './assets/images/favicon.ico'

console.log(abc);

console.log(_.concat([1], [3], 'wzy'));
console.log($(document.body).children('img'));

console.log('baidu:',baidu);
const img = new Image();
img.width = '200';
img.height = '100';
img.src = baidu;

document.body.appendChild(img);

console.log(sum(1, 2));
sayHello();

// const map = new Map([
//     [1, 2]
// ])

// console.log(map);

new Vue({
    el: '#app',
    render: h => h(App),
})
