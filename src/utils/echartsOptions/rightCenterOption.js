
// 数据初始化
const fontColor = 'white'
const echartData = [{
  name: '总换电量',
  value: 100
},
{
  name: '当日换电量',
  value: 200
}
]
const echartDataPercent = (100 * 100 / 300).toFixed(0) + '%'
// option
const option = {
  // backgroundColor: '#FFFFFF',
  color: ['#06FDBC', '#F6FE05', '#07B0FE', '#FDB408', '#00DB1C', '#0188FE'],
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  title: [{
    text: '',
    // text: '评分总人数',
    top: '78%',
    textAlign: 'center',
    left: '50%',
    textStyle: {
      color: fontColor,
      fontSize: 12,
      fontWeight: '400'
    }
  }, {
    text: echartDataPercent,
    top: '40%',
    textAlign: 'center',
    left: '40%',
    textStyle: {
      color: fontColor,
      fontSize: 12,
      fontWeight: '400'
    }
  }],
  legend: {
    left: 142,
    top: 48,
    data: echartData.forEach(item => item.name),
    align: 'left',
    textStyle: {
      color: fontColor,
      fontSize: 10,
      fontWeight: '100'
    }
  },
  toolbox: {
    show: false
  },
  series: [{
    name: '',
    type: 'pie',
    radius: [30, 45],
    center: ['43%', '45%'],
    label: {
      normal: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        shadowBlur: 10,
        shadowColor: 'rgba(24,219,159,0.6)'
      }
    },
    hoverAnimation: false,
    hoverOffset: 5,
    data: echartData
  }]
}

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


// export default option
export function myfun(data) {
  return {
     // backgroundColor: '#FFFFFF',
  color: ['#06FDBC', '#F6FE05', '#07B0FE', '#FDB408', '#00DB1C', '#0188FE'],
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  title: [{
    text: '',
    // text: '评分总人数',
    top: '78%',
    textAlign: 'center',
    left: '50%',
    textStyle: {
      color: fontColor,
      fontSize: 12,
      fontWeight: '400'
    }
  }, {
    text: echartDataPercent,
    top: '40%',
    textAlign: 'center',
    left: '40%',
    textStyle: {
      color: fontColor,
      fontSize: 12,
      fontWeight: '400'
    }
  }],
  legend: {
    left: 142,
    top: 48,
    data: getArrByKey(data, 'name'),
    align: 'left',
    textStyle: {
      color: fontColor,
      fontSize: 10,
      fontWeight: '100'
    }
  },
  toolbox: {
    show: false
  },
  series: [{
    name: '',
    type: 'pie',
    radius: [30, 45],
    center: ['43%', '45%'],
    label: {
      normal: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        shadowBlur: 10,
        shadowColor: 'rgba(24,219,159,0.6)'
      }
    },
    hoverAnimation: false,
    hoverOffset: 5,
    data: data
  }]
}
}
