<template>
  <div class="game-settings-container">

    <div class="col col-xs-12 offset-sm-1 colsm-10 offset-md-2 col-md-8 offset-lg-4 col-lg-4">

      <form v-on:submit.prevent class="registration-form">
        <div class="alert-container">
          <div class="alert alert-danger" role="alert"  v-if="error">
            {{ error }}
          </div>

          <div class="alert alert-success" role="alert"  v-if="message">
            {{ message }}
          </div>
        </div>


        <div class="form-group">

          <label class="takeaway-h2" for="game-username-input">Register to Game of Three</label>
          <input type="text"
                 id="game-username-input"
                 class="form-control"
                 placeholder="Enter your username"
                 v-model="username"
          >
          <small class="form-error">
            <div class="form-error">
              <span v-if="username.length < 6"><i>The username must be at least 3 characters long.</i></span>
            </div>
          </small>

          <input type="password"
                 id="game-password-input"
                 class="form-control"
                 placeholder="Enter your password"
                 v-model="password"
          >
          <small>
            <div class="form-error">
              <span v-if="password.length < 6"><i>The password must be at least 6 characters long.</i></span>
            </div>
          </small>

        </div>

        <button class="btn btn-takeaway-action register-button"
                @click="register"
                :disabled="isUsernameInvalid || isPasswordInvalid"
        >
          Register
        </button>
      </form>

    </div>
  </div>

</template>

<script>
import router from '../router/index'
import threeClient from '../services/threeClient/index'

export default {
  name: 'Register',

  data () {
    return {
      username: '',
      password: '',

      error: '',
      message: ''
    }
  },

  computed: {
    /**
     * @returns {boolean}
     */
    isUsernameInvalid: function () {
      return this.username.length < 3
    },

    /**
     * @returns {boolean}
     */
    isPasswordInvalid: function () {
      return this.password.length < 6
    }
  },

  methods: {
    /**
     * Perform registration.
     */
    register() {
      threeClient.register(this.username, this.password)
        .then(response => {
          this.message = 'You have successfully registered to Game of Three!'

          setTimeout(() => {
            router.push({ name: 'Home'})
          }, 3000)
        })
        .catch(error => {
          const response = error.response
          this.message = response.data.error
        })
    }
  },

  created () {

  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.alert-container {
  height: 3em;
}

.form-error {
  height: 1em;
}

.registration-form {
  input {
    margin-top: 1em;
  }
}

.register-button {
  margin-top: 2em;
}
</style>
