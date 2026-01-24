import '../styles/minePage.less'
import { Card, List, ActionSheet, Button, Dialog, Space, Toast } from 'antd-mobile'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MinePage() {
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
  const actions = [
    { text: '确认', key: 'confirm' },
  ]
  const handleLogout = () => {
    //弹框确认退出登录
    setVisible(true)
  }
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
            <List.Item prefix={<i className="iconfont icon-shezhi"></i>} onClick={() => { navigate('/accountSetting')}}>账号设置</List.Item>
            <List.Item prefix={<i className="iconfont icon-tongzhi"></i>} onClick={() => { }}>通知设置</List.Item>
            <List.Item prefix={<i className="iconfont icon-bangzhuzhongxin"></i>} onClick={() => { }}>帮助中心</List.Item>
            <List.Item prefix={<i className="iconfont icon-tuichudenglu"></i>} onClick={handleLogout}>退出登录</List.Item>
          </List>
        </Card>

      </div>

      <ActionSheet
        visible={visible}
        actions={actions}
        cancelText='取消'
        onClose={() => setVisible(false)}
        onAction={(acttion,index) =>{
            if(acttion.key === 'confirm'){
                //退出登录
                setVisible(false)
                // 退出登录逻辑
                // 例如，清除本地存储的 token
                localStorage.removeItem('token')
                // 跳转到登录页面
                navigate('/login')
            }
        }}
      />
    </div>
  )
}