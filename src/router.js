import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './components/Index.vue'
import Login from './components/Login.vue'
import User from './components/User.vue'
import Rights from './components/Rights.vue'
import Roles from './components/Roles.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Index,
      name: 'index',
      children: [
        { path: '/user', component: User, name: 'user' },
        { path: '/rights', component: Rights, name: 'rights' },
        { path: '/roles', component: Roles, name: 'roles' }
      ]
    },
    { path: '/login', component: Login, name: 'login' }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取token
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
