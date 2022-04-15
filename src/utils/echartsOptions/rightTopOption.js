// var colorList = ['#73DDFF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF']
// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
  // 计算
  const midRatio = (startRatio + endRatio) / 2

  const startRadian = startRatio * Math.PI * 2
  const endRadian = endRatio * Math.PI * 2
  const midRadian = midRatio * Math.PI * 2

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== 'undefined' ? k : 1 / 3

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
  const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  const hoverRate = isHovered ? 1.05 : 1
  const pieSize = 0.8
  // 返回曲面参数方程
  return {

    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32
    },

    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20
    },

    x: function(u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (pieSize + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (pieSize + Math.cos(v) * k) * hoverRate
      }
      return offsetX + Math.cos(u) * (pieSize + Math.cos(v) * k) * hoverRate
    },

    y: function(u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (pieSize + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (pieSize + Math.cos(v) * k) * hoverRate
      }
      return offsetY + Math.sin(u) * (pieSize + Math.cos(v) * k) * hoverRate
    },

    z: function(u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u)
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1
      }
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1
    }
  }
}

// 生成模拟 3D 饼图的配置项
function getPie3D(pieData, internalDiameterRatio) {
  const series = []
  let sumValue = 0
  let startValue = 0
  let endValue = 0
  const legendData = []
  const k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3

  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < pieData.length; i++) {
    sumValue += pieData[i].value

    const seriesItem = {
      name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
      type: 'surface',
      zlevel: 1,
      parametric: true,
      wireframe: {
        show: false
      },
      pieData: pieData[i],
      pieStatus: {
        selected: false,
        hovered: false,
        k: k
      }
    }

    if (typeof pieData[i].itemStyle !== 'undefined') {
      const itemStyle = {}

      typeof pieData[i].itemStyle.color !== 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null
      typeof pieData[i].itemStyle.opacity !== 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null

      seriesItem.itemStyle = itemStyle
    }
    series.push(seriesItem)
  }

  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value

    series[i].pieData.startRatio = startValue / sumValue
    series[i].pieData.endRatio = endValue / sumValue
    series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, series[i].pieData.value)

    startValue = endValue

    legendData.push(series[i].name)
  }

  // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
  series.push({
    name: 'mouseoutSeries',
    type: 'surface',
    parametric: true,
    wireframe: {
      show: true
    },
    itemStyle: {
      opacity: 0
    },
    parametricEquation: {
      u: {
        min: 0,
        max: Math.PI * 80,
        step: Math.PI / 60
      },
      v: {
        min: 0,
        max: Math.PI,
        step: Math.PI / 60
      },
      x: function(u, v) {
        return Math.sin(v) * Math.sin(u) + Math.sin(u)
      },
      y: function(u, v) {
        return Math.sin(v) * Math.cos(u) + Math.cos(u)
      },
      z: function(u, v) {
        return Math.cos(v) > 0 ? 0.1 : -0.1
      }
    }
  })
  const pieData2 = pieData.map(item => {
    return { name: item.name, value: item.value, itemStyle: { color: item.itemStyle.color }}
  })
  pieData2.reverse()
  // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
  series.push({
    name: 'pie',
    type: 'pie',
    center: ['54%', '50%'],
    radius: ['45%', '50%'],
    clockwise: true,
    zlevel: -1,
    avoidLabelOverlap: true,
    hoverOffset: 15,
    itemStyle: {
      normal: {
        color: function(params) {
          return pieData2.map(item => item.itemStyle.color)
        },
        opacity: 0
      }
    },
    label: {
      show: true,
      // position: 'outside',
      formatter: (params) => {
        console.log(params)
        return '{b| ' + params.name + '}  ' + '{c|' + params.percent.toFixed(0) + '%}'
      },
      padding: [0, -30],
      height: 38,
      opacity: 1,
      // normal: {

      // },
      rich: {
        b: {
          fontSize: 16,
          lineHeight: 10,
          color: '#41B3DC',
          padding: [0, 0, 0, 0]
        },
        c: {
          fontSize: 16,
          lineHeight: 20,
          color: 'orange'
        }

      }
    },
    labelLine: {
      normal: {
        length: 20,
        length2: 30,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      }
    },
    startAngle: 315,
    data: pieData2
  })

  // 准备待返回的配置项，把准备好的 legendData、series 传入。
  const option = {
    // animation: false,
    // legend: {
    //   data: legendData
    // },
    tooltip: {
      formatter: params => {
        if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie') {
          return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}`
        }
      }
    },
    left: '10%',
    top: '10%',
    xAxis3D: {
      min: -1,
      max: 0.7
    },
    yAxis3D: {
      min: -1,
      max: 0.7
    },
    zAxis3D: {
      min: -1,
      max: 1
    },
    grid3D: {
      show: false,
      boxHeight: 9,
      left: '-0%',
      top: '-2%',
      viewControl: { // 3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 40,
        // beta: 40,
        rotateSensitivity: 0,
        zoomSensitivity: 0,
        panSensitivity: 0,
        autoRotate: false
      },
      // 后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果。可以让整个画面更富有质感。
      postEffect: { // 配置这项会出现锯齿，请自己去查看官方配置有办法解决
        enable: true,
        bloom: {
          enable: true,
          bloomIntensity: 0.1
        },
        SSAO: {
          enable: true,
          quality: 'medium',
          radius: 2
        }
      }
    },
    series: series
  }
  return option
}
// 传入数据生成 option
const option = getPie3D([{
  name: 'aa',
  value: 37,
  itemStyle: {
    color: '#f77b66'
  }
}, {
  name: 'bb',
  value: 44,
  itemStyle: {
    color: '#3edce0'
  }
}, {
  name: 'cc',
  value: 32,
  itemStyle: {
    color: '#f94e76'
  }
}, {
  name: 'dd',
  value: 16,
  itemStyle: {
    color: '#018ef1'
  }
}, {
  name: 'ee',
  value: 23,
  itemStyle: {
    color: '#9e60f9'
  }
}], 0.76)
// export default option
export default getPie3D

