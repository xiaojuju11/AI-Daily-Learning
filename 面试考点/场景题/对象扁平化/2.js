//对象扁平化
let obj = {
    a: 1,
    b: [1, 2, { c: true }, [3]],
    d: { e: 2, f: 3 },
    g: null
}

let output = {
    'a': 1,
    'b[0]': 1,
    'b[1]': 2,
    'b[2].c': true,
    'b[3][0]': 3,
    'd.e': 2,
    'd.f': 3,
    'g': null
}

function flattenObj(obj) {
  const res = {}

  function dfs(target, oldKey) {   // 尾递归
    for (let key in target) {  // {e: 2, f: 3}  'd'
      let newKey;

      if (oldKey) {
        if (Array.isArray(target)) {
          newKey = `${oldKey}[${key}]`
        } else {
          newKey = `${oldKey}.${key}`
        }
      } else {
        newKey = key
      }

      if (typeof target[key] === 'object' && target[key] !== null) {
        dfs(target[key], newKey)
      } else {
        res[newKey] = target[key]
      }
    }
  }
  dfs(obj, '')

  return res
}


console.log(flattenObj(obj))


