const getArrByKey = (data, k) => {
  const key = k || 'value'
  const res = []
  if (data) {
    data.forEach(function(t) {
      res.push(t[key])
    })
  }
  return res
}
const opt = {
  index: 0
}
const color = ['#FC619D', '#FF904D', '#48BFE3']

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return num
}

// export default option
export function myfun(data) {
  return {
    grid: {
      top: '2%',
      bottom: '2%',
      right: '0%',
      left: '0%',
      containLabel: true
    },
    xAxis: {
      show: false
    },
    yAxis: [{
      triggerEvent: true,
      show: true,
      inverse: true,
      data: getArrByKey(data, 'name'),
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        color: 'white',
        align: 'right',
        margin: 10,
        fontSize: 13,
        formatter: function(value, index) {
          if (opt.index === 0 && index < 3) {
            return '{idx' + index + '|} {title|' + value + '}'
          } else if (opt.index !== 0 && (index + opt.index) < 9) {
            return '{idx|0} {title|' + value + '}'
          } else {
            return '{idx|} {title|' + value + '}'
          }
        },
        rich: {
          idx: {
            color: 'white',
            borderRadius: 100,
            padding: [5, 8]
          },
          title: {
            width: 165
          }
        }
      }
    }, {
      triggerEvent: true,
      show: true,
      inverse: true,
      data: getArrByKey(data, 'name'),
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        color: '#666',
        align: 'left',
        margin: 20,
        fontSize: 13,
        formatter: function(value, index) {
          return data[index].value + '次'
        }
      }
    }],
    series: [{
      name: '条',
      type: 'bar',
      yAxisIndex: 0,
      data: data,
      barWidth: 10,
      itemStyle: {
        color: (val) => {
          if (val.dataIndex < 3 && opt.index === 0) {
            return color[val.dataIndex]
          } else {
            return '#1990FF'
          }
        },
        barBorderRadius: 30
      }
    }]
  }
}
