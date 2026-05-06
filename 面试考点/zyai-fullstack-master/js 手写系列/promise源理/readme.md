# then
1. 默认返回一个 promise 对象，它的状态跟随 then 前面的那个 promise 的状态一起变更
2. then的回调中返回了一个promise 对象，那么then 中的promise的状态就会跟随自身回调返回的那个promise 对象的状态变更