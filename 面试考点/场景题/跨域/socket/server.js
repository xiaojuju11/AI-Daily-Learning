const WebSocket = require('ws')
const ws = new WebSocket.Server({ port: 3000 })

ws.on('connection', (socket) => {
  console.log('有客户端连接')

  socket.on('message', (message) => {
    console.log('收到客户端的消息:', message.toString())  // message + ''
  })

  // setTimeout(() => {
  //   socket.send('hello world')
  // }, 5000)
  

  setInterval(() => {
    socket.send(JSON.stringify({count: Date.now()}))
  }, 2000)
  
})
