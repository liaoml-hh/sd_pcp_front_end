<template>
  <div>
    <div id="outer-box">
      <div id="eventInfo">当前站点信息</div>
      <div id="container" />
      <div id="panel" style="display:none">
        <div id="intro">
          <h3>站点</h3>
        </div>
        <ul id="my-list" />
      </div>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { commonQueryStation } from '@/api/station/station'
export default {
  name: 'App',
  data() {
    return {
      mymap: {},
      markerList: {},
      handlerId: null,
      mapV: null
    }
  },
  mounted() {
    // localStorage.clear()
    this.initAMap()
    this.handlerId = setInterval(() => this.initAMap(), 1000 * 60 * 10)
  },
  beforeDestroy() {
    clearInterval(this.handlerId)
    // this.$message.success('定时器销毁' + this.handlerId)
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
        this.initAmapWhenCallBack(AMap)
      }).catch(e => {
        this.initAmapWhenCallBack()
      })
    },

    initAmapWhenCallBack() {
      let map = new AMap.Map('container', {
        mapStyle: 'amap://styles/grey',
        zoom: 4,
        center: [110.2077, 33.3103]
      })
      map.on('click', this.setMapCentre)
      commonQueryStation().then(res => {
        let markerList = new AMapUI.MarkerList({
          map: map,
          listContainer: 'my-list',
          listElementEvents: ['click', 'mouseenter', 'mouseleave'],
          markerEvents: ['click', 'mouseover', 'mouseout'],
          infoWindowEvents: ['click', 'mouseover', 'mouseout'],
          getDataId: this.getDataId,
          getPosition: this.getPosition,
          getMarker: this.getMarker,
          getListElement: this.getListElement,
          getInfoWindow: this.getInfoWindow
        })
        this.mapV = map
        markerList.on('selectedChanged', this.MapSelectedChanged)
        markerList.on('listElementClick listElementMouseenter listElementMouseleave ' +
                'markerClick markerMouseover markerMouseout ' +
                'infoWindowClick infoWindowMouseover infoWindowMouseout',
        this.MapeventCallBack)
        let data = [{
          id: 'A',
          position: [116.020764, 39.904989],
          desc: '数据_1'
        }, {
          id: 'B',
          position: [116.405285, 39.904989],
          desc: '数据_2'
        }, {
          id: 'C',
          position: [116.789806, 39.904989],
          desc: '数据_3'
        }]
        res.data.map(item => data.push({ id: item.address, desc: item.address, position: [item.longitude, item.latitude], name: item.name }))
        this.mymap = data
        this.markerList = markerList
        this.markerList.render(data)
      })
    },

    getDataId(dataItem, index) {
      return dataItem.id
    },
    getPosition(dataItem) {
      return dataItem.position
    },
    getMarker(dataItem, context, recycledMarker) {
      let label = dataItem.id
      if (recycledMarker) {
        recycledMarker.setIconLabel(label)
        return recycledMarker
      }
      return new AMapUI.SvgMarker(
        new AMapUI.SvgMarker.Shape.IconFont({
          height: 60,
          strokeWidth: 1,
          strokeColor: '#ccc',
          fillColor: 'green'
        }), {
          // iconLabel: label,
          containerClassNames: 'my-svg-marker',
          showPositionPoint: true
        })
    },
    getListElement(dataItem, context, recycledListElement) {
      let tpl = '<p><%- dataItem.id %>：<%- dataItem.desc %>'
      let content = AMapUI.MarkerList.utils.template(tpl, {
        dataItem: dataItem,
        dataIndex: context.index
      })
      if (recycledListElement) {
        // 存在可回收利用的listElement, 直接更新内容返回
        recycledListElement.innerHTML = content
        return recycledListElement
      }
      // 返回一段html，MarkerList将利用此html构建一个新的dom节点
      return `<li > ${content}  ${content}  ${content}   </li>`
    },
    getInfoWindow(dataItem, context, recycledInfoWindow) {
      this.$router.push({ path: '/pcp/monitor/pcpmonitor', query: { id: dataItem.code || 147 }})
      if (recycledInfoWindow) {
        recycledInfoWindow.setInfoTitle(dataItem.id)
        recycledInfoWindow.setInfoBody(dataItem.desc)
        return recycledInfoWindow
      }
      return new AMapUI.SimpleInfoWindow({
        offset: new AMap.Pixel(0, -57),
        infoTitle: dataItem.id,
        infoBody: dataItem.desc
      })
    },
    MapeventCallBack(event, record) {
      let $ = AMapUI.MarkerList.utils.$
      let template = AMapUI.MarkerList.utils.template
      $('#eventInfo').html(template('<%- record.id%>: <%- record.data.desc %>' +
              '<div class="eventType"><%- event.type %></div>', { event: event, record: record }))
    },
    MapSelectedChanged(event, info) {
      console.log(event, info)
    },
    setMapCentre(e) {
      console.log(this.mapV)
      this.mapV.setCenter([e.lnglat.lng, e.lnglat.lat])
      // this.$message.success(JSON.stringify(e.lnglat))
    }
  }
}
</script>
<style >
#eventInfo {
position: absolute;
z-index: 9999;
right: 270px;
top: 20px;
background: #fff;
border: 1px solid #ccc;
padding: 7px;
min-width: 100px;
line-height: 170%;
}
.eventType {
font-size: 120%;
letter-spacing: 1px;
color: red;
        }
.my-svg-marker
.amap-simple-marker-label {
            color: #fff;
            top: 10px;
            font-size: 20px;
        }
        #container{
          width: 100%;
          height: 600px;
        }
</style>
