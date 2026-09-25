function ajax(time, name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (time > 5000) {
        reject(name)
      }
      resolve(name)
    }, time)
  })
}

// ajax(10000)
// ajax(8000)
// ajax(1000)
// ajax(3000)
// ajax(2000)


class Scheduler {
  constructor(parallCount = 2) {
    this.parallCount = parallCount
    this.tasks = []  // 存放所有的任务的一个队列
    this.runningCount = 0  // 正在运行的任务数量
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({
        task,
        resolve,
        reject
      })
      this.#run()
    })
  }

  #run() {
    if (this.runningCount < this.parallCount && this.tasks.length) {  // 当前正在执行的任务数是否 < 最大并发量
      const {task, resolve, reject} = this.tasks.shift()
      this.runningCount++
      task().then(resolve, reject).finally(() => {
        this.runningCount--
        this.#run()
      })
    }
  }

}

const scheduler = new Scheduler()
function addTask(time, name) {
  scheduler
    .add(() => ajax(time, name))     // add promise状态要跟被它添加进去的那个任务的promise的状态同步
    .then(() => {  
      console.log(`任务${name}完成`);
    })
    .catch(() => {
      console.log(`任务${name}失败`);
    })
}
addTask(10000, 1)
addTask(8000, 2)
addTask(1000, 3)
addTask(3000, 4)
addTask(3000, 5)