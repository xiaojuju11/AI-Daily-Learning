const arr = [1, 2, 3]
arr.forEach((item, i, array) => {
  if (i < 2) {
    console.log(item);
    return 
  }
})

// const newArr = arr.map((item, i, array) => {
//   return item * 10
// })
// console.log(newArr);




// let s = new Set(['a', 'b', 'c'])
// let s2 = new Set(['d', 'e', 'c'])
// // s.forEach((val, key) => {
// //   console.log(val, key);
// // })

// console.log(s.isSupersetOf(s2));
