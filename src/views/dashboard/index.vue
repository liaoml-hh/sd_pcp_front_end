<template>
  <div :style="screenStyle" class="screen-container">
    <!-- <dv-full-screen-container :style="screenStyle" class="screen-container"> -->
    <bigDataShow />
  <!-- </dv-full-screen-container> -->
  </div>

</template>

<script>
import bigDataShow from './bigDataShow.vue'
export default {
  components: {
    bigDataShow
  },
  data() {
    return {
      sidebarCW: '',
      sidebarCH: '',
      navbarW: '',
      navbarH: '',
      browserW: '',
      browserH: '',
      screenStyle: ''
    }
  },
  mounted() {
    const sidebarContainer = document.getElementById('sidebar-container')
    const navbar = document.getElementById('navbar')
    const sidebarCW = sidebarContainer.clientWidth
    const navbarH = navbar.clientHeight
    const browserW = document.documentElement.clientWidth
    const browserH = document.documentElement.clientHeight
    const containerW = browserW - sidebarCW
    console.log('containerW: ', containerW)
    this.screenStyle = `width:1920px;height: 1080px;top:${navbarH}px;left:${sidebarCW}px;transform: scale(${containerW / 1920});`
    console.log('screenStyle: ', this.screenStyle)
    window.onresize = function() {
      const sidebarCW = sidebarContainer.clientWidth
      const navbarH = navbar.clientHeight
      const browserW = document.documentElement.clientWidth
      const browserH = document.documentElement.clientHeight
      const containerW = browserW - sidebarCW
      console.log('containerW: ', containerW)
      this.screenStyle = `width:1920px;height: 1080px;top:${navbarH}px;left:${sidebarCW}px;transform: scale(${containerW / 1920});`
      console.log('containerW / 1920: ', containerW / 1920)
      // console.log('screenStyle: ', this.screenStyle)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
*,html,body{
  margin: 0;
  padding: 0;
  height: auto;
}
.screen-container{
    text-align: center;
    /* background-size: 100% 100%; */
    border: 1px solid #021132;
    position: relative;
    -webkit-transform-origin: left top;
    transform-origin: left top;
    overflow: hidden;
    /* z-index: 999; */
}
</style>

