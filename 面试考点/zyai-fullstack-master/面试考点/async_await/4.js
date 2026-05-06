function A() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('A')
      resolve('A is ok')
    }, 1000)
  })
}
function B(context) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(context)  
      console.log('B')
      resolve('B is ok')
    }, 500)
  })
}

function* g() {
  let a = yield A()
  yield B(a)
  // 
}
const gen = g()
// gen.next().value.then((res1) => {
//   gen.next(res1).value.then((res2) => {
//     console.log(res2)
//   })
// })

function co(g, content) {
  const nextObj = g.next(content)   // {value: undefined, done: true}
  if (nextObj.done) {
    return
  }
  nextObj.value.then((res) => {
    co(g, res)
  })
}
co(gen, null)