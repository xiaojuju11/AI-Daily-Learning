// 创建所有跟账号有关的接口
const Router = require('koa-router')
const { login, getCaptcha } = require('../controllers/authController.js')  // {login: fn}

const router = new Router({
  prefix: '/api/auth'
})

// 定义登录接口
router.post('/login', login)
//定义一个验证码接口
router.get('/captcha',getCaptcha )


module.exports = router