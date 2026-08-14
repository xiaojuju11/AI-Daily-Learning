/* ==========================================
   CORS 代理服务器 — 备选方案
   如果浏览器直接调用硅基流动 API 被 CORS 拦截，
   启动此代理：node proxy.js
   并将 app.js 中 API_ENDPOINT 改为:
   http://localhost:3001/api/chat
   ========================================== */

const http = require('http');

const PORT = 3001;
const TARGET = 'https://api.siliconflow.cn/v1/chat/completions';

const server = http.createServer(async (req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    try {
      const body = await readBody(req);

      const response = await fetch(TARGET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers['authorization'] || '',
        },
        body,
      });

      res.writeHead(response.status, {
        'Content-Type': response.headers.get('content-type') || 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });

      // 流式转发
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (err) {
      res.writeHead(502);
      res.end(JSON.stringify({ error: { message: `代理错误: ${err.message}` } }));
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

server.listen(PORT, () => {
  console.log(`✅ CORS 代理已启动: http://localhost:${PORT}/api/chat`);
  console.log(`   转发到: ${TARGET}`);
});
