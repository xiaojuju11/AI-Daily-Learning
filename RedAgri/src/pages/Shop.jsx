import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Shop.css';
import strawberrySrc from '../assets/strawberry.png';
import youziSrc from '../assets/youzi.png';
import orangeSrc from '../assets/orange.jpg';

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);

  // 模拟产品数据
  const products = [
    {
      id: 1,
      name: '有机草莓',
      price: 68,
      公益说明: '每购买一盒草莓，将为老区果农提供8元的生产补贴',
      image: strawberrySrc,
      规格: '500g/盒',
      详细描述: '来自革命老区的有机草莓，采用绿色种植方法，不使用化肥和农药，果实饱满，口感鲜美。'
    },
    {
      id: 2,
      name: '红心柚子',
      price: 45,
      公益说明: '每购买一个柚子，将为山区柚农提供5元的生产补贴',
      image: youziSrc,
      规格: '2.5kg/个',
      详细描述: '来自深山的红心柚子，果肉饱满，口感清甜多汁，营养丰富。'
    },
    {
      id: 3,
      name: '赣南脐橙',
      price: 58,
      公益说明: '每购买一箱脐橙，将为当地果农提供10元的生活补贴',
      image: orangeSrc,
      规格: '5kg/箱',
      详细描述: '来自赣南老区的脐橙，果实饱满，果皮薄，果肉细嫩多汁，口感清甜。'
    }
  ];

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    setShowCart(true);
    setTimeout(() => {
      setShowCart(false);
    }, 2000);
  };

  return (
    <div className="shop">
      <Header />
      
      <div className="shop-content">
        <h2 className="page-title">助农商城</h2>
        
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
                      onClick={handleAddToCart}
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
      </div>
      
      {showCart && (
        <div className="cart-notification">
          <p>已加入购物车（功能后续迭代）</p>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Shop;