// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import '../node_modules/bootstrap/scss/bootstrap.scss';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})


// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Add X-Requested-With header
  config.headers.common['X-Requested-With'] = 'XMLHttpRequest'

  // If an Authorization token is present in the Local Storage, attach it to the header
  if (localStorage.getItem('access_token')) {
    config.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Check for an Authorization token in header
  if (response.headers.authorization) {
    localStorage.setItem('access_token', response.headers.authorization.substr(7))
  }
  return response
}, function (error) {
  // Redirect to Index in case of 401 error
  if (error.response.status === 401) {
    localStorage.removeItem('access_token')
    router.push({ name: 'Home' })
  }

  return Promise.reject(error)
})
