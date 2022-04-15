
export function initLeftTopRadioOption(data) {
  var titleArr = []
  var seriesArr = []
  const colors = [
    ['#389af4', '#dfeaff'],
    ['#ff8c37', '#ffdcc3'],
    ['#ffc257', '#ffedcc']
  ]
  data.forEach(function(item, index) {
    titleArr.push({
      text: item.name,
      left: index === 0 ? '20%' : index === 1 ? '50%' : index === 2 ? '80%' : '90%',
      top: '10%',
      textAlign: 'center',
      textStyle: {
        fontWeight: 'normal',
        fontSize: '16',
        color: colors[index][0],
        textAlign: 'center'
      }
    })
    seriesArr.push({
      name: item.name,
      type: 'pie',
      left: '-10%',
      clockWise: false,
      radius: [35, 40],
      itemStyle: {
        normal: {
          color: colors[index][0],
          shadowColor: colors[index][0],
          shadowBlur: 0,
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      },
      hoverAnimation: false,
      center: [(index + 1) * 28 + '%', '45%'],
      data: [
        {
          value: item.value,
          label: {
            normal: {
              formatter: function(params) {
                if (index === 2) {
                  return params.value + '%'
                } return params.value
              },
              position: 'center',
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold',
                color: colors[index][0]
              }
            }
          }
        },
        {
          value: 100 - item.value,
          name: 'invisible',
          itemStyle: {
            normal: {
              color: colors[index][1]
            },
            emphasis: {
              color: colors[index][1]
            }
          }
        }
      ]
    })
  })
  const option = {
    title: titleArr,
    series: seriesArr
  }
  return option
}

