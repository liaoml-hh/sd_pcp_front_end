<template>
  <dv-border-box-10 class="left_top_border">
    <div class="title">用户</div>
    <initCharts v-if="useramount.length" :key="comId" :width="'430px'" :height="'190px'" :options="rightBottomOption" />
  </dv-border-box-10>
</template>
<script>
import initCharts from '../../../../components/initCharts.vue'
import rightBottomOption from '../../../../utils/echartsOptions/rightBottomOption'
import { userdistribute } from '@/api/user/index'
export default {
  components: {
    initCharts
  },
  data() {
    return {
      rightBottomOption,
      useramount: [], // 用户数量
      Interval: null,
      comId: Math.random * Math.random
    }
  },
  mounted() {
    this.initData()
    this.Interval = setInterval(this.initData, 3 * 60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.Interval)
  },
  methods: {
    refresh() {
      this.comId = Math.random * Math.random
    },
    initData() {
      let dataObj = {
        xAxis: [],
        series: []
      }
      this.$bus.$emit('initLoad', true)
      userdistribute().then(res => {
        this.useramount = res.data
        res.data.map(item => {
          dataObj.xAxis.push(item.countDate)
          dataObj.series.push(item.userCount)
        })
        this.refresh()
        this.rightBottomOption.xAxis.data = dataObj.xAxis
        this.rightBottomOption.series[0].data = dataObj.series
      }).catch(() => {
        this.$message.error('网络异常')
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.left_top_border{
    width: 440px;
    height: 200px;
    border: 1px solid #021132;
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
