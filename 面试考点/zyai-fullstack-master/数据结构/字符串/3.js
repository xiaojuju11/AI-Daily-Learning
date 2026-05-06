// '上海自来水来自海上'   //回文

let str = 'yesseya'

// function isPalidrome(s) {
//   const reversedStr = s.split('').reverse().join('')
//   return reversedStr == str
//   // if (reversedStr == str) {
//   //   return true
//   // }
//   // return false
// }


function isPalidrome(s) {
  
  let l = 0
  let r = s.length - 1

  while (l < r) {
    if (s[l] == s[r]) {
      l++
      r--
    } else {
      return false
    }
  }

  return true

}


console.log(isPalidrome(str));
