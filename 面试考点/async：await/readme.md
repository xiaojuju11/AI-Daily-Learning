# 回调
回调地狱：回调的函数嵌套过深，导致代码结构混乱，维护困难，排查困难

# Promise
Promise 是一个异步操作的结果容器，它代表了一个异步操作的最终完成（成功或失败）以及其结果值。.then() 方法用于处理 Promise 成功的情况，.catch() 方法用于处理 Promise 失败的情况。

# generator
generator 是一种特殊的迭代函数，它可以在执行过程中暂停和恢复执行，从而实现异步操作的编写。
function* 生成器函数调用后，返回的是生成器对象
函数体不会自动执行，必须调用 .next() 才会一步步执行
yield = 暂停
return = 最终值 + 结束

# async/await
async/await 是 ES8 引入的异步编程语法，它使异步操作的编写和阅读更加简单。

- async原理:在函数前添加 async 关键字，函数就会变成一个 Promise 对象。
- await原理:借助了generator函数可以yield暂停这一特点，靠递归调用的方式不断执行generator函数所里带来的迭代器上的next方法。实现异步的控制。

async/await = generator +.then()