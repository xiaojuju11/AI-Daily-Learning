//4
//1111
//211
//22
//121
//112

//要求达到某个目的的解法的个数
//不要求给出每一种解的具体路径
// const f = []
// var climbStairs = function (n) {
//     if (n === 1 || n === 2) {
//         return n
//     }
//     if (f[n] === undefined) {
//         f[n] = climbStairs(n - 1) + climbStairs(n - 2)
//     }
//     return f[n]
// };

 var climbStairs = function (n){
    const f = []
    //已知
    f[1] = 1
    f[2] = 2
    for(let i = 3;i<=n;i++){
        f[i] = f[i-1] + f[i-2]
    }
    return f[n]
 }