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
  let b = yield B(a)
  return b
}
const gen = g()

const co = require('co')
co(gen).then(res => console.log(res))
