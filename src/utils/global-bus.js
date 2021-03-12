/**
 * 全局通信总线
 * 呼叫中心
 * 作用：可以让任何组件之间相互通信
 */
import Vue from 'vue'
export default new Vue()
// 假设 a 组件要给 b 组件发送数据，b 注册通信的事件，a发布通信的事件
/**
 * b 注册通信的事件
 * import globalBus from '@/utils/global-bus'
 * globalBus.$on('自定义事件名称', () => {
 *    // 处理函数
 * })
 * a 发布通信的事件
 * import globalBus from '@/utils/global-bus'
 * globalBus.$emit('自定义事件名称', 参数)
 */
