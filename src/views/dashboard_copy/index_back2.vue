<template>

  <div>
    <div style="height:100%;width:100%;background-color:rgb(8,12,60)">
      <div style="height:1000px;width:100%">
        <div style="height:230px">
          <el-row>
            <el-col :span="8">
              <div style="display:flex;justify-content: space-between;">
                <div class="div1">
                  <div style="text-align:center;font-size:30px;margin-top:5px;color:#00D2EF">1,423,92度</div>
                  <div style="text-align:center;font-size:15px;margin-top:5px;color:#F7D878">累计换电度数</div>
                </div>
                <div class="div1">

                  <div style="text-align:center;font-size:30px;margin-top:5px;color:#00D2EF">3392吨</div>
                  <div style="text-align:center;font-size:15px;margin-top:5px;color:#F7D878">减少碳排放量</div>
                </div>
                <div />
              </div>
            </el-col>
            <el-col :span="8">
              <div style="display:flex;justify-content: space-between;">
                <div class="out">
                  <div style="text-align:center;font-size:15px;margin-top:5px;color:#FFFFFF">累计收入数据</div>
                  <div style="text-align:center;font-size:15px;margin-top:5px;color:#00D2EF">{{ totalincome }}</div>
                  <div style="text-align:center;font-size:11px;margin-top:5px;color:#00D2EF">元</div>

                </div>
                <div class="out">
                  <div style="text-align:center;font-size:15px;margin-top:5px;color:#FFFFFF">当日收入数据</div>
                  <div style="text-align:center;font-size:15px;margin-top:5px;color:#00D2EF">{{ todayincome }}</div>
                  <div style="text-align:center;font-size:11px;margin-top:5px;color:#00D2EF">元</div>
                </div>
                <div />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="pie">
                <div id="pie1" style="width:400px">
                  <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
                  <div id="main1" style="float:left;width:100%;height: 180px;" />
                </div>
              </div>
            </el-col>
          </el-row>
          <div style="height:240px">
            <el-row>
              <el-col :span="8">
                <div>
                  <div id="OverYearsPompanyChart" :style="{width: '250%', height: '230%'}" />
                </div>

              </el-col>
              <el-col :span="8">1</el-col>
              <el-col :span="8">
                <div style="width:100%;padding:50px 50px 50px 50px">
                  <div style="float:left ;line-height: 35px; width:70%; height:100%;">
                    <div style="color:#C0C1CD">换电量客流</div>
                    <div>
                      <div style="float:left ;width:50%;color:#9596A1;font-size:11px;">今日换电流量</div>
                      <div style="float:left ;width:50%;color:#AA3869;font-size:11px;">{{ todayappointment }}  次</div>
                    </div>

                    <div>
                      <div style="float:left ;width:50%;color:#9596A1;font-size:11px;">今日预约量</div>
                      <div style="float:left ;width:50%;color:#F7D878;font-size:11px;">{{ todayreserved }}  次</div>
                    </div>
                    <div>
                      <div style="float:left ;width:50%;color:#9596A1;font-size:11px;">上周换电总量</div>
                      <div style="float:left ;width:50%;color:#01D9F8;font-size:11px;">{{ lastweekmount }}  次</div>
                    </div>
                  </div>
                  <div style=" float:left ;width:30%; height:100%;margin-top:-80px;;margin-left:-100px;">
                    <div id="myChartedSpeed" style="width: 300px;height: 300px" />
                  </div>
                </div>

              </el-col>
            </el-row>
          </div>
          <div style="height:230px">
            <el-row>
              <el-col :span="8">
                <div class="mychart">
                  <div id="stationHistoricalData" :style="{width: '350px', height: '250px',}" />
                  <div id="stationHistoricalData_buttom" :style="{width: '300px', height: '100px',}" />
                </div>
              </el-col>
              <el-col :span="8">1</el-col>
              <el-col :span="8">
                <div class="mychart">
                  <div id="myChart" :style="{width: '350px', height: '250px',}" />
                </div>
              </el-col>
            </el-row>
          </div>

        </div>
      </div>

    </div>

  </div>

</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
const echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import { allsumprice, todaysumprice } from '../../api/exchangeOrder/index'
import { stationdistribute, countenablestation } from '../../api/station/station'
import { userdistribute } from '../../api/user/index'
import { yearweekappointment, todayappointment, todayreserved, countallpower } from '../../api/apply/apply'
const colors = [
  ['rgba(240, 7, 100, 1)', 'rgba(0, 215, 229, 1)'],
  ['rgba(240, 7, 100, 1)', 'rgba(0, 215, 229, 1)'],
  ['rgba(240, 7, 100, 1)', 'rgba(0, 215, 229, 1)'],
  ['rgba(240, 7, 100, 1)', 'rgba(0, 215, 229, 1)']
]
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      totalincome: '', // 累计收入
      todayincome: '', // 当日收入
      provincelist: [], // 省
      datalist: [], // 区域站点数量和省
      useramount: [], // 用户数量
      countdata: [], // 用户数量月份
      lastweekmount: '', // 上周换电总量
      todayappointment: '', // 今日换电流量
      todayreserved: ',', // 今日预约量
      historicalData: {
        yearLsit: [],
        countList: []
      },
      intervalHander: '',
      countenablestationList: []
    }
  },
  // 计算属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()// 初始化数据
    this.intervalHander = setInterval(() => {
      this.init()// 初始化数据
    }, 1000 * 60 * 5)
  },

  beforeDestroy() {
    clearInterval(this.intervalHander)
  }, // 生命周期 - 销毁之前

  // 方法集合
  methods: {
    init() {
      // 查询累计收入数据
      this.initmyChartedSpeed()
      this.stationHistoricalDataButtom()
      allsumprice().then(response => {
        this.totalincome = response// 分页信息带回显示
      }).catch(() => {
        this.$message.error('网络异常')
      })
      // 查询当日换电流量

      todayappointment().then(response => {
        this.todayappointment = response
        if (response === undefined) {
          this.todayappointment = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      })
      // 查询今日预约量

      todayreserved().then(response => {
        this.todayreserved = response
        if (response === undefined) {
          this.todayreserved = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      })
      // 查询当日收入数据

      todaysumprice().then(response => {
        this.todayincome = response
        if (response === undefined) {
          this.todayincome = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      })
      // 查询上周换电总量

      yearweekappointment().then(response => {
        this.lastweekmount = response
        if (response === undefined) {
          this.todayincome = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      })

      userdistribute().then(res => {
        this.countdata.length = 0
        this.useramount.length = 0
        res.data.map(item => {
          this.countdata.push(item.countDate)
          this.useramount.push(item.userCount)
          this.userdistribute()
        })
      }).catch(() => {
        this.$message.error('网络异常')
      })

      stationdistribute().then(res => {
        this.datalist.length = 0
        res.data.map(item => {
          this.provincelist.push(item.areaVO.city)
          const { stationCount: value } = item
          this.datalist.push({ value, name: item.areaVO.city })
        })
        this.stationdistribute()
      }).catch(() => {
        this.$message.error('网络异常')
      })

      countallpower().then(res => {
        if (res.data.length !== 0) {
          this.historicalData.yearLsit.length = 0
          this.historicalData.countList.length = 0
          let all = 0
          res.data.map(item => {
            all = all + item.count
            this.historicalData.yearLsit.push({ value: item.year })
            this.historicalData.countList.push(item.count)
          })
          this.historicalData.yearLsit.unshift({ value: '累计换电次数' })
          this.historicalData.countList.unshift(all)
          this.countallpower()
        }
      }).catch(error => {
        console.log(error)
      })
      countenablestation().then(res => {
        this.countenablestationList.length = 0
        res.data.map(item => {
          this.countenablestationList.push({ name: item.yearTime, value: item.countEnableStation })
        })
        this.stationHistoricalData()
      }).catch(error => {
        console.log(error)
      })
    },

    stationdistribute() {
      // 基于准备好的dom，初始化echarts实例

      var myChart = echarts.init(document.getElementById('main1'))
      // 绘制图表
      myChart.setOption({
        title: {
          // top: -15,
          text: '城市未来布局', // 主标题
          // subtext: '纯属虚构', // 副标题
          x: 'center' // x轴方向对齐方式
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: 23,
          orient: 'horizontal',
          bottom: 'bottom',
          textStyle: { color: '#C0C0C0' },
          data: this.provincelist
        },
        series: [
          {

            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.datalist,
            itemStyle: {
              normal: {
                label: {
                  textStyle: {
                    color: '#C0C0C0'
                  }
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }

          }
        ]
      })
    },
    userdistribute() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '用户数量' },
        tooltip: {},
        xAxis: {
          data: this.countdata
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          barWidth: 10,
          data: this.useramount
        }]
      })
    },
    countallpower() {
      var myChart = this.$echarts.init(document.getElementById('OverYearsPompanyChart'))
      const option = {
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          width: 260
        },

        xAxis: {
          type: 'value',
          show: false,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#02CFFCFF'
            }
          }
        },
        yAxis: [
          {
            inverse: true, // 倒叙
            axisLabel: {
              color: '#02CFFCFF'
            },
            // data: [{ value: '累计换电次数' }, { value: '2021年' }, { value: '2020年' }]
            data: this.historicalData.yearLsit

          }
        ],
        series: [
          {
            type: 'bar',
            barWidth: 12,
            // data: [2, 13, 13],
            data: this.historicalData.countList,
            itemStyle: {
              normal: {
                color(params) {
                  const { dataIndex } = params
                  const color = {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: colors[dataIndex] ? colors[dataIndex][0] : 'red'
                      },
                      {
                        offset: 1,
                        color: colors[dataIndex] ? colors[dataIndex][1] : 'red'
                      }
                    ]
                  }
                  return color
                },

                label: {
                  show: true, // 开启显示
                  position: 'right',
                  textStyle: { // 数值样式
                    color: '#00D2EF',
                    fontSize: 16
                  }
                }
              }

            }
          }
        ]
      }
      myChart.setOption(option)
    },
    initmyChartedSpeed() {
      // 基于准备好的dom，初始化echarts实例

      var chartDom = document.getElementById('myChartedSpeed')
      var myChart = echarts.init(chartDom)
      const num = 0
      const option = {
        backgroundColor: 'rgba(8,12,66,.1)',
        title: [
          // {
        //   text: 'SPEED',
        //   x: 'center',
        //   top: '52%',
        //   textStyle: {
        //     color: '#fdf914',
        //     fontSize: 20,
        //     fontWeight: '100'
        //   }
        // },
          {
            text: '60%',
            x: 'center',
            top: '42%',
            textStyle: {
              fontSize: '10',
              color: '#fdf914',
              fontFamily: 'Lato',
              foontWeight: '600'
            }
          }],
        polar: {
          radius: ['44%', '50%'],
          center: ['50%', '50%']
        },
        angleAxis: {
          max: 100,
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false

          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '',
            type: 'bar',
            roundCap: true,
            barWidth: 60,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(66, 66, 66, .3)'
            },
            data: [60],
            coordinateSystem: 'polar',

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#fdf914'
                }, {
                  offset: 1,
                  color: '#38a700'
                }])
              }
            }

          },
          {
            type: 'gauge',
            name: '',
            radius: '57%',
            startAngle: '0',
            endAngle: '-359.99',
            splitNumber: '200',
            center: ['50%', '50%'],
            pointer: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              show: false
            },
            data: [{
              value: 95,
              name: ''
            }],
            axisLine: {
              lineStyle: {
                width: 20,
                opacity: 0
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              length: 13,
              lineStyle: {
                color: {
                  type: 'linear',
                  x: 1,
                  y: 0,
                  x2: 0,
                  y2: 0,
                  colorStops: [{
                    offset: 0,
                    color: '#111'
                  }, {
                    offset: 0.5,
                    color: 'rgba(66, 66, 66, 1)'
                  }, {
                    offset: 1,
                    color: '#111'
                  }],
                  globalCoord: false
                },
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              show: false
            }
          },
          {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: ['60%', '62%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
              normal: {
                labelLine: {
                  show: false
                },
                color: 'rgba(66, 66, 66, .4)',
                shadowBlur: 10,
                shadowColor: 'rgba(253, 249, 20, .3)'
              }
            },
            data: [{
              value: 100

            }]
          },
          {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: ['62.5%', '64%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
              normal: {
                labelLine: {
                  show: false
                },
                color: 'rgba(66, 66, 66, .3)',
                shadowBlur: 10,
                shadowColor: 'rgba(253, 249, 20, .3)'
              }
            },
            data: [{
              value: 100

            }]
          },
          {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: ['64.5%', '65.8%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
              normal: {
                labelLine: {
                  show: false
                },
                color: 'rgba(66, 66, 66, .2)',
                shadowBlur: 10,
                shadowColor: 'rgba(253, 249, 20, .3)'
              }
            },
            data: [{
              value: 100

            }]
          },
          {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: ['66.5%', '67.5%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
              normal: {
                labelLine: {
                  show: false
                },
                color: 'rgba(66, 66, 66, .1)',
                shadowBlur: 10,
                shadowColor: 'rgba(253, 249, 20, .3)'
              }
            },
            data: [{
              value: 100

            }]
          },
          {
            name: '',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function(params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.545,
                  startAngle: (0 + num) * Math.PI / 180,
                  endAngle: (1 + num) * Math.PI / 180
                },
                style: {
                  stroke: '#fdf914',
                  fill: 'transparent',
                  lineWidth: 5
                },
                silent: true
              }
            },
            data: [0]
          }
        ]
      }

      // function numb() {
      //   num = num + 5
      myChart.setOption(option, true)
      // }
      // setInterval(function() {
      //   numb()
      // }, 100)
    },

    stationHistoricalData() {
      var chartDom = document.getElementById('stationHistoricalData')
      var myChart = echarts.init(chartDom)

      var option = {
        title: {
          text: '历年换电站统计'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: 'Expected',
            type: 'funnel',
            left: '10%',
            width: '50%',
            labelLine: {
              show: false
            },
            itemStyle: {
              opacity: 0.7
            },
            data: this.countenablestationList
            // data: [
            //   { value: 60, name: 'Visit' },
            //   { value: 40, name: 'Inquiry' },
            //   { value: 20, name: 'Order' },
            //   { value: 80, name: 'Click' },
            //   { value: 100, name: 'Show' }
            // ]
          }
        ]
      }
      myChart.setOption(option)
    },
    stationHistoricalDataButtom() {
      var chartDom = document.getElementById('stationHistoricalData_buttom')
      var myChart = echarts.init(chartDom)
      const pieData = [
        {
          name: '总数量',
          value: 100
        },
        {
          name: '在线数量',
          value: 60
        },
        {
          name: '在线率',
          value: 40
        }
      ]
      var titleArr = []
      var seriesArr = []
      pieData.forEach(function(item, index) {
        titleArr.push({
          text: item.name,
          left: index * 35 + 15.5 + '%',
          top: '70%',
          textAlign: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: '10',
            color: 'white',
            textAlign: 'center'
          }
        })
        seriesArr.push(
          {
            type: 'pie',
            name: '外层细圆环',
            radius: ['36%', '37%'],
            center: [index * 34 + 15.5 + '%', '45%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: '#6e7175'
              }
            },
            label: {
              show: false
            },
            data: [100]
          },
          {
            type: 'pie',
            name: '内层层细圆环',
            radius: ['24%', '25%'],
            center: [index * 34 + 15.5 + '%', '45%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: '#6e7175'
              }
            },
            label: {
              show: false
            },
            data: [100]
          },
          {
            type: 'pie',
            zlevel: 3,
            silent: true,
            radius: ['20%', '21%'],
            center: [index * 34 + 15.5 + '%', '45%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: dotArr()
          }
        )
      })

      seriesArr.push(
        {
          name: pieData[0].name,
          type: 'pie',
          clockWise: false,
          radius: ['28%', '33%'],
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0ff'
                },
                {
                  offset: 1,
                  color: '#5467df'
                }
              ]),
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          center: [0 * 34 + 15.5 + '%', '45%'],
          data: [
            {
              value: pieData[0].value,
              label: {
                normal: {
                  formatter: function(params) {
                    return params.value
                  },
                  position: 'center',
                  show: true,
                  textStyle: {
                    fontSize: '10',
                    // fontWeight: 'bold',
                    color: '#1cc7ff'
                  }
                }
              }
            }
          ]
        },
        {
          name: pieData[1].name,
          type: 'pie',
          clockWise: false,
          radius: ['28%', '33%'],
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0ff'
                },
                {
                  offset: 1,
                  color: '#5467df'
                }
              ]),
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          center: [1 * 34 + 15.5 + '%', '45%'],
          data: [
            {
              value: pieData[1].value,
              label: {
                normal: {
                  formatter: function(params) {
                    return params.value
                  },
                  position: 'center',
                  show: true,
                  textStyle: {
                    fontSize: '10',
                    // fontWeight: 'bold',
                    color: '#1cc7ff'
                  }
                }
              }
            },
            {
              value: pieData[0].value - pieData[1].value,
              name: 'invisible',
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            }
          ]
        },
        {
          name: pieData[2].name,
          type: 'pie',
          clockWise: false,
          radius: ['28%', '33%'],
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0ff'
                },
                {
                  offset: 1,
                  color: '#5467df'
                }
              ]),
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          center: [2 * 34 + 15.5 + '%', '45%'],
          data: [
            {
              value: pieData[2].value,
              label: {
                normal: {
                  formatter: function(params) {
                    return params.value + '%'
                  },
                  position: 'center',
                  show: true,
                  textStyle: {
                    fontSize: '10',
                    // fontWeight: 'bold',
                    color: '#1cc7ff'
                  }
                }
              }
            },
            {
              value: 100 - pieData[2].value,
              name: 'invisible',
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            }
          ]
        }
      )
      const option = {
        grid: {
          left: '5%',
          right: '90%',
          bottom: '0%',
          top: '0%',
          containLabel: true
        },
        backgroundColor: 'rgba(0,0,0,0)',
        title: titleArr,
        series: seriesArr
      }

      function dotArr() {
        const dataArr = []
        for (var i = 0; i < 80; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 1,
              itemStyle: {
                normal: {
                  color: '#676a6c',
                  borderWidth: 1,
                  borderColor: '#676a6c'
                }
              }
            })
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 2,
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)', // rgb(8,12,60)
                  // color: 'rgba(8,12,60,.5)',
                  borderWidth: 0,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          }
        }
        return dataArr
      }
      myChart.setOption(option, true)
    }
  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
.mychart{
  margin-left: 50px;
}
.pie{
  margin-top:35px;
}
.out {
  margin-top: 30px;
            width: 150px;
            height: 70px;
            border: 2px solid rgb(11, 135, 175);
            border-image-slice: 10 10 10 10;
            border-image-width: 10px;
            border-image-repeat: round;
            border-radius: 13px;
        }
  .div1 {
            margin-top: 30px;
            width: 150px;
            height: 70px;
        }

</style>
