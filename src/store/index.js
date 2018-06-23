import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      ...user
    }
  },
  strict: false // Must use this due to state.socket = io(process.env.API_URL) in authentication store
})
