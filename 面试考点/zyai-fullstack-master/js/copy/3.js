const obj = {
  name: '俊杰',
  like: ['泡脚']
}
// const obj2 = {
//   age: 18
// }
const newObj = Object.assign({}, obj)
obj.like[0] = '台球'

console.log(newObj);
