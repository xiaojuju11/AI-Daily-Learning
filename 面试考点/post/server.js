// 1. 引入内置模块（不用安装任何依赖！）
const http = require('http');

// 2. 创建服务
const server = http.createServer((req, res) => {
  // 解决跨域（必须写）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // 3. 只处理 /api/hello 这个请求
  if (req.url === '/api/hello' && req.method === 'GET') {
    console.log('✅ 前端发请求过来了！');

    // 4. 后端响应：返回数据给前端
    res.end(
      JSON.stringify({
        code: 200,
        message: '我是后端，我收到你的请求了！',
        data: 'hello world'
      })
    );
  }
});

// 5. 启动服务，端口 3000
server.listen(3000, () => {
  console.log('后端服务已启动：http://localhost:3000');
});