import _ from 'lodash'
import $ from 'jquery'

export const sum = (a, b) => {
    return a + b
}

console.log(_.chunk(['a','b','c','d'], 3));

console.log($(document.body));

// const p = new Promise((resolve) => {
//     setTimeout(() => {
//         resolve('hellow')
//     }, 1000);
// })

// p.then(r => {
//     console.log(r);
// });