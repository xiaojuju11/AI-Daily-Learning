// function* g(){//generator(生成器) 函数
//     yield 'A'//yield 是暂停标记，遇到 yield，函数暂停，调用 .next() 才继续往下走
//     yield 'B'
//     yield 'C'
//     return 'D'
//     yield 'E'//return 后面的 yield 会被忽略
// }
// const gen = g() // 得到一个指向内部状态的指针对象
// console.log(gen.next()) // { value: 'A', done: false }
// console.log(gen.next()) // { value: 'B', done: false }
// console.log(gen.next()) // { value: 'C', done: false }
// console.log(gen.next()) // { value: 'D', done: true }
// console.log(gen.next()) // { value: undefined, done: true }
// console.log(gen.next()) // { value: undefined, done: true }


function* g(){
    var o = 1
    yield o++//先返回值，再自增
    yield o++

    //yield o++ = 返回当前值 → 再 +1
    //所以第一次是 1，第二次是 2
}
const gen = g() //gen 是一个迭代器对象
console.log(gen.next()) // { value: 1, done: false }
console.log(gen.next()) // { value: 2, done: false }
console.log(gen.next()) // { value: undefined, done: true }

// const gen2 = g()
// console.log(gen2.next()) 



