import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import './styles/app.less'
import { useState } from 'react'
import Register from './pages/Register.jsx'

//登陆注册页面组件
const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('register')

  return (
    <div className="app-root">
      <div className="cartoon-bg"></div>
      <div className="auth-card">
        <div className="auth-card-wrapper">
          <div className="auth-header">
            <div className="auth-logo">logo</div>
            <h1 className="auth-title">亲子教育 · 成长伴侣</h1>
            <p className="auth-subtitle">专注 0-12岁亲子教育，陪伴孩子每一天</p>
          </div>

          <div className="slider-container">
            <div className={`slider-button ${activeTab === 'register' ? 'slider-button--right' : ''}`}></div>
            <div className="slider-tabs">
              <button className={`slider-tab ${activeTab === 'login' ? 'slider-tab--active' : ''}`} onClick={() => setActiveTab('login')}>登录</button>
              <button className={`slider-tab ${activeTab === 'register' ? 'slider-tab--active' : ''}`} onClick={() => setActiveTab('register')}>注册</button>
            </div>
          </div>


          {activeTab === 'login' ? (<Login />) : (<Register />)}

          <div className="social-login">
            <div className="divider">
              <div className="divider-line"></div>
              <div className="divider-text">第三方账号登录</div>
              <div className="divider-line"></div>
            </div>
            <div className="oauth-buttons">
              <button className="oauth-buttons--btn">
                <i className="iconfont icon-weixin"></i>
              </button>
              <button className="oauth-buttons--btn">
                <i className="iconfont icon-QQ"></i>
              </button>
              <button className="oauth-buttons--btn">
                <i className="iconfont icon-pingguo"></i>
              </button>
            </div>
          </div>

          <div className="auth-footnote">
            <p>注册即表示您同意<a href="#">《用户协议》</a>和<a href="#">《隐私政策》</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
