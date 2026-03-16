import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TraceabilityCenter from '../components/TraceabilityCenter';
import { api } from '../services/api';
import './Home.css';
import imageSrc from '../assets/youzi.png'

const Home = () => {
  const [achievements, setAchievements] = useState({
    totalSales: 0,
    farmerIncome: 0,
    volunteerHours: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载公益成果数据
  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      try {
        const response = await api.getAchievementData();
        if (response.success) {
          setAchievements(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('加载公益成果数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  // 格式化数字
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="home">
      <Header />
      
      {/* 轮播图 */}
      <div className="carousel">
        <div className="carousel-item active">
          <img src={imageSrc} alt="红色助农主题" />
          <div className="carousel-caption">
            <h2>红色金融助力乡村振兴</h2>
            <p>让每一份爱心都能精准帮扶</p>
          </div>
        </div>
      </div>
      
      {/* 三大功能入口 */}
      <div className="function-entrances">
        <div className="entrance-item">
          <Link to="/shop">
            <div className="entrance-icon">
              <span className="iconfont icon-_" style={{fontSize: '48px', color: '#C41E3A'}}></span>
            </div>
            <h3>助农商城</h3>
          </Link>
        </div>
        <div className="entrance-item">
          <Link to="/traceability">
            <div className="entrance-icon">
              <span className="iconfont icon-suyuanfenxi" style={{fontSize: '48px', color: '#2E7D32'}}></span>
            </div>
            <h3>溯源中心</h3>
          </Link>
        </div>
        <div className="entrance-item">
          <Link to="/accounting">
            <div className="entrance-icon">
              <span className="iconfont icon-renqunguanli" style={{fontSize: '48px', color: '#1976D2'}}></span>
            </div>
            <h3>财务台账</h3>
          </Link>
        </div>
      </div>
      
      {/* 全程溯源中心 */}
      <TraceabilityCenter />
      
      {/* 公益成果速览 */}
      <div className="achievement-section">
        <h2 className="section-title">公益成果速览</h2>
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="achievement-cards">
            <div className="achievement-card">
              <div className="achievement-number">¥{formatNumber(achievements.totalSales)}</div>
              <div className="achievement-label">总销售额</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">¥{formatNumber(achievements.farmerIncome)}</div>
              <div className="achievement-label">农户增收</div>
            </div>
            <div className="achievement-card">
              <div className="achievement-number">{formatNumber(achievements.volunteerHours)}</div>
              <div className="achievement-label">志愿时长(小时)</div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;