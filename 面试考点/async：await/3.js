// function* g() {
//     let o = 1
//     let a = yield o++
//     console.log(a) //undefined //
//     let b = yield o++

// }
// const gen = g()
// console.log(gen.next(100)) // { value: 1, done: false }
// console.log(gen.next()) // { value: 2, done: false }

// // 第一个 next () 不能传参，传了也没用
// // 第 n 次 next (参数) → 给第 n-1 个 yield 赋值
// // 不传参 → 赋值 undefined

function* g(){
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
    return 6
}
const gen = g()

for(let i of gen){
    console.log(i)
}

// for...of 循环遍历生成器时：
// 只取 yield 后面的值
// 自动忽略 return 的值
// 遇到 done: true 就停止循环