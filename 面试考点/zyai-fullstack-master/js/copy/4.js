const obj = {
  name: '俊杰',
  age: 18,
  like: {
    n: '洗脚',
    m: '台球'
  },
  a: 123n,
  say() {
    console.log('hello');
  }
}

const newObj = structuredClone(obj)
obj.like.m = '蓝球'

console.log(newObj);
