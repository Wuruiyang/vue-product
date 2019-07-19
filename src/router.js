import Vue from 'vue'
import VueRouter from 'vue-router'
// import Index from './components/Index.vue'
// import Login from './components/Login.vue'
// import User from './components/users/User.vue'
// import Rights from './components/rights/Rights.vue'
// import Roles from './components/rights/Roles.vue'
// import Categories from './components/products/Categories.vue'
// import Goods from './components/products/Goods.vue'
// import GoodAdd from './components/products/AddGoods.vue'
// 异步加载可以节约性能
const Login = () => import(/* webpackChunkName: 'login' */ './components/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */ './components/Index.vue')
const User = () => import(/* webpackChunkName: 'user' */ './components/users/User.vue')
const Rights = () => import(/* webpackChunkName: 'rights' */ './components/rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: 'rights' */ './components/rights/Roles.vue')
const Categories = () => import(/* webpackChunkName: 'products' */ './components/products/Categories.vue')
const Goods = () => import(/* webpackChunkName: 'products' */ './components/products/Goods.vue')
const GoodAdd = () => import(/* webpackChunkName: 'products' */ './components/products/AddGoods.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Index,
      name: 'index',
      children: [
        { path: '/users', component: User, name: 'user' },
        { path: '/rights', component: Rights, name: 'rights' },
        { path: '/roles', component: Roles, name: 'roles' },
        { path: '/categories', component: Categories, name: 'categories' },
        { path: '/goods', component: Goods, name: 'goods' },
        { path: '/good-add', component: GoodAdd, name: 'goods-add' }
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
