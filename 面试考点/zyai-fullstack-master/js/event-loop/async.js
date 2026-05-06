function a() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('a');
      resolve()
    }, 1000)
  })
}
function b() {
  console.log('b');
}

// a().then(() => {
//   b()
// })
// console.log('hello');


async function foo() {
  setTimeout(() => {
    console.log('c');
  }, 1500)

  await a()  // 当成同步看待
  b()
  console.log('hello');
}

foo() // {}

