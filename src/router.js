import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './components/Index.vue'
import Login from './components/Login.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Login },
    { path: '/index', component: Index }
  ]
})

export default router
