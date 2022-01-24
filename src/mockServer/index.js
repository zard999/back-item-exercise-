import Mock from 'mockjs'
import data from './data.json'

// 真正的模拟接口，mock的接口不会在network里面看到
// mock拦截ajax请求
Mock.mock('/mock/data', {
  code: 2100,
  data,
})
