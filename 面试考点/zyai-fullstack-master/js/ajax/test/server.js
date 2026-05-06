const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');

  const username = req.url.split('?')[1].split('=')[1].split('&')[0];
  const password = req.url.split('&')[1].split('=')[1];

  if (!username || !password) {
    res.end('账号密码不能为空')
    return
  }

  console.log(`当前请求的账号是：${username}， 密码是：${password}`);

  res.end('请求成功');
  
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});