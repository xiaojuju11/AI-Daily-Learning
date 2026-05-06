const arr = [8, 7, 6, 5,  3, 2, 1]
// 5  [4, 3, 2, 1]   [8, 7, 6]
// 3  [2, 1]   [4]
// 2  [1]  []


function quickSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  let midIndex = Mathg.floor(arr.length / 2) 
  let mid = arr.splice(midIndex, 1)[0]  // 4
  let left = []
  let right = []
  const len = arr.length
  for (let i = 0; i < len; i++) {
    if (arr[i] < mid) { 
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  // 5  [4, 3, 2, 1]   [8, 7, 6]
  // 3  [2, 1]   [4]
  // 2  [1]  []

  return [...quickSort(left), mid, ...quickSort(right)]  // [1, 2, 3, 4]
  
}