let str = 'hello world'
console.log(str.length);
console.log(str[1]);
console.log(str + 'hi');

let arr = str.split(' ')
arr.splice(1, 0, '俊杰')
console.log(arr.join(' '));