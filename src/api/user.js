/**
 * 用户相关请求模块
 */
// 用户登录
import request from '@/utils/request'
export const login = data => {
  return request({
    method: 'post',
    url: '/mp/v1_0/authorizations',
    // data 用来设置post的请求体
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 修改用户信息
export const updateUser = () => {

}
