// var obj = {
//   a: 1
// }
// function foo(x, y) {    // new Function()  // foo.__proto__  === Function.prototype
//   console.log(this.a, x + y);
// }
// foo.call(obj, 1, 2)


// var obj = {
//   a: 1
// }
// function foo(x, y) {
//   console.log(this.a, x + y);
// }
// var arr = [1, 2]
// foo.apply(obj, arr)



var obj = {
  a: 1
}
function foo(x, y) {
  console.log(this.a, x + y);
}
foo.call(obj, 1, 2)
foo.apply(obj, [1, 2])
const bar = foo.bind(obj, 2, 4)
bar(3)