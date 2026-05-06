// var a = 1
// function fn() {
//   function a() {}
//   var a = 2
//   console.log(a);
// }
// fn()


function fn(a) {
  console.log(a);  // function a() {}
  var a = 123
  console.log(a);  // 123
  function a() {}
  var b = function() {}
  console.log(b);  // function() {}
  function c() {}
  var c = a
  console.log(c);  // 123
}

// AO = {
//   a: undefined  1  function a() {}  123,
//   b: undefined  function() {},
//   c: undefined  function c() {}, 123
// }

fn(1)