import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { showLoading, closeLoading } from '@/utils/showOrHideLoading'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
  config => {
    let url = config.url
    // get参数编码
    if (config.method === 'get' && config.params) {
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        const value = config.params[key]
        if (value === undefined || value === null) {
          continue
        }
        url += `${key}=${encodeURIComponent(value)}&`
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
    }

    config.url = url
    if (!config.myHideLoading) {
      showLoading()
    }
    const token = config.token || getToken()
    if (token) {
      config.headers['token'] = token // 让每个请求携带自定义token
    }
    // 配置是否为JSON
    if (config.isJson) {
      config.headers['Content-type'] = 'application/json'
      config.headers['Accept'] = 'application/json'
    }

    // baseURL适配器
    if (config.API_TYPE) {
      config.baseURL = global.apiBase[API_TYPE] || global.apiBase.HOST
    }
    return config
  },
  error => {
    closeLoading()
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    closeLoading()
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    res.code === undefined ? res.code = 200 : ''
    if (res.code !== 200) {
      if (!res.message) {
        Message({
          message: '其他错误',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }

      // 401:Token 过期了;
      if (res.code === 401 || res.code === 402) {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    closeLoading()
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
