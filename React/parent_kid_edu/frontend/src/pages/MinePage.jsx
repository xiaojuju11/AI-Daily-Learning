import '../styles/minePage.less'
import { Card, List } from 'antd-mobile'
import React from 'react'



export default function MinePage() {
  return (
    <div className="mine-page-root">
      <header className="mine-page-header">
        <div className="user-info">
          <div className="user-avatar">
            <i className="iconfont icon-zhanghao"></i>
          </div>
          <div className="user-details">
            <h2>用户昵称</h2>
            <p>亲子教育AI助手</p>
          </div>
        </div>
      </header>
      <div className="mine-page-content">
         <Card title='我的内容' headerStyle={{ height: '60px' }} className='mine-page-card'>
          <List>
            <List.Item prefix={<i className="iconfont icon-shoucang"></i>} onClick={() => { }}>我的收藏</List.Item>
            <List.Item prefix={<i className="iconfont icon-liulanlishi"></i>} onClick={() => { }}>浏览历史</List.Item>
          </List>
        </Card>

        <Card title='设置' headerStyle={{ height: '60px' }} className='mine-page-card'>
          <List>
            <List.Item prefix={<i className="iconfont icon-shezhi"></i>} onClick={() => {  }}>账号设置</List.Item>
            <List.Item prefix={<i className="iconfont icon-tongzhi"></i>} onClick={() => { }}>通知设置</List.Item>
            <List.Item prefix={<i className="iconfont icon-bangzhuzhongxin"></i>} onClick={() => { }}>帮助中心</List.Item>
            <List.Item prefix={<i className="iconfont icon-tuichudenglu"></i>} onClick={() => { }}>退出登录</List.Item>
          </List>
        </Card>

      </div>
    </div>
  )
}