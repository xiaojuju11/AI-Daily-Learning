// let isDone: boolean = false
// let count: number = 123
// let str: string = 'hello'

// const sym: symbol = Symbol()
// let obj: object = {
//     [sym]: 'hello'
// }

// const list: number[] = [1, 2, 3]

// enum Direction {
//     North,
//     South,
//     East,
//     West
// }
// let dir: Direction = Direction.North

// let notSure: any = 100
// notSure = 'hello'

// let value: unknown = 123
// value = 'hello'

// let abc: string = 'hello'
// abc = notSure

// notSure = value

// let tuple: [number, string] = [100, 'hello']

// function user(): number {//函数的类型取决于返回值的类型
//     return 123
// }

// function user():void {
//     console.log('hello')
// }

function user():Function {
    return function():number {
        return 123
    }
}
//undefined、null是所有类型的子类型
let u :undefined = undefined
let n :null = null

