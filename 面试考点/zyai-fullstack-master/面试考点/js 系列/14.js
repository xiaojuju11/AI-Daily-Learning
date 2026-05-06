// function add(a, b) {
//   return a + b
// }

// add(1, 2)

// const addCurry = curry(add)
// addCurry(1)(2)


function ajax(type, url, data) {
  const xhr = new XMLHttpRequest()
  xhr.open(type, url, true)
  xhr.send(data)
}

// ajax('post', 'www.test.com', 'name=张三')
// ajax('post', 'www.test.com', 'name=李四')
// ajax('post', 'www.test.com', 'name=王五')

const ajaxCurry = curry(ajax)
const post = ajaxCurry('post')
const postTest = post('www.test.com')
postTest('name=张三')
postTest('name=李四')
postTest('name=王五')