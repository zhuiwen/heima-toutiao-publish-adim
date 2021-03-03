/**
 * 文章相关请求模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body 参数使用 data 设置
    // Query 参数使用 params设置
    // headers 参数使用 headers 设置
    params
  })
}

/**
 * 获取文章频道
 */
export const getArticleChannels = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

/**
 * 删除文章
 */
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    // 接口文档中的写的路径参数需要在url中传递
    url: `/mp/v1_0/articles/${articleId}`
  })
}
