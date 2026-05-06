function foo() {
  var myname = '佳颖'
  var age = 18
  function bar() {
    console.log(myname);
  }
  return bar
}
var baz = foo()
baz()
