const queue = []

queue.push('东北大板')
queue.push('巧乐兹')
queue.push('小布丁')
queue.push('七个小矮人')


// for (let i = 0; i < queue.length;) {
//   const item = queue.shift()
//   console.log(item);
// }

while(queue.length > 0) {
  const item = queue.shift()
  console.log(item);
}

