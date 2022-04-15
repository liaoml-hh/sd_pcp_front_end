// 数据进度值
const pieData = [{
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
}]
var option = {
  title: {
    show: true,
    text: '任务进度',
    x: '50%',
    y: '57%',
    z: 8,
    textAlign: 'center',
    textStyle: {
      color: '#f1f7fe',
      fontSize: 20,
      fontWeight: 'normal'
    }

  },
  // angleAxis: {
  //   // startAngle: 90
  // },
  series: [{
    type: 'pie',
    center: ['50%', '31%'],
    radius: ['24%', '45%'],
    clockwise: true,
    zlevel: 0,
    avoidLabelOverlap: true,
    hoverOffset: 15,
    itemStyle: {
      normal: {
        color: function(params) {
          return pieData.map(item => item.itemStyle.color)
        },
        opacity: 1
      }
    },
    label: {
      show: true,
      position: 'outside',
      formatter: '{a|{b}：{d}%}{hr|}',
      normal: {
        opacity: 1
      },
      rich: {
        hr: {
          backgroundColor: 't',
          borderRadius: 3,
          width: 3,
          height: 3,
          padding: [3, 3, 0, -12]
        },
        a: {
          padding: [-30, 15, -20, 15]
        }
      }
    },
    labelLine: {
      normal: {
        length: 20,
        length2: 30,
        lineStyle: {
          width: 1
        }
      }
    },
    startAngle: 200,
    data: pieData
  }
  ]
}
export default option
