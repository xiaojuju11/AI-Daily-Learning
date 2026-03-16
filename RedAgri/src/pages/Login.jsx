import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import './Login.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 调用API登录
      const response = await api.login(role);
      if (response.success) {
        // 使用context登录
        login(role);
        // 跳转首页
        navigate('/');
      } else {
        setError('登录失败：' + response.error);
        alert('登录失败：' + response.error);
      }
    } catch (err) {
      setError('登录失败：' + err.message);
      alert('登录失败：' + err.message);
    } finally {
      setLoading(false);
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