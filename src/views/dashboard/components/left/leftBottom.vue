<template>
  <dv-border-box-10 class="left_center_border">
    <div class="title">站点规划图</div>
    <initCharts :width="'430px'" :height="'160px'" :options="leftTopOption" />

    <initCharts :width="'430px'" :height="'187px'" :options="leftTopRadioOption" />
  </dv-border-box-10>
</template>

<script>
import initCharts from '../../../../components/initCharts.vue'
import { initLeftTopOption } from '../../../../utils/echartsOptions/leftTopOption'
import { initLeftTopRadioOption } from '../../../../utils/echartsOptions/leftTopRadioOption'
import { stationStatus, sitePlanningStatistics } from '@/api/station/station'
export default {
  components: {
    initCharts
  },
  data() {
    return {
      leftTopOption: {},
      leftTopRadioOption: {},
      echartsData: [{
        name: '总数量',
        value: '0'
      },
      {
        name: '在线数量',
        value: 0
      },
      {
        name: '在线率',
        value: 0
      }
      ],
      Interval1: null,
      Interval2: null
    }
  },
  mounted() {
    this.leftTopRadioOptionFun()
    this.initLeftTopOptionFun()
    this.Interval1 = setInterval(this.initLeftTopOptionFun, 3 * 60 * 1000)
    this.Interval2 = setInterval(this.leftTopRadioOptionFun, 3 * 60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.Interval1)
    clearInterval(this.Interval2)
  },

  methods: {

    leftTopRadioOptionFun() {
      this.$bus.$emit('initLoad', true)
      stationStatus().then(res => {
        let sum = 0
        let enable = 0
        res.data.map(item => {
          sum = sum + parseInt(item.countValue)
          if (item.field === '1') {
            this.echartsData[1].value = item.countValue
            enable = item.countValue
          }
        })
        this.echartsData[0].value = sum
        let percentage = enable / sum
        this.echartsData[2].value = percentage.toFixed(2) * 100
        this.leftTopRadioOption = initLeftTopRadioOption(this.echartsData)
      }).catch(error => { console.log(error) }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
    },
    initLeftTopOptionFun() {
      this.$bus.$emit('initLoad', true)
      sitePlanningStatistics().then(res => {
        let data = {
          xAxisData: [],
          seriesV1: []
        }
        res.data.map(item => {
          data.xAxisData.push(item.field + '年')
          data.seriesV1.push(item.countValue)
        })
        this.leftTopOption = initLeftTopOption(data)
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .left_center_border{
    // position: absolute;
    // top: 460px;
    // left: 32px;
    width: 440px;
    height: 360px;
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
    .content{
      display: flex;
      margin-top: 32px;
      .contentLeft{
        width: 236px;
        text-align: center;
        .faceImg{
          width: 59px;
          height: 59px;
        }
        .faceText{
          font-size: 13px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
        }
        .countText{
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #44EDFE;
          .unit{
            // color: linear-gradient(90deg, #3053AF, #021132);
            margin-left: 8px;
            font-size: 20px;
            background-image:-webkit-linear-gradient(left,#00e5ff, #3868ce);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
          }
        }
      }
    }
  }

</style>
