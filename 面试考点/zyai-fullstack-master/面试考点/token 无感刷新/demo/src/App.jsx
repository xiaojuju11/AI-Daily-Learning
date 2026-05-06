import React, { useEffect } from 'react'
import axios from './http.js'

export default function App() {
  useEffect(() => {
    axios.post('/login', {
      username: 'admin',
      password: '123456'
    }).then((res) => {
      console.log(res);
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('refreshToken', res.refreshToken)
    })
  }, []);
  
  const home = () => {
    axios.get('/home').then((res) => {
      console.log(res);
    })
  }

  return (
    <div onClick={home}>App</div>
  )
}
