// function foo() {
//   console.log(this);
// }
// foo()

// var baz = function() {

// }


function foo() {
  // this
  var bar = () => {
    this.a = 2
  }
  bar()
}
var obj = {
  a: 1,
  baz: foo
}
obj.baz()
// console.log(obj);
