<template>
  <div>
    <div class="center_top_border" />
    <div class="center_bottom_map">
      <chinaCharts :width="'100%'" :height="height" />
    </div>
  </div>

</template>

<script>
import chinaCharts from '../../../../components/chinaCharts.vue'
export default {
  components: {
    chinaCharts
  },
  data() {
    return {
      height: ''
    }
  },
  mounted() {
    this.height = `${document.getElementById('container').clientHeight}px`
  }
}
</script>

<style lang="scss" scoped>
  .center_top_border{
    width: 520px;
    height: 550px;
    border: 1px solid #021132;
    padding: 10px 0;
    z-index: -1;
    .money{
      margin-top: 10px;
      font-size: 24px;
      letter-spacing: 2px;
      color:#00d7ff;
    }
  }
  .center_bottom_map{
    position: absolute;
    width: 90%;
    top: 90px;
    left: -120px;
  }

</style>
