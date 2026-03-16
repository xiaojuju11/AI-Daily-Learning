import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppContext();
  
  // 首页不显示返回按钮
  const showBackButton = location.pathname !== '/';
  
  // 检查登录状态
  const isLoggedIn = !!user;

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        {showBackButton && (
          <button className="header-back" onClick={handleBack}>
            ←
          </button>
        )}
        <h1 className="header-logo">银山弘农</h1>
        {isLoggedIn ? (
          <div className="header-user">
            <span className="header-role">{user.role === 'consumer' ? '消费者' : user.role === 'farmer' ? '农户' : '志愿者'}</span>
            <button className="header-logout" onClick={handleLogout}>
              退出
            </button>
          </div>
        ) : (
          <Link to="/login" className="header-login">登录</Link>
        )}
      </div>
    </header>
  );
};

export default Header;