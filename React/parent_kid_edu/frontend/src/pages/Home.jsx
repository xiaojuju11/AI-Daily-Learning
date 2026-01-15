import React from 'react'
import '../styles/home.less'

export default function Home() {
  return (
   <div className="home-root">
     <header className="home-hero">
        <div>
          <p className="home-hero__eyebrow">亲子教育 · 科学陪伴</p>
          <h1>和孩子一起探索更大的世界</h1>
          <p className="home-hero__sub">
            AI + 内容，拍照识物、学单词、听诗词、做实验，陪伴每个好奇瞬间
          </p>
          <div className="home-hero__actions">
            <button className='home-btn home-btn--primary'>开始探索</button>
          </div>
        </div>
        <div className="home-hero__bubble">
          <span>AI 讲解</span>
          <span>口语跟读</span>
          <span>安全提示</span>
          <span>朗读诗词</span>
          <span>亲子任务</span>
        </div>
      </header>
   </div>
  )
}
