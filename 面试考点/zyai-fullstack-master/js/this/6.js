Person.prototype.say = 'hello'
function Person() {
  // var obj = {name: '冯总'}      1
  // Person.call(obj)   2
  this.name = '冯总'   // 3 
  // obj.__proto__ = Person.prototype  4
  // return obj  // 5
}
let p = new Person()
let p2 = new Person()
