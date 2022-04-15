<template>
  <!--圈形表格-->
  <div :class="boxDirection">
    <div ref="stock_ref" :class="chartDirection" />
    <el-steps align-center>
      <i :class="direction" />
    </el-steps>
  </div>
</template>
<script>
require('echarts/theme/macarons') // echarts theme
const echarts = require('echarts')
export default {
  props: ['optionData', 'direction', 'chartDirection', 'boxDirection'],
  data() {
    return {
      charts: ''
      // opinion: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
      // optionData: { value: 335, name: '订单数' }

    }
  },
  mounted() {
    this.$nextTick(function() {
      this.drawPie(this.optionData)
    })
  },
  updated() {
    this.$nextTick(function() {
      this.drawPie(this.optionData)
    })
  },
  methods: {
    drawPie(optionData = {
      // name: '未定义',
      // value: 0,
      series: []
    }) {
      // const oneWeight = this.$refs.stock_ref.offsetWidth / 100
      // const innerRadius = oneWeight * 6.5
      // const outterRadius = oneWeight * 7.8
      // console.log(Object.keys(this.optionData))
      // if (!Object.keys(this.optionData).length) {
      //   this.optionData = { value: 335, name: '未定义' }
      // }
      this.charts = echarts.init(this.$refs.stock_ref)
      this.charts.setOption({
        series: optionData.series
        // series: [
        //   {
        //     type: 'pie',
        //     center: ['50%', '40%'],
        //     radius: ['65%', '75%'],
        //     // 关闭鼠标移入到饼图时的动画效果
        //     hoverAnimation: false,
        //     // 隐藏指示线
        //     labelLine: {
        //       show: false
        //     },
        //     label: {
        //       position: 'center',
        //       color: '#409EFF'
        //     },
        //     data: [
        //       {
        //         // name: item.name + '\n\n' + item.count,
        //         name: optionData.name + '\n\n' + optionData.value,
        //         value: optionData.value,
        //         itemStyle: {
        //           color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
        //             {
        //               offset: 0,
        //               color: '#4FF778'
        //             },
        //             {
        //               offset: 1,
        //               color: '#0BA82C'
        //             }
        //           ])
        //         }
        //       },
        //       {
        //         value: optionData.value,
        //         itemStyle: {
        //           color: '#409EFF'
        //         }
        //       }
        //     ]
        //   }
        // ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.boxDirectionHorizontal{
  display:inline-block;
  margin:0;
  margin-top:30px;
}
.boxDirectionVertical{
  display:block;
  margin:0;
  margin-top:60px;
}
  .chartDirectionHorizontal {
    width: 150px;
    height: 150px;
    margin-left: -21px;
  }
  .chartDirectionVertical {
    width: 150px;
    height: 150px;
    margin-left: -21px;
    margin-top: -60px;
    // position: absolute;
  }
.directionHorizontal{
  transition-delay:100ms;
  border:1px;
  width:150px;
  height:2px;
  background-color: #409EFF;
  margin-top: -90px;
  margin-left: 110px;
}
.directionVertical{
  // display: flex;
  // position: absolute;
  width:2px;
  height:152px;
  background-color: #409EFF;
  margin-top: -2px;
  margin-left: 53px;
  float: left;
  top: 150px;
}
.lineNone{
  display: none;
}
</style>
