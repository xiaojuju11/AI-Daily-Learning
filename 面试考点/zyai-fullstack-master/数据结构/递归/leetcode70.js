// // // 4
// // // 1 1 1 1
// // // 2 1 1
// // // 2 2
// // // 1 2 1
// // // 1 1 2

// // // 要求达到某个目的的解法的个数
// // // 不要求给出每一种解的具体路径

// // // f(n)
// // // f(n - 1)
// // // f(n - 2)
// // // f(n) = f(n - 1) + f(n - 2)

// const f = []
// var climbStairs = function(n) {
//   if (n == 1) {
//     return 1
//   }
//   if (n == 2) {
//     return 2
//   }
//   if (f[n] === undefined) {
//     f[n] = climbStairs(n - 1) + climbStairs(n - 2)
//   }

//   return f[n]
// };


var climbStairs = function(n) {
  const f = []
  // 已知
  f[1] = 1
  f[2] = 2

  for (let i = 3; i <= n; i++) {
    f[i] = f[i - 1] + f[i - 2]
  }
  
  return f[n]
}