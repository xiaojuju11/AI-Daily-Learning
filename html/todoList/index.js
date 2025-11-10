// 点击按钮时获取到用户输入的内容
// 1。给按钮绑定一个点击事件   // 获取到按钮
// 读取文本框内容   // 获取到本文框

const form = document.querySelector('.form')
const input = document.getElementById('todo')
const ul = document.querySelector('.todo-list')

const todoListArray = []

form.addEventListener('submit', function(e) {
  e.preventDefault() //阻止表单的默认行为

  let todoItem = input.value  // 用户输入的内容

  // 生成一个唯一的标记
  let itemId = String(new Date())

  // 多希望有一个函数，只要调用它，就可以帮我把数据存进数组
  addItemToArray(itemId, todoItem)
  // 多希望有一个函数，数组每次变更时，将数组中的数据展示在页面上
  addItemToDom(itemId, todoItem)
})


function addItemToArray(id, item) {
  todoListArray.push({
    itemId: id,
    todoItem: item
  })
}

function addItemToDom(id, item) {
  const li = document.createElement('li')
  li.textContent = item
  li.setAttribute('data-id', id)
  ul.appendChild(li)
}

// 移除
ul.addEventListener('click', function(e) {
  console.log(e.target); // 获取到点击了哪一个li
  // 读取它身上的 data-id 得到唯一标记
  // 根据这个标记，移除数组中的元素
  // 从页面上删除对应的 li
  // 确保点击的是li元素
  if (e.target.tagName === 'LI') {
    // 1. 获取点击元素的data-id
    const itemId = e.target.getAttribute('data-id');
    
    // 2. 从数组中移除对应的元素
    const index = todoListArray.findIndex(item => item.itemId === itemId);
    if (index !== -1) {
      todoListArray.splice(index, 1);
    }
    
    // 3. 从页面上删除对应的li元素
    e.target.remove();
  }
})