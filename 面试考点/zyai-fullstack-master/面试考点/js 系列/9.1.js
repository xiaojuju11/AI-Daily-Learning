Surperson.prototype.card = '工牌'
function Surperson() {
  this.company = '字节跳动'
}

Person.prototype = new Surperson()
function Person(name, age, job) {
  Surperson.call(this)
  this.name = name
  this.age = age
  this.job = job
}

const p = new Person('张三', 18, '前端开发')