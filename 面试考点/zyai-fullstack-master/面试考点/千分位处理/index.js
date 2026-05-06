const num = 1654312342132.423112
// 121,654,312,342,132.42 

function toThousand(num) {
  num = num.toFixed(2)
  const [integer, decimal] = String.prototype.split.call(num, '.')
  const res = []
  let len = 0
  
  for (let i = integer.length - 1; i >= 0; i--) {
    res.unshift(integer[i])
    len++
    if (len % 3 === 0 && i !== 0) {
      res.unshift(',')
    }
  }

  const str = res.join('') + '.' + decimal
  
  return str
  
}

console.log(toThousand(num));
