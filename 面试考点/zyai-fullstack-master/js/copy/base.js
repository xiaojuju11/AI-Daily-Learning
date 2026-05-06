Object.prototype.d = 4
const obj = {
  a: 1,
  b: 2,
  c: 3
}
// // console.log(Object.values(obj));
// // const keys = Object.keys(obj)
// // for (let i = 0; i < keys.length; i++) {
// //   // keys[i]   
// //   // obj[keys[i]]
// //   console.log(keys[i], obj[keys[i]]);
// // }

for (let key in obj) {
  if (obj.hasOwnProperty(key)) { // 当前的 key 是否是 obj 显示属性
    console.log(key);
  }
}


// const obj = {
//   a: 1,
//   // cc: 33
// }
// const c = 'cc'
// obj[c] = 33
// console.log(obj);
