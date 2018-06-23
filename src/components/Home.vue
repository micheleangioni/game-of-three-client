<template>
  <div class="container">
    <div class="hello">
      <h1>Welcome to the Game of Three ‐ Coding Challenge</h1>
      <h4>developed by</h4>
      <h2><i>Michele Angioni</i></h2>
    </div>

    <div>
      <router-link class="btn btn-primary btn-router" :to="{ name: 'Application' }">Enter the App</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',

  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
h1, h2 {
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
</style>
