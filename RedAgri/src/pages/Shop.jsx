import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ShoppingCart from '../components/ShoppingCart';
import QuantitySelector from '../components/QuantitySelector';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import './Shop.css';

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { 
    products, 
    setProducts, 
    cartItems, 
    addToCart, 
    updateCartItemQuantity, 
    removeFromCart, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useAppContext();

  // 加载产品数据
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await api.getProducts();
        if (response.success) {
          setProducts(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('加载产品失败');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [setProducts, setLoading, setError]);

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
  };

  // 处理添加到购物车
  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
      
      // 显示添加成功通知
      const notification = document.createElement('div');
      notification.className = 'cart-notification';
      notification.textContent = '已加入购物车';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
      
      // 重置数量
      setQuantity(1);
    }
  };

  // 处理数量增加
  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // 处理数量减少
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // 重置数量
  const handleReset = () => {
    setQuantity(1);
  };

  // 处理结算
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      const orderData = {
        items: cartItems,
        totalPrice: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
        totalSubsidy: cartItems.reduce((total, item) => total + (item.subsidy * item.quantity), 0),
        orderTime: new Date().toISOString()
      };
      
      const response = await api.submitOrder(orderData);
      if (response.success) {
        alert(`订单提交成功！订单号：${response.data.orderId}`);
      } else {
        alert('订单提交失败：' + response.error);
      }
    } catch (err) {
      alert('订单提交失败：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop">
      <Header />
      
      <div className="shop-content">
        <div className="shop-header">
          <h2 className="page-title">助农商城</h2>
          <button 
            className="cart-toggle-btn" 
            onClick={() => setShowCart(!showCart)}
          >
            购物车 ({cartItems.length})
          </button>
        </div>
        
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : showCart ? (
          <ShoppingCart 
            cartItems={cartItems}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={handleCheckout}
          />
        ) : (
          <> 
            {!selectedProduct ? (
              <div className="product-list">
                {products.map((product) => (
                  <div className="product-item" key={product.id}>
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      <div className="product-tag">红色IP</div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">¥{product.price}</p>
                      <p className="product-desc">{product.公益说明}</p>
                      <div className="product-actions">
                        <button 
                          className="detail-btn" 
                          onClick={() => handleViewDetail(product)}
                        >
                          详情
                        </button>
                        <button 
                          className="cart-btn" 
                          onClick={() => {
                            setSelectedProduct(product);
                          }}
                        >
                          加入购物车
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="product-detail">
                <button className="back-btn" onClick={() => setSelectedProduct(null)}>
                  返回列表
                </button>
                <div className="detail-content">
                  <div className="detail-image">
                    <img src={selectedProduct.image} alt={selectedProduct.name} />
                  </div>
                  <div className="detail-info">
                    <h3 className="detail-name">{selectedProduct.name}</h3>
                    <p className="detail-price">¥{selectedProduct.price}</p>
                    <p className="detail-spec">规格：{selectedProduct.规格}</p>
                    <p className="detail-desc">{selectedProduct.详细描述}</p>
                    <p className="detail-public">{selectedProduct.公益说明}</p>
                    
                    {/* 数量选择器 */}
                    <QuantitySelector 
                      value={quantity}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onReset={handleReset}
                    />
                    
                    {/* 补贴计算 */}
                    <div className="subsidy-calculation">
                      <h4>补贴计算</h4>
                      <p>购买数量：{quantity} {selectedProduct.规格}</p>
                      <p>总补贴金额：<span className="subsidy-amount">¥{selectedProduct.subsidy * quantity}</span></p>
                      <p className="subsidy-note">您的购买将为老区农户提供<span className="subsidy-highlight">¥{selectedProduct.subsidy * quantity}</span>的生产补贴</p>
                    </div>
                    
                    <button 
                      className="cart-btn" 
                      onClick={handleAddToCart}
                    >
                      加入购物车
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Shop;