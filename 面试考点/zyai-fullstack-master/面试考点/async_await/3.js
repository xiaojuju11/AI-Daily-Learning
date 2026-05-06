// function* g() {
//   let o = 1
//   let a = yield o++
//   console.log(a);
//   let b = yield o++
// }
// const gen = g()

// console.log(gen.next());
// console.log(gen.next(100));


function* g() {
  yield 1
  yield 2
  yield 3
  yield 4
  yield 5
  return 6
}

const gen = g()

for (let i of gen) {
  console.log(i);
}