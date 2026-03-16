import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 模拟登录
  const login = (role) => {
    const fakeUsers = {
      volunteer: { id: 1, name: '志愿者', role: 'volunteer' },
      farmer: { id: 2, name: '农户', role: 'farmer' },
      consumer: { id: 3, name: '消费者', role: 'consumer' }
    };
    const user = fakeUsers[role];
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // 登出
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 初始化用户
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 添加到购物车
  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // 更新购物车商品数量
  const updateCartItemQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // 从购物车删除商品
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
  };

  // 计算购物车总价
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 计算购物车总补贴
  const getTotalSubsidy = () => {
    return cartItems.reduce((total, item) => total + (item.subsidy * item.quantity), 0);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        products,
        setProducts,
        cartItems,
        setCartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalSubsidy,
        loading,
        setLoading,
        error,
        setError
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
