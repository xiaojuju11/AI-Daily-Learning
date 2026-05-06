const http = require('http')

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  res.end(JSON.stringify({
    name: '张三',
    age: 18
  }))

})

server.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
})