// function identity<T>(value:T):T{
//     return value
// }

// identity<number>(123)

// 泛型约束
// function identity<T,U>(value:T,msg:U):T{
//     console.log(msg)
//     return value
// }

// identity<number,string>(123,'hello')

// let arr:Array<number> = [1,2,3]

let arr:Array<number | string> = [1,2,3,'1']