<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <space msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import space from './components/space.vue'

export default {
  name: 'App',
  components: {
    space
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
