import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import About from '@/components/About'
import SystemDetail from '@/components/SystemDetail'
import AreaDetail from '@/components/AreaDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomePage
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/system/:systemId',
      name: 'systemDetail',
      component: SystemDetail
    },
    {
      path: '/area/:areaId',
      name: 'areaDetail',
      component: AreaDetail
    }
  ]
})
