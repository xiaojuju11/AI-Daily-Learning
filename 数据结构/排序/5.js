const arr = [8, 7, 6, 5, 4, 3, 2, 1]

// [8, 7, 6, 5]  [4, 3, 2, 1]
// [8, 7]  [6, 5]   [4, 3,]  [2, 1]
// [8,] [7]  [6,]  [5]   [4,] [3,]  [2,]  [1]

// [7, 8]  [5, 6]  [3, 4]   [1, 2]
// [5, 6, 7, 8]  [1, 2, 3, 4]

function mergeSort(arr) {
  const len = arr.length
  if (len <= 1) {
    return arr
  }
  // 分割
  const mid = Math.floor(len / 2)
  const leftArr = mergeSort(arr.slice(0, mid))  // [8]
  const rightArr = mergeSort(arr.slice(mid, len)) // [7]

  // 合并两个有序数组，让它还是有序的
  return mergeArr(leftArr, rightArr)   // O(n)
}


function mergeArr(arr1, arr2) {
  let res = []
  let i = 0
  let j = 0

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      res.push(arr1[i])
      i++
    } else {
      res.push(arr2[j])
      j++
    }
  }

  if (i < arr1.length) {
    res = res.concat(arr1.slice(i))
  } else {
    res = [...res, ...arr2.slice(j)]
  }

  return res
}


console.log(mergeSort(arr));

// F(n) = F(n/2) + F(n/2) + O(n) = 2 ^ 1 * T(n/2) + 2^0 * O(n)
// 