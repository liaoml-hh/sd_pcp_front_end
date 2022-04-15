<template>
  <dv-border-box-10 class="left_top_border">
    <div class="content_box">
      <div class="dian">
        <span style="color:#00d7ff;font-size:24px;">1809282 度</span>
        <div style="color:rgb(246 255 0);font-size:14px;margin-top:10px">累计换电度数</div>
      </div>
      <div class="dian">
        <span style="color:#00d7ff;font-size:24px;">1809282 吨</span>
        <div style="color:rgb(246 255 0);font-size:14px;margin-top:10px">减少碳排放量</div>
      </div>

    </div>

    <!-- <initCharts :width="'380px'" :height="'187px'" :options="leftTopOption" /> -->
  </dv-border-box-10>
</template>

<script>
// import initCharts from '../../../components/initCharts.vue'
// import leftTopOption from '../../../utils/echartsOptions/leftTopOption'
export default {
  components: {
    // initCharts
  },
  data() {
    return {
      // leftTopOption
    }
  }
}
</script>

<style lang="scss" scoped>
  .left_top_border{
    // position: absolute;
    // top: 100px;
    // right: 44px;
    // left: 32px;
    // bottom: 28px;
    width: 440px;
    height: 120px;
    border: 1px solid #021132;
    .content_box{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
      margin-top: 25px;
    }
    .title{
      width: 333px;
      height: 24px;
      background: linear-gradient(90deg, #3053AF, #021132);
      margin: 13px 15px 0;
      color: white;
      line-height: 24px;
      text-align: left;
      text-indent: 10px;
      font-size: 16px;
    }
  }

</style>
