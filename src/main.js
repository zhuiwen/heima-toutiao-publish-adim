/**
 * 项目启动入口
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载全局样式
import './styles/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 注册使用element-ui
Vue.use(ElementUI)
Vue.config.productionTip = false
// 创建vue根实例
// 把router配置到根实例
// 通过render方法把App根组件渲染到#app入口节点
new Vue({
  router,
  render: h => h(App)
  // el: '#app' 等价于 $mount('#app')
}).$mount('#app')
