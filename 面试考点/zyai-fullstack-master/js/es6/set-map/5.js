let obj = {name: '诺克萨斯'}  // 
// obj = null


//100 xxxx
let ws = new WeakSet()  //即垃圾回收机制不考虑 WeakSet 对该对象的引用 
ws.add(obj)
obj = null
console.log(ws);



