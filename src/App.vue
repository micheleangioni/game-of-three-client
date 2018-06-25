<template>
  <div class="app">
    <img src="./assets/takeawaylogo.png" class="img-fluid" alt="Takeaway.com logo">

    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',

    data () {
      return {

      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
@import './variables';

.app {
  font-family: Open Sans,Helvetica,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.btn-link {
  color: white;
}

// Takeaway.com styled buttons

.btn-takeaway-primary {
  background-color: $takeaway-primary-color-light;
  color: white;

  &:hover {
    background-color: $takeaway-primary-color;
    color: white;
  }
}

.btn-takeaway-outlined-primary {
  background-color: white;
  color: $takeaway-primary-color;
  border-color: $takeaway-primary-color;

  &:focus {
    outline:0;
    box-shadow: 0 0;
  }

  &:hover {
    background-color: $takeaway-primary-color;
    color: white;
  }
}

.btn-takeaway-action {
  margin-top: 2em;
  background-color: $takeaway-action-color-light;
  color: white;

  &:focus {
    outline:0;
    box-shadow: 0 0;
  }

  &:hover {
    background-color: $takeaway-action-color;
    transition: 0.2s ease;
    color: white;
  }
}

// Takeaway.com styled typografy

.takeaway-h2 {
  font-size: 30px;
  color: #f80;
  font-weight: 600;
}
</style>
