const nums = [2, 4, 7, 3, 1, 0]

function findMax(arr) {
  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}

console.log(findMax(nums));  // 7


