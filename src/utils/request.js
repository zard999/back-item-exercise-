import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  // 进程根据环境，自动去配合基础路径，上项目的两个配置文件当中去找相应的环境变量
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // 1. 改延时时间
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // do something before request is sent
  const token = store.state.user.token
  if (token) {
    // let each request carry token
    // ['token'] is a custom headers key
    // please modify it according to the actual situation
    // 2. 改成token
    config.headers['token'] = token
  }
  return config
})

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // 3. 必须得加!==200,我们自己的接口200代表成功，不能进入错误
    if (res.code !== 20000 && res.code !== 200) {
      // Message复杂写法可以控制弹出时间
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
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
