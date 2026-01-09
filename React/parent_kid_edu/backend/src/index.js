const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser')
const authRoutes = require('./routes/authRoutes.js')

const app = new Koa()
app.use(cors({//处理跨域
  origin() {
    return 'http://localhost:5173'
  },
}));

// 测试接口
const router = new Router({
  prefix: '/api'  // 路由前缀
})
router.get('/test', (ctx) => {
  ctx.body = {
    status: 'ok',
    mesaage: 'Koa backend is running'
  }
})

app
  .use(bodyParser())  // 先让 koa 拥有解析参数的能力
  .use(router.routes(), router.allowedMethods())
  .use(authRoutes.routes(), authRoutes.allowedMethods())

  

app.listen(3000, () => {
  console.log('服务运行在 3000 端口');
})