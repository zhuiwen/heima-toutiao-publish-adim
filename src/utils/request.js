/**
 *  基于axios封装的请求模块
 */
import axios from 'axios'
import JSONBig from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'
// 创建一个axios实例，说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来使用
/**
 * 我们可能有这样的需求：
 *    例如：有多个不同路径的请求接口：
 *          http://127.0.0.1:3000/
 *          http://hello.com
 */
// 复制了一个axios的实例，不同的axios实例可以有不同的配置
// 复制出来的axios和axios本身的功能一摸一样
const request = axios.create({
  // 定制后端返回原始数据的处理，
  // 参数data就是后端返回的未经处理的json格式字符串
  transformResponse: [function (data) {
    // 后端返回的数据可能不是json格式的数据
    // 如果不是的，JSONBig.parse(data)可能报错
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
  }]
})

// 请求拦截器
// 所有请求会经过这里
request.interceptors.request.use(config => {
  // config是当前请求相关的配置信息对象
  // config是可以修改的，在允许请求出去之前定制统一业务功能处理，
  // 如：统一的设置token
  // return config之后请求才会真正的发出去
  const user = JSON.parse(window.sessionStorage.getItem('user'))
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})
// 响应拦截器
// 所有响应会经过这里
request.interceptors.response.use(response => {
  // 所有响应码为 2xx 的响应都会进入这里
  // response是响应处理
  return response
}, error => {
  // 任何超出 2xx 的响应都会进入这里
  console.log('状态码异常')
  const { status } = error.response
  if (error.response && status === 401) {
    Message('登录状态无效，请重新登录')
    // 跳转到登录页面
    router.replace('/login')
  } else if (status === 400) {
    Message({
      type: 'warning',
      message: '请求参数错误'
    })
    // 客户端参数错误
  } else if (status === 403) {
    // 没用操作权限
    Message('没有操作权限')
  } else if (status >= 500) {
    // 服务端错误
    Message.error('服务端异常，请稍后重试')
  }
  return Promise.reject(error)
})
// 导出请求方法
export default request
