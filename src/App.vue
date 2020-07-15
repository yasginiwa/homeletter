<template>
  <div id="app">
      <letter :postid=postid></letter>
  </div>
</template>

<script>
import Letter from '@/views/Letter.vue'

export default {
  name: 'App',
  data() {
    return {
      postid: ''
    }
  },

  components: {
    Letter
  },

  mounted() {
    //  获取当前url
    let url = window.location.href

    //  获取get参数 即postid
    this.postid = url.split('=')[1]
  }
}
</script>

<style>
@import './assets/css/base.css';

</style>
