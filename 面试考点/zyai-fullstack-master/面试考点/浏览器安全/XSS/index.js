const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')

app.set('view engine', 'html')
app.engine('html', ejs.renderexpress)
app.set('views', path.join(__dirname))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'XSS攻击',
    xss: req.query.xss
  })
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
