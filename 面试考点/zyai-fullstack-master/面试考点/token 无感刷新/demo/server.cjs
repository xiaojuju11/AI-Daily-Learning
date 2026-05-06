const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());  // 解析请求体为 JSON 格式

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next()
})

let accessToken = null;  // 访问令牌
let refreshToken = null;  // 刷新令牌
const ACCESS_TOKEN_EXPIRE_TIME = 10;  // 访问令牌过期时间，单位毫秒
const REFRESH_TOKEN_EXPIRE_TIME = 30;  // 刷新令牌过期时间，单位毫秒

// 生成访问令牌
function getAccessToken() {
  return jwt.sign({ userId: 1, name: '张三', date: new Date().toISOString() + 'Z' }, '666', { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
}

// 生成刷新令牌
function getRefreshToken() {
  return jwt.sign({ id: 0, date: new Date().toISOString() + 'Z' }, '777', { expiresIn: REFRESH_TOKEN_EXPIRE_TIME });
}



app.post('/login', (req, res) => {
  res.json({
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    message: '登录成功'
  })
})

app.get('/home', (req, res) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).json({ message: '未授权' });
  }
  try {
    const decoded = jwt.verify(accessToken, '666');
    if (decoded.userId !== 1) {
      return res.status(403).json({ message: '权限不足' });
    }
    res.json({
      message: '欢迎来到首页'
    })

  } catch (error) {
    return res.status(401).json({ message: '访问令牌失效' });
  }
})

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  try {
    const decoded = jwt.verify(refreshToken, '777');
    res.json({
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken(),
      message: '刷新令牌成功'
    })
  } catch (error) {
    return res.status(403).json({ message: '刷新令牌失效' });
  }
})



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
