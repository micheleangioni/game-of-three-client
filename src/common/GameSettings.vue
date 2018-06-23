<template>
  <div class="game-settings-container">
    <form v-on:submit.prevent>

      <div class="form-group">

        <label for="game-username-input">Enter your Username to start the Game</label>
        <input type="text"
               id="game-username-input"
               class="form-control"
               placeholder="Enter your username"
               v-model="username"
        >
        <small class="form-text text-muted">Please use at least 3 characters.</small>

      </div>

      <!-- Game Style Choice -->

      <div class="form-group group-style">

        <button type="button"
                class="btn"
                @click="setGameStyle('auto')"
                v-bind:class="{
                  'btn-primary': style === 'auto',
                  'btn-outline-primary': style === 'manual'
                }"
        >
          Play Automatically
        </button>

        <button type="button"
                class="btn "
                @click="setGameStyle('manual')"
                v-bind:class="{
                  'btn-primary': style === 'manual',
                  'btn-outline-primary': style === 'auto'
                }"
        >
          Manual Play
        </button>

      </div>

      <button class="btn btn-success start-button"
              @click="startGame"
              :disabled="isUsernameInvalid"
      >
        Start Game!
      </button>
    </form>
  </div>

</template>

<script>
export default {
  name: 'GameSettings',

  data () {
    return {
      /**
       * Game style.
       * Allowed values: 'auto', 'manual'.
       */
      style: 'auto',

      /**
       * Username.
       */
      username: ''
    }
  },

  computed: {
    /**
     * @returns {boolean}
     */
    isUsernameInvalid: function () {
      return this.username.length < 3
    }
  },

  methods: {
    /**
     * Emit the start_game event.
     */
    startGame() {
      this.$emit('start_game', {
        style: this.style,
        username: this.username
      })
    },

    /**
     * Set the game style.
     *
     * @param {string} style
     */
    setGameStyle(style) {
      this.style = style
    }
  },

  created () {

  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.group-style {
  margin-top: 2em;
}

.start-button {
  margin-top: 2em;
}
</style>
