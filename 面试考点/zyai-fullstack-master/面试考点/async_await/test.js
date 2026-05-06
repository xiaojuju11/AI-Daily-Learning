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


async function foo() {
  const res = await A()
  const res2 = await B(res)    // await 会将后续代码挤到微任务队列中
  console.log(res2)
  return 'hello'
}
foo().then((res) => {
  console.log(res, '-------')
})