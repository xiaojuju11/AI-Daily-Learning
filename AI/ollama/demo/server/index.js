import express from 'express';

const app = express();

app.get('/stream', async (req, res) => {
    //解析前端传过来的参数
    const { question } = req.query;  //等价于 const question = req.query.question;
    if (!question) return res.send('请输入问题')

    //设置一个响应头
    res.setHeader('Content-Type', 'text/event-stream'); //为了告诉前端接下来给你的资源是event-stream格式
    res.setHeader('Cache-Control', 'no-cache'); //为了告诉前端不要缓存你的资源
    res.setHeader('Connection', 'keep-alive'); // 跟客户端持久连接
    res.flushHeaders(); //发送初始响应头

    //向ollama 发送请求
    const OLLAMA_API_URL = 'http://localhost:11434'
    const OLLAMA_MODEL = 'qwen3.5:0.8b'
    const endPoint = `${OLLAMA_API_URL}/api/generate`

    const response = await fetch(endPoint,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            model:OLLAMA_MODEL,
            prompt:question,
            stream:true,
        })
    })
    if (!response.ok) return res.send('请求失败')

    //解析流式资源
    const reader = response.body.getReader()//获取一个读取器，用于读取流式资源
    const decoder = new TextDecoder()//创建一个解码器，用于解码二进制数据为字符串
    let finish = false//用于判断是否读取到数据的结束

    while(!finish){//循环解释一个又一个的水滴
        const {value,done} = await reader.read()
        console.log(value)
    }
   
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//原生node的写法
// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.end('Hello, World!');
// });

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
// 以上代码是一个简单的http服务器，监听端口3000，当有请求到达时，返回Hello, World!