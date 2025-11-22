// const fn = function(x, y, z) {  // new Function()
//   return x + y
// }   

// // console.log(fn.name);
// // console.log(fn.length);

// console.log(fn.prototype);

Car.prototype.name = 'su7-Ultra'
Car.prototype.lang = 4800
Car.prototype.height = 1400
Car.prototype.weight = 1.5

function Car(color) {
   // const this = {}   // 1
  // this.name = 'su7-Ultra'
  // this.lang = 4800
  // this.height = 1400
  // this.weight = 1.5
  this.color = color
  // return this  // 3
}
const car1 = new Car('pink')
console.log(car1);
console.log(car1.lang);