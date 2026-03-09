import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 首页不显示返回按钮
  const showBackButton = location.pathname !== '/';
  
  // 检查登录状态
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!userRole;

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
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
            <span className="header-role">{userRole === 'consumer' ? '消费者' : userRole === 'farmer' ? '农户' : '志愿者'}</span>
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