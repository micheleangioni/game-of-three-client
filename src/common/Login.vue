<template>
  <div class="game-settings-container row">

    <div class="col col-xs-12 offset-sm-1 colsm-10 offset-md-2 col-md-8 offset-lg-4 col-lg-4">

      <form v-on:submit.prevent class="login-form">
        <div class="form-group">

          <label class="form-title" for="game-username-input">Enter your credentials to login</label>
          <input type="text"
                 id="game-username-input"
                 class="form-control"
                 placeholder="Enter your username"
                 v-model="username"
          >

          <input type="password"
                 id="game-password-input"
                 class="form-control"
                 placeholder="Enter your password"
                 v-model="password"
          >

        </div>

        <div class="alert-container">
          <div class="alert alert-danger" role="alert"  v-if="error">
            {{ error }}
          </div>
        </div>

        <button class="btn btn-takeaway-action login-button"
                @click="login"
                :disabled="isUsernameInvalid || isPasswordInvalid"
        >
          Login
        </button>

        <router-link class="btn btn-takeaway-primary btn-router login-button" :to="{ name: 'Register' }">
          Register
        </router-link>
      </form>

    </div>
  </div>

</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',

  data () {
    return {
      username: 'Michele',
      password: 'password',

      error: ''
    }
  },

  computed: {
    /**
     * @returns {boolean}
     */
    isUsernameInvalid: function () {
      return this.username.length === 0
    },

    /**
     * @returns {boolean}
     */
    isPasswordInvalid: function () {
      return this.password.length === 0
    }
  },

  methods: {
    ...mapActions('user', {
      performLogin: 'login'
    }),

    /**
     * Emit the login_performed event.
     */
    login() {
      this.performLogin({username: this.username, password: this.password})
        .then(user => {
          this.error = ''

          this.$emit('login_performed', {
            user: user
          })
        })
        .catch(error => {
          const response = error.response
          this.error = response.data.error
        })
    }
  },

  created () {

  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.alert-container {
  height: 2em;
}

.login-form {
  .form-title {
    margin-top: 0.5em;
  }

  input {
    margin-top: 1em;
  }
}

.login-button {
  margin-top: 1em;
}
</style>
