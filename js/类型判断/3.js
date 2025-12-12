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


function getType(x) {
  const val = Object.prototype.toString.call(x)  // '[object String]'
  const valType = val.slice(-7, -1)             //  0123456789
  return valType
}
console.log(getType(s));  // String

Object.prototype.toString.call(arr)
