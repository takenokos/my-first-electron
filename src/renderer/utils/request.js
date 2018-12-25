import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  // config => {
  //   // Do something before request is sent
  //   if (store.getters.token) {
  //     // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  //     config.headers['X-Token'] = getToken()
  //   }
  //   return config
  // },
  config => config,
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
