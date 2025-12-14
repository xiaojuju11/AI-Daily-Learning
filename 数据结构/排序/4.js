const arr = [5, 3, 2, 1, 4]  // 3

// function insertSort(arr) {
//   const len = arr.length
//   const newArr = [arr[0]]  // [1, 2, 3, 5] 

//   for (let i = 1; i < len; i++) {
//     let current = arr[i]
//     let j = newArr.length - 1  // 1

//     while(j >= 0 && newArr[j] > current) {
//       // 给 current 让位置
//       newArr[j + 1] = newArr[j]
//       newArr[j] = current
//       j--
//     }
//   }

//   return newArr

// }

function insertSort(arr) {  // [5]
  const len = arr.length
  let temp;
  for (let i = 1; i < len; i++) {  // [2, 3, 5, 1, 4]  2
    let j = i
    temp = arr[i]
    while(j > 0 && arr[j -1] > temp) {
      arr[j] = arr[j - 1]
      j--
    }
    arr[j] = temp
  }
  return arr
}

console.log(insertSort(arr));