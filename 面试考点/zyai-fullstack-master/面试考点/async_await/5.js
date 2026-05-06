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

const asyncFn = generatorToAsync(gen)
asyncFn().then((res) => {
  console.log(res, '-------')
})


function generatorToAsync(genObj) {
  return function() {
    return new Promise((resolve, reject) => {
      
      function loop(key, arg) {
        let res = null
        res = genObj[key](arg)   // g.next(undefined)
        const { done, value } = res  // { done: false, value: Promise<pending> }
        if (done) {
          return resolve(value)
        } else {
          // Promise.resolve会返回一个 promise对象，并将 value 这个 promise 中 resolve 的结果resolve 出来
          Promise.resolve(value).then(val => loop('next', val))
        }
      }
      loop('next')

    })

  }
}