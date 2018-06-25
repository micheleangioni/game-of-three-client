<template>
  <div class="game-settings-container">

    <form v-on:submit.prevent>

      <!-- Game Style Choice -->

      <div class="form-group group-style">

        <button type="button"
                class="btn"
                @click="setGameStyle('auto')"
                v-bind:class="{
                  'btn-takeaway-primary': style === 'auto',
                  'btn-takeaway-outlined-primary': style === 'manual'
                }"
        >
          Play Automatically
        </button>

        <button type="button"
                class="btn "
                @click="setGameStyle('manual')"
                v-bind:class="{
                  'btn-takeaway-primary': style === 'manual',
                  'btn-takeaway-outlined-primary': style === 'auto'
                }"
        >
          Manual Play
        </button>

      </div>

      <button class="btn btn-takeaway-action"
              @click="startGame"
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
      style: 'auto'
    }
  },

  methods: {
    /**
     * Emit the start_game event.
     */
    startGame() {
      this.$emit('start_game', {
        style: this.style
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
</style>
