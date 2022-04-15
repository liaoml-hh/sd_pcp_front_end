/**
 * 去除日志打印
 */
// window.console.log = function() {}

import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/index.scss' // global css
import PrintJS from '@/utils/print.js'
import VueQrcode from '@chenfengyuan/vue-qrcode'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import dataV from '@jiaminghi/data-view'
import axios from 'axios'
// 将全局的echarts对象挂载到Vue的原型对象上
import * as Echarts from 'echarts'
import ElementUI from 'element-ui'
import { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'github-markdown-css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 图片预览
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Vue from 'vue'
import AMap from 'vue-amap'
// 滑动验证登录
import SlideVerify from 'vue-monoplasty-slide-verify'
// 打印组件
import Print from 'vue-print-nb'
// 二维码
import VueQriously from 'vue-qriously'
// 文件上传组件
import uploader from 'vue-simple-uploader'
import App from './App'
import './assets/iconfont/iconfont.css'
import router from './router'
import store from './store'
import './utils/dialogdrap'
// const app = Vue.createApp({})
// md文件样式
import Highlight from './utils/height'
Vue.use(AMap)
Vue.use(dataV)

// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: 'c3be495a4ada32b182278d986c45d875',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Geolocation']
})
Vue.use(SlideVerify)
Vue.use(uploader)
Vue.use(Viewer)
Viewer.setDefaults({
  toolbar: {
    zoomIn: true,
    zoomOut: true,
    oneToOne: true,
    reset: true,
    prev: true,
    play: {
      show: true,
      size: 'large'
    },
    next: true,
    rotateLeft: true,
    rotateRight: true,
    flipHorizontal: true,
    flipVertical: true

  },
  zIndex: 10000
})
Vue.use(Print) // 注册
Vue.use(PrintJS) // 注册
Vue.use(AMap)
Vue.prototype.$echarts = Echarts
Vue.prototype.$axios = axios
Vue.prototype.$Loading = Loading

// 引入字体图标文件
// import '@/assets/font/iconfont.css'
// 引入全局的样式文件
// import '@/assets/css/global.less'

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VueQriously)
Vue.use(VueQrcode)
Vue.use(Highlight)

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)
//  这个是为了兼容 m3u8
const hls = require('videojs-contrib-hls')
Vue.use(hls)
Vue.config.productionTip = false
// eslint-disable-next-line no-extend-native
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

new Vue({
  el: '#app',
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  router,
  store,
  render: h => h(App)
})
