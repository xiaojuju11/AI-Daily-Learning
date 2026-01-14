import React, { useState, useEffect } from 'react'
import '../styles/register.less'
import axios from '../http/index'
import { Toast } from 'antd-mobile';



export default function Register() {
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  const [password, setPassword] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [captchaSvg, setCaptchaSvg] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadCaptcha() {
    const res = await axios.get('/api/auth/captcha')
    setCaptchaId(res.data.captchaId)
    setCaptchaSvg(res.data.svg)
  }

  useEffect(() => {
    loadCaptcha()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nickname || !phone || !captchaCode || !password) {
      Toast.show({
        icon: 'fail',
        content: '请填写完整信息'
      })
      return
    }

    //校验格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    const majorChineseEmailRegex = /^[a-zA-Z0-9._%+-]+@(?:qq\.com|163\.com|126\.com|sina\.(?:com|cn)|sohu\.com|yeah\.net|gmail\.com|hotmail\.com|outlook\.com|foxmail\.com|aliyun\.com)$/i;
    if (!phoneRegex.test(phone) && !majorChineseEmailRegex.test(phone)) { // 手机号码非法
      Toast.show({
        icon: 'fail',
        content: '请输入正确的账号'
      })
      return
    }

    //loading
    setLoading(true)

    //发请求
    const res = await axios.post('/api/auth/register',{
      nickname,
      phone,
      captchaCode,
      password,
      captchaId
    })
    console.log(res)

  }

  return (
    <div>
      <form className='register-form' onSubmit={handleSubmit}>
        <div className="register-form__group">
          <i className='iconfont icon-zhanghao'></i>
          <input
            type="text"
            placeholder='请输入昵称'
            className='register-form__input'
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
            }}
          />
        </div>
        <div className="register-form__group">
          <i className='iconfont icon-lujingbeifen3'></i>
          <input
            type="text"
            placeholder='请输入手机号或邮箱'
            className='register-form__input'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
            }}
          />
        </div>
        <div className="register-form__group register-form__group--captcha">
          <i className='iconfont icon-yanzhengma'></i>
          <input
            type="text"
            placeholder='请输入验证码'
            className='register-form__input register-form__input--captcha'
            value={captchaCode}
            onChange={(e) => {
              setCaptchaCode(e.target.value)
            }}
            maxLength={4}
          />
          <div
            className="register-form__captcha-img"
            title='点击刷新验证码'
            dangerouslySetInnerHTML={{ __html: captchaSvg }}
          ></div>
        </div>
        <div className="register-form__group">
          <i className='iconfont icon-mima'></i>
          <input
            type="password"
            placeholder='请设置密码'
            className='register-form__input'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <button disabled={loading} type='submit' className='register-form__submit'>
          {loading ? '注册中...' : '注册'}

        </button>
      </form>
    </div>
  )
}