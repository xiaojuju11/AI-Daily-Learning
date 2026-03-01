// // let num = 123

// let someValue:any = 'this is a string'
// // 类型断言 可以将 any 类型断言为 任何其他类型
// // 但是 不能将 一个具体的类型 断言为 一个不相关的类型
// // let strLength = (someValue as string).length
// let strLength = (<string>someValue).length

// // 类型守卫
// interface person {
//     name: string
//     age: number
//     sex?: unknown
// }

// const p:person = {
//     name: '张三',
//     age: 18,
// }

// type person {
//     name: string
//     age: number
//     sex?: unknown
// }

// const p:person = {
//     name: '张三',
//     age: 18,
// }

//联合类型
// type Person = string | number | boolean
// const a:Person = 'hello'

// 交叉类型
type PartailX = {x:number}
type Point = PartailX & {y:number}

const p:Point = {
    x: 100,
    y: 200,
}




