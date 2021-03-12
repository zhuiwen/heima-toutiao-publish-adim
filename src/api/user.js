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

// 修改用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    // 如果通过axios传递FormData对象，会自动将headers的Content-Type设置为multipart/form-data
    data
  })
}

// 修改用户基本信息
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}
