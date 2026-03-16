import React from 'react';
import './ShoppingCart.css';

const ShoppingCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  // 计算总价
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // 计算总补贴
  const totalSubsidy = cartItems.reduce((total, item) => {
    return total + (item.subsidy * item.quantity);
  }, 0);

  return (
    <div className="shopping-cart">
      <h3 className="cart-title">购物车</h3>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>购物车为空</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.name}</h4>
                  <p className="cart-item-price">¥{item.price}</p>
                  <p className="cart-item-subsidy">补贴：¥{item.subsidy} × {item.quantity} = ¥{item.subsidy * item.quantity}</p>
                </div>
                <div className="cart-item-quantity">
                  <button 
                    className="quantity-btn" 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn" 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => onRemoveItem(item.id)}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span className="total-label">总计：</span>
            <span className="total-price">¥{totalPrice.toFixed(2)}</span>
          </div>
          <div className="cart-subsidy">
            <span className="subsidy-label">总补贴：</span>
            <span className="subsidy-value">¥{totalSubsidy.toFixed(2)}</span>
          </div>
          <p className="subsidy-note">您的购买将为老区农户提供总计 ¥{totalSubsidy.toFixed(2)} 的补贴</p>
          <button className="checkout-btn" onClick={onCheckout}>
            结算
          </button>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;