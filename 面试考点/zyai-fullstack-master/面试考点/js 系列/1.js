const arr = [1, 1, 1, 3, 4, 5]

// const newArr = arr.concat(4)
// console.log(arr, newArr);


// const newArr = arr.slice(1, 4)
// console.log(newArr);

// const newArr = arr.filter((item, index, array) => {
//   return item % 2 == 0
// })
// console.log(newArr, arr);
// const newArr = arr.map((item, index, array) => {
//   return item * 10
// })

// console.log(newArr);
// const newArr = new Array(5).fill(0)
// console.log(newArr);
// const newArr = arr.find((item, index, array) => {
//   return item === 6
// })

// const newArr = arr.findIndex((item, index, array) => {
//   return item === 6
// })
// console.log(newArr);
// const index = arr.includes(2)
// console.log(index);
// console.log(arr.toReversed().reverse());


// console.log(arr.sort((a, b) => {
//   return b - a
// }));


// console.log(arr.join(''));

// const num = arr.reduce((pre, item, index, array) => {
//   return pre + item
// }, 0)

// console.log(num);

// const has = arr.every((item, index, array) => {
//   return item > 0
// })
// console.log(has);
// const has = arr.findLastIndex((item, index, array) => {
//   return item === 1
// })
const has = arr.copyWithin(0, 3)
console.log(has);
