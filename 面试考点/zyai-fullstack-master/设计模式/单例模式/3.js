class SingleDog {
  show() {
    console.log('我是一个单例对象');
  }
}
SingleDog.getInstance = (function foo() {
  let instance = new SingleDog()
  return function() {
    return instance
  }
})()


const s1 = SingleDog.getInstance()
const s2 = SingleDog.getInstance()

console.log(s1 === s2);



