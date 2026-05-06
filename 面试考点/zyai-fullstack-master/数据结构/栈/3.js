const stack = []

stack.push('可爱多')
stack.push('巧乐兹')
stack.push('东北大板')
stack.push('小布丁')
stack.push('老布丁')

// for (let i = 0; i < stack.length; i++) {
//   console.log(stack[i]);
// }

while(stack.length > 0) {
  // 摸着良心告诉自己，只能取栈顶的元素
  const top = stack.pop()
  console.log(top);
}