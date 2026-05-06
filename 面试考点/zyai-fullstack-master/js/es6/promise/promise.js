class Promise {
  constructor(fn) {
    function resolve() {

    }
    function reject() {

    }
    fn(resolve, reject)
  }
}

new Promise((a, b) => {
  a()
})