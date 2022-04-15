import * as echarts from 'echarts'
const option = {
  grid: {
    top: '16%',
    bottom: '27%'// 也可设置left和right设置距离来控制图表的大小
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      label: {
        show: true
      }
    }
  },
  legend: {
    data: ['用户量'],
    textStyle: {
      color: '#ffffff',
      fontSize: 12
    }
  },
  xAxis: {
    data: [],
    axisLine: {
      show: true, // 隐藏X轴轴线
      lineStyle: {
        color: '#01FCE3'
      }
    },
    axisTick: {
      show: true // 隐藏X轴刻度
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#ebf8ac' // X轴文字颜色
      }
    }

  },
  yAxis: [{
    type: 'value',
    nameTextStyle: {
      color: '#ebf8ac'
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: true
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#FFFFFF'
      }
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#ebf8ac'
      }
    }

  },

  {
    type: 'value',
    gridIndex: 0,
    min: 50,
    max: 100,
    splitNumber: 8,
    splitLine: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
      }
    }
  }
  ],
  series: [
    {
      name: '用户量',
      type: 'bar',
      barWidth: 10,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#00FFE3'
          },
          {
            offset: 1,
            color: '#4693EC'
          }
          ])
        }
      },
      data: []
    }
  ]
}

export default option

// export function initUserHistoryData(dataObj) {
//   this.option.xAxis.data = dataObj.xAxis
//   this.option.series[0].data = dataObj.series
//   console.log('@@@@@@@@@@@@@@@@@@', option)
//   return this.option
// }
