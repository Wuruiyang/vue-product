import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// 样式在index.html里面引入
// import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import quillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

// 给Vue强行添加axios
Vue.prototype.axios = axios
// 给axios配上baseurl,只要设置了全局默认的base_url,以后的请求会自动拼接上base_url
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = '/aaa'
// 配置拦截器,request之前设置请求头
axios.interceptors.request.use(function (config) {
  // 给config配置 token
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// elementUI是基于vue的插件,需要use()
Vue.use(ElementUI)
Vue.use(quillEditor)

// 添加一个过滤,过滤数字->日期
Vue.filter('dataFilter', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
