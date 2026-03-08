import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Accounting.css';

const Accounting = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, category: '种苗', amount: 0 },
    { id: 2, category: '化肥', amount: 0 },
    { id: 3, category: '人工', amount: 0 }
  ]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // 计算总成本
  useEffect(() => {
    const sum = expenses.reduce((acc, item) => acc + item.amount, 0);
    setTotal(sum);
  }, [expenses]);

  // 处理金额变化
  const handleAmountChange = (id, value) => {
    const updatedExpenses = expenses.map(item => 
      item.id === id ? { ...item, amount: parseFloat(value) || 0 } : item
    );
    setExpenses(updatedExpenses);
  };

  // 处理留言提交
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <div className="accounting">
      <Header />
      
      <div className="accounting-content">
        <h2 className="page-title">财务台账</h2>
        
        {/* 支出表格 */}
        <div className="expense-section">
          <h3 className="section-title">农户支出</h3>
          <div className="expense-table">
            <div className="table-header">
              <div className="table-cell category">支出项</div>
              <div className="table-cell amount">金额（元）</div>
            </div>
            {expenses.map((item) => (
              <div className="table-row" key={item.id}>
                <div className="table-cell category">{item.category}</div>
                <div className="table-cell amount">
                  <input 
                    type="number" 
                    value={item.amount || ''}
                    onChange={(e) => handleAmountChange(item.id, e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
            <div className="table-row total">
              <div className="table-cell category">总成本</div>
              <div className="table-cell amount total-amount">¥{total.toFixed(2)}</div>
            </div>
          </div>
        </div>
        
        {/* 志愿者留言区 */}
        <div className="message-section">
          <h3 className="section-title">志愿者留言区</h3>
          <form onSubmit={handleMessageSubmit} className="message-form">
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="请输入留言..."
              rows={4}
            />
            <button type="submit" className="submit-btn">提交留言</button>
          </form>
          <div className="message-list">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div className="message-item" key={index}>
                  <p>{msg}</p>
                </div>
              ))
            ) : (
              <p className="no-message">暂无留言</p>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Accounting;