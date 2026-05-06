const obj = {
  name: '俊杰',
  age: 18,
  like: {
    n: '洗脚',
    m: '台球'
  }
}

function deepClone(obj) {
  let o = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof(obj[key]) == 'object' && obj[key] !== null) {
        const childObj = deepClone(obj[key])
        o[key] = childObj
      } else {
        o[key] = obj[key]
      }
      
    }
  }
  return o
}

const newObj = deepClone(obj)
obj.like.m = '篮球'

console.log(newObj);
