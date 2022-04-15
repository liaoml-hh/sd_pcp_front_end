<template>
  <div
    :ref="uuid"
    :style="style"
    element-loading-text="loading"
  />
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
// import { features } from '@/utils/dataStatistics/optionsPutAreaZhejiang'
// import { deepClone } from '@/utils/deepClone'
const getUUID = () => {
  return new Date().getTime()
}
export default {
  props: {
    height: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: null
    },
    // queryloading: {
    //   type: Boolean,
    //   default: false
    // },
    echartType: {
      type: String,
      default: ''
    },
    clickEventType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      uuid: null,
      myChart: null
    }
  },
  computed: {
    style() {
      return {
        height: this.height,
        width: this.width
      }
    }
  },
  watch: {
    width() {
      if (this.myChart) {
        this.myChart.resize({
          animation: {
            duration: 300
          }
        })
      }
    },
    height() {
      if (this.myChart) {
        this.myChart.resize({
          animation: {
            duration: 300
          }
        })
      }
    },
    options() {
      if (this.myChart) {
        this.myChart.setOption(this.options, {
          notMerge: true
        })
      }
    }
  },
  created() {
    this.uuid = getUUID()
  },
  async mounted() {
    // if (this.echartType === 'map') {
    //   const res = await require('@/utils/dataStatistics/profilingData/optionsPutAreaZhejiang')
    //   const featuresList = [...new Set([...res.features])]
    //   const features = []
    //   featuresList.map(item => {
    //     features.push(deepClone(item))
    //   })
    //   // 配置注册地图
    //   echarts.registerMap('zhejiang', {
    //     'type': 'FeatureCollection',
    //     features,
    //     'UTF8Encoding': true
    //   })
    // }

    // 开始准备实例
    this.myChart = echarts.init(this.$refs[this.uuid])
    // 开始应用用户所需的配置项
    this.myChart.setOption(this.options)
    // legend选择事件
    this.myChart.on('legendselectchanged', (param) => {
      this.$emit('legendselectchanged', param)
    })

    // 地图切换事件
    if (this.clickEventType && this.clickEventType.length) {
      this.clickEventType.map(item => {
        this.myChart.on(item.type, (e) => {
          this.$emit(item.func, e)
        })
      })
    }
  }
}
</script>
