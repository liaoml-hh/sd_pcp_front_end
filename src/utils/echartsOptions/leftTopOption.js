export function initLeftTopOption(data) {
  const colorList = ['#0adbfa', '#febe13', '#7b2cff', '#fd5151', '#f071ff', '#2ca1ff', '#65e5dd', '#85f67a']

  const option = {
    legend: {
      icon: 'circle',
      top: '0%',
      right: '5%',
      itemWidth: 6,
      itemGap: 20,
      textStyle: {
        color: 'white'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        label: {
          show: true,
          backgroundColor: 'rgba(52,134,218,.5)',
          color: '#556677',
          borderColor: 'rgba(0,0,0,0)',
          shadowColor: 'rgba(0,0,0,0)',
          shadowOffsetY: 0
        },
        lineStyle: {
          width: 0
        }
      },
      backgroundColor: 'rgba(1,75,132,.8)',
      borderColor: 'rgba(0,0,0,0)',
      textStyle: {
        color: 'white'
      },
      padding: [10, 10]
    // extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
    },
    grid: {
      top: '15%',
      bottom: '10%'
    },
    bottom: '0',
    xAxis: [{
      type: 'category',
      data: data.xAxisData,
      axisLine: {
        lineStyle: {
          color: '#3486DA' // x轴颜色
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: 'white' // 坐标轴字颜色
        },
        margin: 40
      },
      axisPointer: {
        label: {
          padding: [11, 5, 7],
          backgroundColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#fff' // 0% 处的颜色
            }, {
              offset: 0.9,
              color: '#fff' // 0% 处的颜色
            }, {
              offset: 0.9,
              color: '#33c0cd' // 0% 处的颜色
            }, {
              offset: 1,
              color: '#33c0cd' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      },
      boundaryGap: false
    }],
    yAxis: [{
      type: 'value',
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#3486DA' // y轴颜色
        }
      },
      axisLabel: {
        textStyle: {
          color: 'white'
        }
      },
      splitLine: {
        show: false
      }
    }],
    series: [
      {
        name: '站点创建历史',
        type: 'line',
        data: data.seriesV1,
        symbolSize: 1,
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        showSymbol: false,
        itemStyle: {
          normal: {
            color: colorList[1],
            borderColor: colorList[1]
          }
        }
      }
      // {
      //   name: '规划2',
      //   type: 'line',
      //   data: [45, 32, 21, 18, 55, 16, 10, 15, 18, 45, 57, 44],
      //   symbolSize: 1,
      //   symbol: 'circle',
      //   smooth: true,
      //   yAxisIndex: 0,
      //   showSymbol: false,
      //   itemStyle: {
      //     normal: {
      //       color: colorList[1],
      //       borderColor: colorList[1]
      //     }
      //   }
      // }
    ]
  }
  return option
}
