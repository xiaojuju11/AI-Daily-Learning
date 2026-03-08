import React from 'react';
import './TraceabilityCenter.css';
import strawberrySrc from '../assets/strawberry.png';
import youziSrc from '../assets/youzi.png';
import orangeSrc from '../assets/orange.jpg';
import vegetableSrc from '../assets/vegetable.png';
import tomatoSrc from '../assets/tomato.png';
import fruitSrc from '../assets/fruit.png';



const TraceabilityCenter = () => {
  return (
    <div className="traceability-center">
      <h2 className="traceability-title">全程溯源，让您吃得安心放心</h2>
      <div className="traceability-circle">
        <div className="traceability-center-icon">
          <div className="qr-icon">
            <div className="qr-code"></div>
          </div>
        </div>
        <div className="traceability-items">
          <div className="traceability-item">
            <div className="item-image">
              <img src={strawberrySrc} alt="草莓" />
            </div>
          </div>
          <div className="traceability-item">
            <div className="item-image">
              <img src={youziSrc} alt="红心柚子" />
            </div>
          </div>
          <div className="traceability-item">
            <div className="item-image">
              <img src={orangeSrc} alt="脐橙" />
            </div>
          </div>
          <div className="traceability-item">
            <div className="item-image">
              <img src={vegetableSrc} alt="蔬菜" />
            </div>
          </div>
          <div className="traceability-item">
            <div className="item-image">
              <img src={tomatoSrc} alt="西红柿" />
            </div>
          </div>
          <div className="traceability-item">
            <div className="item-image">
              <img src={fruitSrc} alt="水果" />
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraceabilityCenter;