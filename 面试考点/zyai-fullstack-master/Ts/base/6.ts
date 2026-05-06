// // // let num = 123
// // // num = 'hello'

// // let someValue:any = 'this is a apple'
// // // let strLength = (someValue as string).length
// // let strLength = (<string>someValue).length



// // 类型守卫
// interface Person {
//   name: string,
//   age: number,
//   sex?: unknown
// }

// const p:Person = {
//   name: '探长',
//   age: 20
// }


// type Person = string | number | boolean
// const a: Person = 'hello'

type PartialX = {x: number}
type Point = PartialX & {y: number}

const p:Point = {
  x: 1,
  y: 2
}

