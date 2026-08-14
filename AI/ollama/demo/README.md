# ollama 本地部署
ollama 是一个将大模型运行需要的环境全部安装好了的一个容器

# 流式输出
ollama 支持流式输出，即在运行模型时，模型会将输出分块发送给客户端，客户端可以实时显示输出。
 1. 前端解码流式资源
 2. SSE（Server-Sent Events），正常情况下无法在前端直接使用，SSE只能支持HTTP GET方式，不能发送自定义的Header，而多数情况下我们在调用LLM都是需要配置请求头的，而且必须使用POST
  - BFF层来处理（node）

# npm i express
装一个后端的框架express
相当于react是前端的框架，express是后端的框架

# esmoudle 和 commonjs 的区别
esmoudle 是es6的模块，commonjs 是node的模块
使用esmoudle 可以在模块中使用import 导入其他模块
使用commonjs 可以在模块中使用require 导入其他模块
1. esmoudle 中使用import 导入模块
import express from 'express';

const app = express();

app.get('/stream', (req, res) => {
  res.send('Hello');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


//使用export default 导出模块:
export default app;

2. commonjs 中使用require 导入模块
const http = require('http');
const server = http.createServer((req, res) => {
   res.end('Hello, World!');
});

server.listen(3000, () => {
   console.log('Server is running on port 3000');
});

使用导出模块
module.exports = app;