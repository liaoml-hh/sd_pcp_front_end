<template>
  <div>
    <div
      :ref="uuid"
      :style="style"
    />
    <!-- <div class="back" @click="back">返回</div> -->
  </div>

</template>

<script>
import * as echarts from 'echarts'
import AMapUI from 'AMapUI'
import { commonQueryStation } from '@/api/station/station'
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
    }
  },
  data() {
    return {
      uuid: null,
      myChart: null,
      geoJson: {},
      parentInfo: [{
        cityName: ' ',
        code: 100000
      }],
      currentIndex: 0,
      timeTitle: ['2015', '2016', '2017', '2018', '2019'],
      stationList: [],
      colorList: ['#D70002', '#00ff41']
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
  mounted() {
    // 第一步
    // this.init(100000)
    this.$bus.$emit('initLoad', true)
    this.initStationData()
  },
  methods: {
    back() {
      if (this.parentInfo.length === 1) {
        return
      }
      this.parentInfo.pop()
      this.init(this.parentInfo[this.parentInfo.length - 1].code)
    },
    init(adcode) {
      this.getGeoJson(adcode).then(data => {
        this.geoJson = data
        this.getMapData()
      })
    },
    getGeoJson(adcode, childAdcode = '') {
      return new Promise((resolve, reject) => {
        function insideFun(adcode, childAdcode) {
          AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
            var districtExplorer = new DistrictExplorer()
            districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
              if (error) {
                console.error(error)
                reject(error)
                return
              }
              let Json = areaNode.getSubFeatures()
              if (Json.length === 0) {
                const parent = areaNode._data.geoData.parent.properties.acroutes
                insideFun(parent[parent.length - 1], adcode)
                return
              }

              if (childAdcode) {
                Json = Json.filter(item => {
                  return item.properties.adcode === childAdcode
                })
              }
              const mapJson = {
                features: Json
              }
              resolve(mapJson)
            })
          })
        }
        insideFun(adcode, childAdcode)
      })
    },
    // 第二步
    getMapData() {
      let mapData = []
      const pointData = []
      let sum = 0
      this.geoJson.features.forEach(item => {
        const value = Math.random() * 3000
        mapData.push({
          name: item.properties.name,
          value: value,
          cityCode: item.properties.adcode
        })
        pointData.push({
          name: item.properties.name,
          value: [item.properties.center[0], item.properties.center[1], value],
          cityCode: item.properties.adcode
        })
        sum += value
      })
      mapData = mapData.sort(function(a, b) {
        return b.value - a.value
      })

      this.initEchartMap(mapData, sum, pointData)
    },

    initStationData() {
      commonQueryStation({ pageNum: 1, pageSize: 10000 }).then(res => {
        res.data.map(item => {
          let obj = {
            cityCode: String(item.id),
            name: item.name,
            _status: item.status,
            value: [item.longitude, item.latitude, Math.random() * 10000]
          }
          this.stationList.push(obj)
        })
        this.init(100000)
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
    },
    // 第三步
    initEchartMap(mapData, sum, pointData) {
      var xData = []
      var yData = []
      var min = mapData[mapData.length - 1].value
      var max = mapData[0].value
      if (mapData.length === 1) {
        min = 0
      }
      mapData.forEach(c => {
        xData.unshift(c.name)
        yData.unshift(c.value)
      })
      // 这里做个切换，全国的时候才显示南海诸岛  只有当注册的名字为china的时候才会显示南海诸岛
      echarts.registerMap(this.parentInfo.length === 1 ? 'china' : 'map', this.geoJson)
      var option = {
        baseOption: {
          // backgroundColor: '#012248',
          title: [{
            left: 'center',
            top: 160,
            text: this.parentInfo[this.parentInfo.length - 1].cityName + '全国站点分布图',
            textStyle: {
              color: 'rgb(179, 239, 255)',
              fontSize: 16
            }
          },
          {

            left: 'center',
            top: 190,
            textStyle: {
              color: '#FFAC50',
              fontSize: 26
            }
          }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            right: '2%',
            top: '12%',
            bottom: '8%',
            width: '20%'
          },
          geo: {
            map: this.parentInfo.length === 1 ? 'china' : 'map',
            zoom: 1,
            roam: false,
            left: '40%',
            top: '20%',
            tooltip: {
              trigger: 'item',
              formatter: (p) => {
                let val = p.value[2]
                if (window.isNaN(val)) {
                  val = 0
                }
                const txtCon =
                  "<div style='text-align:left'>" + p.name + '<br />' + '' + '</div>'

                return txtCon
              }
            },
            label: {
              normal: {
                show: true,
                color: 'rgb(249, 249, 249)', // 省份标签字体颜色
                formatter: p => {
                  switch (p.name) {
                    case '内蒙古自治区':
                      p.name = '内蒙古'
                      break
                    case '西藏自治区':
                      p.name = '西藏'
                      break
                    case '新疆维吾尔自治区':
                      p.name = '新疆'
                      break
                    case '宁夏回族自治区':
                      p.name = '宁夏'
                      break
                    case '广西壮族自治区':
                      p.name = '广西'
                      break
                    case '香港特别行政区':
                      p.name = '香港'
                      break
                    case '澳门特别行政区':
                      p.name = '澳门'
                      break
                  }
                  return p.name
                }
              },
              emphasis: {
                show: true,
                color: '#f75a00'
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#24CFF4',
                borderColor: '#53D9FF',
                borderWidth: 1.3,
                shadowBlur: 15,
                shadowColor: 'rgb(58,115,192)',
                shadowOffsetX: 7,
                shadowOffsetY: 6
              },
              emphasis: {
                areaColor: '#8dd7fc',
                borderWidth: 1.6,
                shadowBlur: 25
              }

            }
          },
          series: [
            {
              type: 'map',
              geoIndex: 0,
              map: this.parentInfo.length === 1 ? 'china' : 'map',
              roam: true,
              zoom: 1.3,
              tooltip: {
                trigger: 'item',
                formatter: p => {
                  let val = p.value
                  if (p.name === '南海诸岛') return
                  if (window.isNaN(val)) {
                    val = 0
                  }
                  const txtCon =
                     "<div style='text-align:left'>" + p.name + '<br />' + '' + '</div>'
                  // "<div style='text-align:left'>" + p.name + ':<br />销售额：' + val.toFixed(2) + '万</div>'
                  return txtCon
                }
              },
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              data: mapData

            },
            {
              name: '散点',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              rippleEffect: {
                brushType: 'fill'
              },
              itemStyle: {
                normal: {
                  // color: '#d3d1b4',
                  color: '#24cff4',
                  shadowBlur: 10,
                  // shadowColor: '#333'
                  shadowColor: '#24cff4'
                }
              },
              data: pointData,
              symbolSize: function(val) {
                const value = val[2]
                if (value === max) {
                  return 27
                }
                return 10
              },
              showEffectOn: 'render' // 加载完毕显示特效
            },
            {
              name: '散点',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              rippleEffect: {
                brushType: 'fill'
              },
              itemStyle: {
                normal: {
                  // color: '#00ff41',
                  color: (val) => {
                    var res = this.colorList[val.data._status]

                    return res
                  },
                  shadowBlur: 10,
                  shadowColor: '#c4fccf'
                }
              },
              data: this.stationList,
              symbolSize: function(val) {
                const value = val[2]
                if (value === max) {
                  return 27
                }
                return 10
              },
              showEffectOn: 'render' // 加载完毕显示特效
            }
          ]
        }
      }

      // 开始准备实例
      this.myChart = echarts.init(this.$refs[this.uuid])
      this.myChart.setOption(option, true)

      // 点击前解绑，防止点击事件触发多次
      this.myChart.off('click')
      this.myChart.on('click', this.echartsMapClick)

      // 监听时间切换事件
      this.myChart.off('timelinechanged')
      this.myChart.on('timelinechanged', params => {
        this.currentIndex = params.currentIndex
        this.getMapData()
      })
    },
    echartsMapClick(params) {
      if (params.data.cityCode.length <= 20) {
        this.$router.push({ path: '/pcp/monitor/pcpmonitor', query: { sk: params.data.cityCode }})
      }
      if (!params.data) {
        return
      } else {
        if (params) {
          return
        }
        // 如果当前是最后一级，那就直接return
        if (this.parentInfo[this.parentInfo.length - 1].code === params.data.cityCode) {
          return
        }
        const data = params.data
        this.parentInfo.push({
          cityName: data.name,
          code: data.cityCode
        })
        this.init(data.cityCode)
      }
    }
  }
}
</script>
<style lang="scss" scope>
  .back{
    position: absolute;
    top: 230px;
    left: 33%;
    color: rgb(179, 239, 255);
    font-size: 16px;
    cursor: pointer;
    z-index: 100;
  }
</style>
