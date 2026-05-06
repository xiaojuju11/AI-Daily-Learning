const obj = {
  name: '俊杰',
  age: 18,
  like: {
    n: '洗脚',
    m: '台球'
  },
  say() {
    console.log('hello');
  },
  a: undefined,
  b: null,
  c: NaN,
  d: Infinity
}

const oo = JSON.parse(JSON.stringify(obj))
obj.like.m = '篮球'

console.log(oo);
