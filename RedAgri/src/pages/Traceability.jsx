import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../services/api';
import './Traceability.css';

const Traceability = () => {
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [traceabilityData, setTraceabilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleViewResult = async () => {
    setLoading(true);
    try {
      const response = await api.getTraceabilityData();
      if (response.success) {
        setTraceabilityData(response.data);
        setShowResult(true);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('加载溯源数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="traceability">
      <Header />
      
      <div className="traceability-content">
        <h2 className="page-title">溯源中心</h2>
        
        {!showResult ? (
          <div className="qrcode-section">
            <div className="qrcode-container">
              <QRCodeSVG 
                value="https://red-agri.com/traceability/123456" 
                size={200} 
                level="H" 
              />
            </div>
            <p className="qrcode-desc">扫描二维码查看产品溯源信息</p>
            <button className="view-result-btn" onClick={handleViewResult}>
              查看溯源结果
            </button>
          </div>
        ) : loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : traceabilityData ? (
          <div className="result-section">
            <div className="result-tabs">
              <button 
                className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
                onClick={() => setActiveTab('story')}
              >
                红色故事
              </button>
              <button 
                className={`tab-btn ${activeTab === 'farmer' ? 'active' : ''}`}
                onClick={() => setActiveTab('farmer')}
              >
                农户信息
              </button>
              <button 
                className={`tab-btn ${activeTab === 'fund' ? 'active' : ''}`}
                onClick={() => setActiveTab('fund')}
              >
                资金流向
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'story' && (
                <div className="story-content">
                  <h3>{traceabilityData.story.title}</h3>
                  <p>{traceabilityData.story.content}</p>
                  <img 
                    src={traceabilityData.story.image} 
                    alt="红色故事" 
                    className="story-image"
                  />
                </div>
              )}
              
              {activeTab === 'farmer' && (
                <div className="farmer-content">
                  <h3>农户信息</h3>
                  <div className="farmer-info">
                    <div className="info-item">
                      <label>姓名：</label>
                      <span>{traceabilityData.farmer.name}</span>
                    </div>
                    <div className="info-item">
                      <label>地址：</label>
                      <span>{traceabilityData.farmer.address}</span>
                    </div>
                    <div className="info-item">
                      <label>种植面积：</label>
                      <span>{traceabilityData.farmer.plantingArea}</span>
                    </div>
                    <div className="info-item">
                      <label>种植年限：</label>
                      <span>{traceabilityData.farmer.plantingYears}</span>
                    </div>
                    <div className="info-item">
                      <label>联系方式：</label>
                      <span>{traceabilityData.farmer.contact}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'fund' && (
                <div className="fund-content">
                  <h3>资金流向</h3>
                  <div className="fund-flow">
                    <div className="flow-item">
                      <span className="flow-label">产品售价：</span>
                      <span className="flow-value">¥{traceabilityData.fund.productPrice.toFixed(2)}</span>
                    </div>
                    <div className="flow-item">
                      <span className="flow-label">农户收入：</span>
                      <span className="flow-value">¥{traceabilityData.fund.farmerIncome.toFixed(2)} ({traceabilityData.fund.farmerIncomePercentage}%)</span>
                    </div>
                    <div className="flow-item">
                      <span className="flow-label">平台运营：</span>
                      <span className="flow-value">¥{traceabilityData.fund.platformOperation.toFixed(2)} ({traceabilityData.fund.platformOperationPercentage}%)</span>
                    </div>
                    <div className="flow-item">
                      <span className="flow-label">公益基金：</span>
                      <span className="flow-value">¥{traceabilityData.fund.publicWelfareFund.toFixed(2)} ({traceabilityData.fund.publicWelfareFundPercentage}%)</span>
                    </div>
                  </div>
                  <p className="fund-note">{traceabilityData.fund.note}</p>
                </div>
              )}
            </div>
            
            <button className="back-btn" onClick={() => setShowResult(false)}>
              返回
            </button>
          </div>
        ) : (
          <div className="error">无溯源数据</div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Traceability;