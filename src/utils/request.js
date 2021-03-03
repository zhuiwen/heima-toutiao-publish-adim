/**
 *  基于axios封装的请求模块
 */
import axios from 'axios'
import JSONBig from 'json-bigint'
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
  baseURL: 'http://api-toutiao-web.itheima.net/',
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
// 导出请求方法
export default request
