import axios from 'axios'

// create an axios instance
const request = axios.create({
  // 进程根据环境，自动去配合基础路径，上项目的两个配置文件当中去找相应的环境变量
  baseURL: '/mock', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // 1. 改延时时间
  timeout: 20000, // request timeout
})

// request interceptor
request.interceptors.request.use(config => {
  return config
})

// response interceptor
request.interceptors.response.use(
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
    if (res.code !== 2100) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default request
