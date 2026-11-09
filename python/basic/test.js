class Person {
  constructor() {
    this.name = '张三'
  }
  get eat() {
    console.log('我会吃')
  }
}

let p = new Person()
p.eat