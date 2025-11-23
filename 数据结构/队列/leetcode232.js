var MyQueue = function () {
  this.stack1 = []
  this.stack2 = []
};

MyQueue.prototype.push = function (x) {
  this.stack1.push(x)
};

MyQueue.prototype.pop = function () {
  // 栈 1 倒到栈 2，再从栈 2 取值
  if (this.stack2.length == 0) {
    while(this.stack1.length > 0) {
      const top = this.stack1.pop()
      this.stack2.push(top)
    }
  }
  
  return this.stack2.pop()
};

MyQueue.prototype.peek = function () {
  if (this.stack2.length == 0) {
    while(this.stack1.length > 0) {
      const top = this.stack1.pop()
      this.stack2.push(top)
    }
  }
  return this.stack2[this.stack2.length - 1]
};

MyQueue.prototype.empty = function () {
  return !this.stack1.length && !this.stack2.length
};

const myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)

// console.log(myQueue.peek());
console.log(myQueue.pop());
console.log(myQueue.pop());





// const stack = []  // push pop