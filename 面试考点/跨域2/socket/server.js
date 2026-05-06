const websocket = require('ws')

const ws = new websocket.Server({port: 3000})

let count = 0

ws.on('connection', (socket) => {  // 连接
  console.log('跟客户端连接成功');

  socket.on('message', (data) => {  // 接收客户端数据
    console.log('客户端发送数据', data.toString());

    setInterval(() => {
      socket.send(JSON.stringify({count: count++}))
    }, 2000)

  })

})