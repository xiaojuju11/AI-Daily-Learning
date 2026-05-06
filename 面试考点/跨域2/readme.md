# 同源策略
浏览器自带的一种安全机制，限制不同源之间的交互，防止恶意网站窃取数据。

https: //192.168.1.10 :8080 /home 
协议    域名/IP         端口     路径

https://www.baidu.com/

# 跨域解决方法
1. jsonp: 利用script标签的src属性可以跨域加载资源的特性，通过动态创建script标签来向后端请求。
 - 缺点： 
 1. 只能发送GET请求，不支持POST等其他请求方法。 
 2. 要求后端配合

2. cors: 后端设置响应头，允许指定的域名跨域访问。

3. node代理 (nginx): 利用nodejs的http模块，创建一个代理服务器，将前端请求转发到后端服务器，避免跨域问题。
vite: 利用vite的代理配置，实现前端请求的跨域转发。

```
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.31.221:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

4. websocket: 利用websocket协议，实现全双工通信，避免同源策略的限制。

5. postMessage: 利用html5的postMessage方法，实现不同窗口之间的通信。
 - 缺点： 1. 只能在支持html5的浏览器中使用

6. domain: 利用document.domain属性，将不同子域名之间的页面设置为相同的domain，实现跨域通信。(在谷歌浏览器中被禁用了)
 - 缺点： 1. 只能在不同子域名之间通信，不能跨域。


