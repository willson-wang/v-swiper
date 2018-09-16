<template>
  <div id="app">
    <swiper :list="bannerList" height="180px" :loop="true" :auto="true"></swiper>
  </div>
</template>

<script>
import swiper from './lib/v-swiper'

export default {
  name: 'App',
  components: {
    swiper
  },
  data () {
    return {
      bannerList: [{
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5ajgfcj20p00goq7n.jpg'
      }, {
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl4twp0uj20p00gogo2.jpg'
      }, {
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
      }, {
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl5tg4hkj20gl087dgs.jpg'
      }, {
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl63v7dej20jc0a9754.jpg'
      }, {
        url: 'javascript:',
        img: 'http://ww1.sinaimg.cn/large/b0f3038egy1fvbl6am6l6j20j70a7myf.jpg'
      }]
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
