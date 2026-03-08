import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Traceability.css';

const Traceability = () => {
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState('story');

  const handleViewResult = () => {
    setShowResult(true);
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
        ) : (
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
                  <h3>红色故事</h3>
                  <p>在革命老区，有一位老党员王大爷，他始终坚持用传统方法种植有机大米。通过红银兴农平台，他的大米不仅卖出了好价钱，还带动了周边农户共同致富。每一粒大米都承载着红色基因和对美好生活的向往。</p>
                  <img 
                    src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20revolutionary%20story%20with%20farmer%20and%20rice%20field&image_size=portrait_4_3" 
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
                      <span>王建国</span>
                    </div>
                    <div className="info-item">
                      <label>地址：</label>
                      <span>革命老区红安县</span>
                    </div>
                    <div className="info-item">
                      <label>种植面积：</label>
                      <span>10亩</span>
                    </div>
                    <div className="info-item">
                      <label>种植年限：</label>
                      <span>20年</span>
                    </div>
                    <div className="info-item">
                      <label>联系方式：</label>
                      <span>138****1234</span>
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
                      <span className="flow-value">¥50.00</span>
                    </div>
                    <div className="flow-item">
                      <span className="flow-label">农户收入：</span>
                      <span className="flow-value">¥35.00 (70%)</span>
                    </div>
                    <div className="flow-item">
                      <span className="flow-label">平台运营：</span>
                      <span className="flow-value">¥5.00 (10%)</span>
                    </div>
                    <div className="flow-item">
                      <span className="flow-label">公益基金：</span>
                      <span className="flow-value">¥10.00 (20%)</span>
                    </div>
                  </div>
                  <p className="fund-note">公益基金将用于支持当地教育和基础设施建设。</p>
                </div>
              )}
            </div>
            
            <button className="back-btn" onClick={() => setShowResult(false)}>
              返回
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Traceability;