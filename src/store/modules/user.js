import io from 'socket.io-client';
import threeClient from '../../services/threeClient/index'

// Initial state

const state = {
  user: null,
  socket: null
}

// Getters

const getters = {
  getUser: state => state.user,
  getSocket: state => state.socket
}

// Actions

const actions = {
  /**
   * Perform Login.
   *
   * @param commit
   * @param {String} username
   * @param {String} password
   */
  login({commit}, {username, password}) {
    return new Promise((resolve, reject) => {
      threeClient.login(username, password)
        .then((response) => {
          commit('setUser', response.data.data)
          resolve(response.data.data)
        }).catch((error) => {
        reject(error.response)
      })
    })
  }
}

// Mutations

const mutations = {
  /**
   * Initialize the Store
   *
   * @param state
   */
  init (state) {
    console.log(process.env.API_URL)

    const socket = io(process.env.API_URL, {
      'path': '/game'
    })

    state.socket = socket
  },

  /**
   * Register a new Socket Event
   *
   * @param state
   * @param {String} event
   * @param {Function} callback
   */
  registerSocketEvent (state, { event, callback }) {
    state.socket.on(event, callback)
  },

  /**
   * @param state
   * @param {Array} user
   */
  setUser (state, user) {
    state.user = user
  },

  /**
   * Unset the User.
   *
   * @param state
   */
  unsetUser (state) {
    state.user = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
