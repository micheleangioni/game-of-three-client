<template>
  <div class="container">
    <div class="hello">
      <div class="takeaway-h2">Welcome to the Game of Three ‐ Coding Challenge</div>
      <h4 class="developed-by">developed by</h4>
      <h2><i>Michele Angioni</i></h2>
    </div>

    <login v-on:login_performed="loginPerformed"></login>
  </div>
</template>

<script>
import Login from '../common/Login'
import router from '../router/index'

export default {
  components: {
    Login
  },

  name: 'Home',

  data () {
    return {

    }
  },

  methods: {
    loginPerformed(user) {
      router.push({ name: 'Application'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

.developed-by {
  margin: 0.7em 0;
}
</style>
