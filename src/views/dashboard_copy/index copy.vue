<template>

  <div>
    <div id="container" class="map-container" />
  </div>

</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { commonQueryStation } from '@/api/station/station'
export default {
  name: 'App',
  data() {
    return {
      mymap: {}
    }
  },
  mounted() {
    // localStorage.clear()
    this.initAMap()
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        'key': '3a4a64533981304d80fdb30be25cd590', // 申请好的Web端开发者Key，首次调用 load 时必填
        'version': '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Scale', 'AMap.ToolBar'],
        'AMapUI': { // 是否加载 AMapUI，缺省不加载
          'version': '1.1', // AMapUI 缺省 1.1
          'plugins': ['overlay/SimpleMarker', 'misc/MarkerList', 'overlay/SvgMarker', 'overlay/SimpleInfoWindow'] // 需要加载的 AMapUI ui插件
        },
        'Loca': { // 是否加载 Loca， 缺省不加载
          'version': '2.0.0' // Loca 版本，缺省 1.3.2
        }
      }).then((AMap) => {
        let map = new AMap.Map('container', {
          mapStyle: 'amap://styles/grey',
          zoom: 4,
          center: [117.4976, 26.1697]
        })
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.ToolBar())
        map.add(new AMap.Marker({
          position: map.getCenter()
        }))
        this.mymap = map.getCenter()
        commonQueryStation().then(res => {
          res.data.map(key => {
            new AMapUI.SimpleMarker({

              // 前景文字
              iconLabel: key.name,

              // 图标主题
              iconTheme: 'default',

              // 背景图标样式
              iconStyle: 'red',

              // ...其他Marker选项...，不包括content
              map: map,
              position: { lat: key.latitude, lng: key.longitude, className: 'AMap.LngLat' }

            })
          })
        })
      }).catch(e => {
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  .map-container {
        width: 100%;
        height: 700px;
    }
</style>
