<template>
  <dv-border-box-10 class="left_top_border">
    <div class="title">全国站点分布</div>
    <initCharts
      :width="'430px'"
      :height="'260px'"
      :options="rightTopOption"
    />
  </dv-border-box-10>
</template>
<script>
import initCharts from '../../../../components/initCharts.vue'
// import rightTopOption from '../../../../utils/echartsOptions/rightTopOption'
import getPie3D from '../../../../utils/echartsOptions/rightTopOption'
import { stationdistribute, countenablestation } from '@/api/station/station'
export default {
  components: {
    initCharts
  },
  data() {
    return {
      rightTopOption: {},
      datalist: [],
      Interval: null
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

    initData() {
      this.$bus.$emit('initLoad', true)
      stationdistribute().then(res => {
        this.datalist.length = 0
        res.data.map(item => {
        // this.provincelist.push(item.areaVO.city)
          const { stationCount: value } = item
          this.datalist.push({ value, name: item.areaVO.city, itemStyle: { emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(30, 144, 255，0.5)'
          }}})
        })
        this.rightTopOption = getPie3D(this.datalist, 0.76)
      }).catch((e) => {
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
    height: 300px;
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
