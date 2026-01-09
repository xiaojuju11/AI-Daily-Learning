import axios from 'axios'
import { Toast } from 'antd-mobile'

axios.timeout = 5000
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/json'

//请求拦截
axios.interceptors.request.use(request => {
    const token = localStorage.getItem('token')
    if (token) {
        request.headers.Authorization = token
    }
    return request
}
)

//响应拦截
axios.interceptors.response.use(
    (reponse) => {//逻辑性错误
        if (response.data.code !== 1) {
            Toast.show({
                icon: 'fail',
                content: response.data.message
            })
            return Promise.reject(response.data.message)
        }
        return response
    },
        (res) => {// 程序性错误
            if (response.status !== 200) {
                Toast.show({
                    icon: 'fail',
                    content: response.data.message
                })

                if(res.status ==416){//没有权限

                }
                return Promise.reject(response.data.message)
            }
        }
)

export default axios
