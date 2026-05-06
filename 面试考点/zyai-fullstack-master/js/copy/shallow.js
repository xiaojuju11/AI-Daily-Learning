const obj = {
  name: '俊杰',
  age: 18,
  like: {
    n: '洗脚',
    m: '台球'
  }
}

function shallowCopy(obj) {
  let o = {}
  // 遍历原对象，将原对象中的 key，value 都存到新对象中一份
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      o[key] = obj[key]
    }
  }
  return o
}

const newObj = shallowCopy(obj)
obj.like.m = '篮球'
console.log(newObj);
