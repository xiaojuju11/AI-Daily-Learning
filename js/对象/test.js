var num = 123
num.a = 'aaa'
delete num.a
console.log(num.a); // undefined  看吧，属性被删了

var str = 'hello'
// typeof('hello') 结果是 string
// 其实暗地里是 var str = new String('hello')
str.len = 2
delete str.len