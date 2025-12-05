let n = 123
let s = 'hello'
let f = true
let u = undefined 
let nu = null
let sy = Symbol(1)
let big = 123123123n

let arr = []
let obj = {}
let fn = function() {}
let date = new Date()


// function addKey(obj, key, val) {
//   if (obj 是一个对象) {
//     obj[key] = val
//   }
// }
// const object = {}
// addKey(123, 'age', 18)

// console.log(arr instanceof Array);
console.log(arr instanceof Object); //  Array.prototype.__proto__ == Object.prototype

// console.log(obj instanceof Object);
// console.log(date instanceof Date);
// console.log(fn instanceof Function);

// console.log(n instanceof Number);  // false
console.log(nu instanceof Object);  // false
