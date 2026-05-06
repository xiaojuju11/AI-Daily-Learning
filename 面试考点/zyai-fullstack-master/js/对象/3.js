// // function Insert(name, age) {
// //   const obj = {
// //     name: name,
// //     age: age,
// //     job: 'coder'
// //   }
// //   return obj
// // }

// // function Insert2(name, age) {
// //   const obj = {
// //     name: name,
// //     age: age,
// //     job: 'manager'
// //   }
// //   return obj
// // }

// // Insert('晓总', 18)


// function Insert(name, age, job) {
//   this.name = name
//   this.age = age
//   this.job = job
// }
// const p = new Insert('晓总', 18, 'coder') // { name: '晓总', age: 18, job: 'coder' }
// const p2 = new Insert('佳颖', 19, 'manager')
// console.log(p);
// console.log(p2);


function Car(color) {
  this.name = 'su7'
  this.height = '1400'
  this.lang = '4800'
  this.weight = '1500'
  this.color = color
}

const car1 = new Car('purple') // 实例化一个对象
const car2 = Car('purple')

console.log(car2);


