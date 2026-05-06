import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `${accessToken}`
    }
    return config
  }
)

axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status === 401) {

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        // 重发请求，刷新访问令牌
        axios.post('/refresh', { refreshToken })
        .then(res => {
          console.log('刷新令牌成功', res);
          localStorage.setItem('accessToken', res.accessToken)
          localStorage.setItem('refreshToken', res.refreshToken)
          // 刚刚没成功的请求，需要重新发送
          error.config.headers.Authorization = `${res.accessToken}`
          return axios(error.config) // error.config == { url: '/home', method: 'get', headers: { Authorization: 'Bearer ' + accessToken } }
        })
        
      }

    }
  }
)

export default axios