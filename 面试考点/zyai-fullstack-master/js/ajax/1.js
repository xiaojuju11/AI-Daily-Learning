function foo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('foo');
      resolve('ok')
    }, 1000)
  })
  
}

function bar() {
  console.log('bar');
}

foo().then((res) => {
  console.log('res', res);
  bar()
})
