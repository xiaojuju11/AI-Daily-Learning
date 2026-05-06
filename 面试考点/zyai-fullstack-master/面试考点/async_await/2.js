// function* g() {
//   // yield 'A'
//   // yield 'B'
//   // yield 'C'
//   return 'D'
// }
// const gen = g()  // 得到一个指向内部状态的指针对象
// console.log(gen.next()); // { value: 'A', done: false }
// console.log(gen.next()); // { value: 'B', done: false }
// console.log(gen.next()); // { value: 'C', done: false }
// console.log(gen.next()); // { value: 'D', done: true }
// console.log(gen.next());


function* g() {
  var o = 1
  yield 
  yield o++
  yield o++
}
const gen = g()  // gen 是一个迭代器对象
console.log(gen.next());  // { value: 1, done: false }

// const gen2 = g()
// console.log(gen2.next())
