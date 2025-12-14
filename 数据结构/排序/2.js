const arr = [5, 3, 2, 1, 4]

// [3, 5, 2, 1, 4]
// [3, 2, 5, 1, 4]
// [3, 2, 1, 5, 4]
// [3, 2, 1, 4, 5]

function bubbleSort(arr) {
  const len = arr.length

  for (let n = 0; n < len; n++) {
    let flag = false
    for (let i = 0; i < len - 1 - n; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
        flag = true
      }
    }
    if (flag == false) return arr
  }

  return arr
}

console.log(bubbleSort(arr));