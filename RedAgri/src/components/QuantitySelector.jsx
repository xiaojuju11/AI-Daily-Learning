import React from 'react';

const QuantitySelector = ({ value, onIncrease, onDecrease, onReset, disabled }) => {
  return (
    <div className="quantity-selector">
      <button 
        className="quantity-btn" 
        onClick={onDecrease}
        disabled={value <= 1 || disabled}
      >
        -
      </button>
      <span className="quantity-value">{value}</span>
      <button 
        className="quantity-btn" 
        onClick={onIncrease}
        disabled={disabled}
      >
        +
      </button>
      <button 
        className="reset-btn" 
        onClick={onReset}
        disabled={disabled}
      >
        重置
      </button>
    </div>
  );
};

export default QuantitySelector;