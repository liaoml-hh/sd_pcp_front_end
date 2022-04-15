<template>
  <dv-border-box-12 class="left_top_border">
    <div class="title">换电流量</div>
    <div class="content">
      <!-- <div>咩咩咩咩</div> -->
      <dv-border-box-12 class="content_border">
        今日换电流量  <div class="sumAqua">{{ todayappointment }}次</div>
      </dv-border-box-12>
      <dv-border-box-12 class="content_border">
        今日预约量  <div class="sumYellow">{{ todayreserved }}次</div>
      </dv-border-box-12>
      <dv-border-box-12 class="content_border">
        上周换电总量  <div class="sumGreen">{{ lastweekmount }}次</div>
      </dv-border-box-12>
    </div>
    <initCharts class="initCharts" :width="'230px'" :height="'184px'" :options="rightCenterOption" />
  </dv-border-box-12>
</template>
<script>
import initCharts from '../../../../components/initCharts.vue'
import {myfun} from '../../../../utils/echartsOptions/rightCenterOption'
import { yearweekappointment, todayappointment, todayreserved, countallpower } from '@/api/apply/apply'
export default {
  components: {
    initCharts
  },
  data() {
    return {
      lastweekmount: '', // 上周换电总量
      todayappointment: '', // 今日换电流量
      todayreserved: ',', // 今日预约量
      allappointment:'',  //总换电量
      rightCenterOption:{},
      Interval: null,
      
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
      // 查询今日预约量
      this.$bus.$emit('initLoad', true)
      todayreserved().then(response => {
        this.todayreserved = response
        if (response === undefined) {
          this.todayreserved = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
      // 查询当日换电流量
      this.$bus.$emit('initLoad', true)
      todayappointment().then(response => {
        this.todayappointment = response
        if (response === undefined) {
          this.todayappointment = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })

      // 查询上周换电总量
      this.$bus.$emit('initLoad', true)
      yearweekappointment().then(response => {
        this.lastweekmount = response
        if (response === undefined) {
          this.todayincome = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
      // 查询上周换电总量
      this.$bus.$emit('initLoad', true)
      countallpower().then(response => {
        this.allappointment = response
        if (response === undefined) {
          this.allappointment = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })

      
        let echartData = [{
            name: '总换电量',
            value: this.allappointment
          },
          {
            name: '当日换电量',
            value: this.todayappointment
          }
          ]
      this.rightCenterOption = myfun(echartData);
      debugger
      console.log(this.rightCenterOption)
    }
  
  }
}
</script>
<style lang="scss" scoped>
.left_top_border{
    width: 440px;
    height: 200px;
    border: 1px solid #021132;
    position: relative;
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
      color: white;
      text-align: left;
      text-indent: 30px;
      margin-left: 40px;
      margin-top: 20px;
      font-size: 14px;
      .content_border{
        width: 140px;
        height: 30px;
        font-size: 12px;
        text-align: left;
        text-indent: 10px;
        line-height: 30px;
      }
      .sumAqua{
        display: inline-block;
        color: aqua;
      }
      .sumYellow{
        display: inline-block;
        color: yellow;
      }
      .sumGreen{
        display: inline-block;
        color: rgb(77, 255, 0);
      }
    }
    .initCharts{
      position: absolute;
      display: inline-block;
      top: 15px;
      left: 150px;
    }

  }
</style>
