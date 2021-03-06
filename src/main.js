import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 加载全局css样式
import './assets/css/global.css'
// 导入
import axios from 'axios'
// 导入通用js
import Common from './CommonFunction/common.js'
import Global from './CommonFunction/global.js'
// 导入echarts
// import echarts from 'echarts'
// // import echarts from './plugins/echarts'
// import draggable from 'vuedraggable' //拖拽插件
// import JsonViewer from 'vue-json-viewer'  //JSON插件
// axios.defaults.baseURL = 'http://www.platform.haomingjian.top/api'
axios.defaults.baseURL = 'http://localhost'


axios.interceptors.request.use(request => {
  /* 判断token存在   登录拦截 */
  if (window.localStorage.getItem('token')) {
    /* 设置统一的header */
    request.headers.Authorization = window.localStorage.getItem('token')
  }
  return request
})
// 响应拦截
axios.interceptors.response.use((response) => {
  if (response.data.code !== 200) {
    if (response.data.code === 40009) {
      // 跳转到登录页面
      vm.$router.push('/login')
    }
  }
  return response
})
Vue.prototype.$http = axios
Vue.prototype.$common = Common
Vue.prototype.$global = Global
Vue.config.productionTip = false
// Vue.prototype.echarts = echarts

const vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export default vm
