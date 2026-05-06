// const obj = {
//   name: '俊杰',
//   age: 18
// }
// const num = [{a: 1}]
// obj[num] = 1

// console.log(obj);


const m = new Map()
m.set('hello', 'world')
const a = []
m.set(a, 1)
m.set(null, 2)
// m.delete(a)
// m.clear()
// console.log(m);

// for (let [key, val] of m) {
//   console.log(key, val);
// }


// for (let key of m.keys()) {
//   console.log(key);
// }
m.forEach((val, key) => {
  console.log(val, key);
})