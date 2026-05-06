const s = "babad"   // bab   aba

// var longestPalindrome = function (s) {
//   let res = s[0]
//   let n = 0
//   while (n < s.length - 1) {
//     for (let i = 0; i <= s.length; i++) {
//       const item = s.slice(n, n + i)
//       if (item.length > res.length && isPalind(item)) {
//         res = item
//       }
//     }
//     n++
//   }

//   return res
// };
// function isPalind(str) {
//   return str.split('').reverse().join('') === str
// }

// var longestPalindrome = function (s) {
//   let res = s[0]
//   for (let i = 0; i < s.length; i++) {
//     // s[i] c
//     for (let j = 1; j <= 2; j++) {
//       let left = i, right = i + j;

//       while (left >= 0 && right < s.length && s[left] === s[right]) {
//         left--
//         right++
//       }
//       let length = (right - 1) - (left + 1) + 1
//       if (length > res.length) {
//         res = s.substr(left + 1, length)
//       }
//     }





//   }

//   return res
// }

var longestPalindrome = function (s) {
  const dp = []  // 存各种情况的状态  [[1, ], [, 1,], [, , 1], [, , , 1], [, , , , 1]]
  const len = s.length
  for (let i = 0; i < len; i++) {
    dp[i] = []
  }

  let st = 0, end = 0  // 最长的回文子串的两端

  for (let i = 0; i < len; i++) {  // 初始化最长的回文字串是 1
    dp[i][i] = 1
  }

  for (let i = 0; i < len - 1; i++) {   // "b a  a  a d"
    if (s[i] === s[i + 1]) { 
      dp[i][i + 1] = 1
      st = i
      end = i + 1
    }
  }

  for (let n = 3; n <= len; n++) { // n 代表字串的长度
    for (let i = 0; i <= len - n; i++) {
      let j = i + n - 1
      if (dp[i + 1][j - 1]) {
        if (s[i] == s[j]) {
          dp[i][j] = 1
          st = i
          end = j
        }
      }

    }
  }
  
  return s.slice(st, end+1)

}

console.log(longestPalindrome(s));
