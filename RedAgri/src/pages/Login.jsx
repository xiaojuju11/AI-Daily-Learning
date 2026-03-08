import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer');
  const navigate = useNavigate();

  // 模拟数据库中的用户数据
  const fakeUsers = [
    { phone: '13800138000', password: '123456', role: 'consumer' },
    { phone: '13900139000', password: '123456', role: 'farmer' },
    { phone: '13700137000', password: '123456', role: 'volunteer' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    // 模拟登录验证
    const user = fakeUsers.find(
      u => u.phone === phone && u.password === password && u.role === role
    );
    
    if (user) {
      // 保存角色权限至本地
      localStorage.setItem('userRole', role);
      // 跳转首页
      navigate('/');
    } else {
      // 登录失败提示
      alert('手机号、密码或角色不匹配，请检查后重试');
    }
  };

  return (
    <div className="login">
      <Header />
      
      <div className="login-content">
        <h2 className="page-title">登录</h2>
        
        <div className="test-account">
          <h3>测试账号</h3>
          <p>消费者：13800138000 / 123456</p>
          <p>农户：13900139000 / 123456</p>
          <p>志愿者：13700137000 / 123456</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="phone">手机号</label>
            <input 
              type="tel" 
              id="phone" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div className="form-group role-selection">
            <label>角色选择</label>
            <div className="role-options">
              <div className="role-option">
                <input 
                  type="radio" 
                  id="consumer" 
                  name="role" 
                  value="consumer"
                  checked={role === 'consumer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="consumer">消费者</label>
              </div>
              <div className="role-option">
                <input 
                  type="radio" 
                  id="farmer" 
                  name="role" 
                  value="farmer"
                  checked={role === 'farmer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="farmer">农户</label>
              </div>
              <div className="role-option">
                <input 
                  type="radio" 
                  id="volunteer" 
                  name="role" 
                  value="volunteer"
                  checked={role === 'volunteer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <label htmlFor="volunteer">志愿者</label>
              </div>
            </div>
          </div>
          
          <button type="submit" className="login-btn">登录</button>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;