function A() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('A')
    }, 1000)
  })
}
function B() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('B')
    }, 500)
  })
}

// A().then(() => {
//     B()
// })

async function foo() {
  await A()
  await B() //await 会将后续代码挤到微任务队列中
}
foo()