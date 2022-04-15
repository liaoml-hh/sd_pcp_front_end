<template>
  <dv-border-box-10 class="left_bottom_border">
    <div class="title">换电次数</div>
    <initCharts :width="'430px'" :height="'187px'" :options="leftBottomOption" />
  </dv-border-box-10>
</template>

<script>
import initCharts from '../../../../components/initCharts.vue'
import { myfun } from '../../../../utils/echartsOptions/leftBottomOption'
import { stationdistribute, countenablestation } from '@/api/station/station'
import { countallpower } from '@/api/apply/apply'
export default {
  components: {
    initCharts
  },
  data() {
    return {
      leftBottomOption: {},
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
      let data = []
      this.$bus.$emit('initLoad', true)
      countallpower().then(res => {
        let sortList = res.data
        let sum = 0
        sortList.map(item => {
          sum = sum + item.count
          data.push({ name: item.year, value: sum })
        })
        let newdata = data.sort((var1, var2) => {
          return parseInt(var2.name) - parseInt(var1.name) > 0
        })
        newdata.unshift({ name: '累计', value: sum })
        this.leftBottomOption = myfun(newdata)
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .left_bottom_border{
    // position: absolute;
    // top: 230px;
    // left: 32px;
    width: 440px;
    height: 220px;
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
