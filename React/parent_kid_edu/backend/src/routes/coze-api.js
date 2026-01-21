const Router = require('koa-router')
const { recognition } = require('../controllers/cozeController.js')


const router = new Router({
    prefix: '/coze-api',
})

//ai识物
router.post('/recognition',recognition)

module.exports = router