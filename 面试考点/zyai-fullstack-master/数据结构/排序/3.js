const arr = [5, 3, 2, 1, 4]

// [1, 3, 2, 5, 4]

function selectSort(arr) {
  const len = arr.length
  let i = 0, j = len - 1;
  while(i < j) {
    const min = getMin(i, j);
    [arr[i], arr[min]] = [arr[min], arr[i]]
    i++
  }

  function getMin(start, end) {  // 0  4
    let minIndex = start
    for (let i = start; i <= end; i++) {
      if (arr[i] < arr[minIndex]) {
        minIndex = i
      }
    }
    return minIndex
  }

  return arr
}

console.log(selectSort(arr));
