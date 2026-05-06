// let s = new Set()
// s.add(1)
// s.add(2)
// s.add(1)

// console.log([...s]);



// // const arr = [1, 2, 3]
// // const arr2 = [...arr]


// const arr = [1, 2, 3, 2, '1']
// const str = 'abcba'

// let arr2 = [...new Set(arr)]
// console.log(arr2);



// let s = new Set([1, 2, 3, 4, 5])
// Array.from(s).map((item) => {
//   console.log(item);
// })


let s = new Set([1, 2, 3, 4, 5])
// console.log(s.size);
s.add('hello')
s.add(function(){})
s.add([])
s.delete(2)

// console.log(s.has([]));

s.clear()
console.log(s);


