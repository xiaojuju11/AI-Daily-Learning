import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-declaration">公益声明：红银兴农致力于通过红色金融助力农村发展，所有收益将用于支持农户生产和乡村振兴。</p>
        <div className="footer-partners">
          <p>合作方：红色金融协会 | 乡村振兴局 | 农业农村部</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;