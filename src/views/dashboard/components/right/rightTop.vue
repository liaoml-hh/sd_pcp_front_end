<template>
  <dv-border-box-10 class="left_top_border">
    <div class="title">全国站点分布</div>
    <!-- <initCharts
      :width="'430px'"
      :height="'260px'"
      :options="rightTopOption"
    /> -->
    <dv-scroll-ranking-board v-if="config.data.length" :key="comId" :config="config" style="width:400px;height:260px" />
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
      Interval: null,
      comId: +Date.now(),
      config: {
        data: []
      }
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
      this.comId = +Date.now()
    },
    initData() {
      this.$bus.$emit('initLoad', true)
      stationdistribute().then(res => {
        this.config.data.length = 0
        let data = []
        res.data.map(item => {
          data.push({ name: item.areaVO.city, value: item.stationCount })
        })
        this.refresh()
        this.$set(this.config, 'data', data)
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
