Person.prototype.say = function() {
  console.log('想吃漂亮饭');
}

function Person() {
  this.name = '小橘'
}
const p = new Person()
p.say = 'hello' // 这只是给p加了个say属性，不是修改原型上的

console.log(p); // {name: '小橘', say: 'hello'}