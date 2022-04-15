<template>
  <div id="container">
    <div class="leftGrid">
      <leftTop />
      <leftCenter />
      <leftBottom />
    </div>
    <div class="centerGrid">
      <centerTop />
      <centerBottom />
    </div>
    <div class="rightGrid">
      <rightTop />
      <rightCenter />
      <rightBottom />
    </div>
    <!--  -->
    <!--  -->
  </div>
</template>

<script>
import leftTop from './components/left/leftTop.vue'
import leftCenter from './components/left/leftCenter.vue'
import leftBottom from './components/left/leftBottom.vue'
import centerTop from './components/center/centerTop.vue'
import centerBottom from './components/center/centerBottom.vue'
import rightTop from './components/right/rightTop.vue'
import rightCenter from './components/right/rightCenter.vue'
import rightBottom from './components/right/rightBottom.vue'
export default {
  components: {
    leftTop,
    leftCenter,
    leftBottom,
    centerTop,
    centerBottom,
    rightTop,
    rightCenter,
    rightBottom
  },
  data() {
    return {
      loading: null,

      count: 0
    }
  },
  mounted() {
    this.showLoading()
    this.$bus.$on('initLoad', this.initLoad)
  },
  beforeDestroy() {
    this.$bus.$off('initLoad', this.initLoad)
  },
  methods: {

    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '数据正在加载,请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },

    initLoad(flag) {
      this.count++
      console.log('@=============>', this.count)
      if (this.count === 11) {
        this.loading.close()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scope>
*{
  margin: 0;
  padding: 0;
}
  #container{
    width: 100%;
    height: 100%;
    display: grid;
    background: url('../../assets/bg.png') no-repeat;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 30px;
    // margin:100px 30px;
    .leftGrid{
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 20px;
      margin:100px 30px;
      z-index: 1;
    }
    .centerGrid{
      // grid-column: span 2 / auto;
      // grid-row: span 2 / auto;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      margin: auto;
      grid-gap: 20px;
      margin: 100px 170px;
    }
    .rightGrid{
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 20px;
      margin:100px 30px;
      z-index: 1;
    }
  }
</style>
