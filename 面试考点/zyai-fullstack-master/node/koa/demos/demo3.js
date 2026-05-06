const Koa = require('koa')
const app = new Koa()
const fs = require('fs')

const main = (ctx) => {
  ctx.response.type = 'html'
  ctx.body = fs.createReadStream('./three.html')
}

app.use(main)
app.listen(3000)