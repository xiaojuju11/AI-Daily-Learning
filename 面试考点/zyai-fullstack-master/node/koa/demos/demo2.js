const Koa = require('koa')
const app = new Koa()

const main = (ctx) => {
  // ctx.response.type = 'text'
  // ctx.response.type = 'html'
  // ctx.body = '<h2>Hello World</h2>'

  ctx.response.type = 'json'
  ctx.body = "{data: hello}"
}

app.use(main)
app.listen(3000)