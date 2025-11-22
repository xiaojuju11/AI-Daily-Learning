Person.prototype.say = function() {
  console.log('我太帅了');
}

function Person() {
  this.name = '饶总'
}
const p = new Person()  // p 里面显示拥有一个属性 name 隐式拥有一个属性 say
p.say = 'hello'

console.log(p);


const p2 = new Person()
console.log(p2.say);
