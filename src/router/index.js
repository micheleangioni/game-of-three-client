import Vue from 'vue'
import Router from 'vue-router'
import Application from '@/components/Application'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/application',
      name: 'Application',
      component: Application
    }
  ]
})
