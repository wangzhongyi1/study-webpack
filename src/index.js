/*
 * @Author: your name
 * @Date: 2021-01-12 11:15:29
 * @LastEditTime: 2021-01-14 16:45:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue源码实现d:\Backup\桌面\常用重要文件\StudySpace\webpack_study\src\index.js
 */
// require('@babel/polyfill')

// 添加 eslint-disable-line 这个注释，告诉 eslint 忽略这一行
console.log('ENV:-------', Auther, IsGood, process) // eslint-disable-line
    // alert(444); // eslint-disable-line
const a = require('./a.js');
const b = () => {
    console.log('箭头函数b');
}

require('./css/index.css');
require('./less/index.less');
require('./fonts/iconfont.css');

// class cla {
//   constructor() {
//     c = 10
//   }
//    fn(a, b) {
//     console.log('这是fn')
//     return a + b;
//   }
// }

function* gen() {
    yield 1
}
console.log(gen.next);

// const p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(123);
//   }, 2000);
// });

// async function res () {
//   const r = await p;
//   console.log(r)
// }
// res();

console.log('aaa'.includes('a'), 'aaa'.includes)

console.log(a)
console.log(b)
console.log(4567)

const button = document.createElement('button');
button.innerHTML = '按钮';
button.addEventListener('click', function(e) {
    // es6 草案中语法，jsonp 实现动态加载, 返回的是一个 promise
    // webpackPrefetch: true 就开启了预加载，预加载是利用空闲资源提前加载文件，懒加载是使用的时候才去加载文件
    import (/* webpackChunkName: 'chunk_bjs', webpackPrefetch: true */'./b.js').then(data => {
        console.log(data)
    })
})
document.body.appendChild(button);


// const $ = require('expose-loader?$!jquery');
import $ from "jquery"; // eslint-disable-line
console.log('$:', $) // eslint-disable-line
    // const $ = require('jquery'); // eslint-disable-line
    // window.$ = $; // eslint-disable-line
    // console.log(window.$) // eslint-disable-line

import bg from './images/bg.jpg'
const abc = 124;
console.log(bg, abc)
const img = new Image(); // eslint-disable-line
img.src = bg;
document.body.appendChild(img)

/* eslint-disable */
let xhr = new XMLHttpRequest();
xhr.open('GET', '/api/user', true);
xhr.onreadystatechange = function(e) {
    if (xhr.status === 200 && xhr.readyState === 4) {
        console.log('xhr-response:', JSON.parse(xhr.response))
    }
}
xhr.send();

/* eslint-enable */
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render( < h1 > Hello world < /h1>, document.getElementById('app'));