import axios from 'axios'
import notify from '@/utils/notify'
import router from '../router'

// 超时时间
axios.defaults.timeout = 1000  //省的老是padding，直接cancel算了
// 默认基地址
axios.defaults.baseURL = '/scm-web'
// http请求拦截器
axios.interceptors.request.use(config => {
  // element ui Loading方法
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(res => { // 响应成功关闭loading
  return res
}, error => {
  let res = error.response
  if (res.status === 403 || res.status === 401) {
    router.push({path: '/'})
  }
  notify.error(res.data.databuffer)
  return Promise.reject(error)
})

export default axios
