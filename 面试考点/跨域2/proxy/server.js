const http = require('http')

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  http.request({
    hostname: '192.168.31.221',
    port: 3000,
    path: '/',
    method: 'GET'
  }, (response) => {
    response.on('data', (chunk) => {
      // console.log(chunk.toString());
      res.end(chunk.toString())
    })
  }).end()

})

server.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
})