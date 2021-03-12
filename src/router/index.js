import Vue from 'vue'
import VueRouter from 'vue-router'
// 在VueCLI创建的项目中表示src
// 它是src目录的路径别名
// 好处：不受当前文件路径的影响
// 建议：如果加载的资源路径就在当前目录，那就正常写，
//       如果需要进行父级路径查找的就使用@
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Settings from '@/views/settings'
import Fans from '@/views/fans'
Vue.use(VueRouter)

// 路由配置表
// 路由命名是为了方便动态传递参数
const routes = [{
  path: '/login',
  name: 'login',
  component: Login
}, {
  path: '/',
  // 命名路由有一个默认子路由，这个名字没有意义
  // 正确做法：如果有默认子路由，就不给默认父路由起名字
  component: Layout,
  children: [{
    path: '', // path为空，会作为默认子路由渲染
    name: 'home',
    component: Home
  }, {
    path: '/article',
    name: 'article',
    component: Article
  }, {
    path: '/publish',
    name: 'publish',
    component: Publish
  }, {
    path: '/image',
    name: 'image',
    component: Image
  }, {
    path: '/comment',
    name: 'comment',
    component: Comment
  }, {
    path: '/settings',
    name: 'settings',
    component: Settings
  }, {
    path: '/fans',
    name: 'fans',
    component: Fans
  }]
}]

const router = new VueRouter({
  routes
})

/**
 * @params to: 要去的页面路由信息
 * @params from: 来自哪里的页面路由信息
 * @params next: 放行方法
 */
// router.beforeEach((to, from, next) => {
//   if (window.sessionStorage.getItem('token') && to.path === '/login') {
//     next(from.path)
//     console.log(1, from)
//   }
//   if (to.path === '/login') {
//     console.log(2, from)
//     next()
//   }
//   if (!window.sessionStorage.getItem('token')) {
//     console.log(3)
//     next('/login')
//   } else {
//     next()
//   }
// })
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是/login, 校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过，next()
  // 校验非登录页面状态
  const user = JSON.parse(window.sessionStorage.getItem('user'))
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})
export default router
