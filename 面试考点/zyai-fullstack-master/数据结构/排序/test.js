// function mul(n) {
//   if (n == 1) return 1 
//   return n * mul(n - 1)
// }

// mul(5)


const arr1 = [1, 2, 4]
const arr2 = [1, 3, 5, 6, 7]

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

console.log(mergeArr(arr1, arr2));
