function xq() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('佳俊相亲成功');
      reject('没相中')  // 返回一个成功状态
    }, 3000)
  })
}

function marry() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('佳俊结婚了');
      reject('不愉快')
    }, 2000)
  })
}

function baby() {
  setTimeout(() => {
    console.log('小俊俊出生');
  }, 1000)
}

// 1. xq() 立即返回了一个 promise对象，状态为等待
// 2. 3 秒后xq()得到的promise对象 状态变为 成功
// 3. then 里面的回调函数才执行
// xq()
// .then(() => {  // then源码默认也返回了一个promise对象，状态继承前面的xq
//   return marry()  // return 让 then 返回的 promise 状态根据marry返回的 promise 状态而改变
// })
// .then(() => {
//   baby()
// })


xq()
.then(() => {  
  return marry() 
})
.then(() => {
  baby()
})
.catch((err) => {
  console.log('catch', err);
})

