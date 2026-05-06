// Person.prototype.run = function() {
//   console.log('running');
// }
// Person.say = '你好'

// function Person() {
//   this.name = '子涵'
//   return 'hello'
// }
// let p = new Person()  // {name: '子涵'}
// console.log(Person.say);




class Person {   // 类
  constructor() {
    this.name = '子涵'
  }
  run() {
    console.log('running');
  }
  static say() {
    console.log('你好');
  }
}
let p = new Person()
Person.say()

