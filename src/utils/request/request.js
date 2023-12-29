import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getSub, getToken, getCode } from '@/utils/function/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: 'http://backstagejq:8122',
  timeout: 200000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.requestBaseUrl) {
      config.baseURL = process.env[`VUE_APP_BASE_${config.requestBaseUrl}_API`]
    }

    if (store.getters.sub && store.getters.token) {
      config.headers['jwt_token'] = getToken()
      config.headers['sub'] = getSub()
      config.headers['code'] = getCode()
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?'
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName]
        const part = encodeURIComponent(propName) + '='
        if (value !== null && typeof (value) !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              const params = propName + '[' + key + ']'
              const subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[key]) + '&'
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.config.responseType === 'blob') {
      console.log('response', response)
      return response
    }

    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 402 || res.code === 408) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (res.code === 500) {
      Message({
        message: res.msg || 'Error',
        type: 'error'
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else if (res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    let { message } = error
    if (message === 'Network Error') {
      // message = '后端接口连接异常'
      message = '服务繁忙'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
