
<template>
  <div>
    <el-button @click="onStart">打印</el-button>
    <el-button @click="getPrints">获取打印机列表</el-button>
    <el-button @click="setPrinterConfig">设置打印机配置</el-button>
    <el-button @click="getPrinterConfig">获取打印机配置</el-button>
    <el-button @click="getExpressCompaniesPrinter">获取快递设置的打印机</el-button>
  </div>
</template>

<script>

let socket, defaultPrinter
const num = [{
  waybillCode: '3738460008834',
  printData: {
    data: '',
    // templateURL: 'http://cloudprint.cainiao.com/template/standard/101/123'
    templateURL: 'http://cloudprint.cainiao.com/template/standard/101/635'
  },
  objectId: '1'
}]
const jsonObject = {
  content: {
    'data': {
      '_dataFrom': 'waybill',
      'adsInfo': {
        'adId': '556',
        'advertisementType': 'COMMERCIAL',
        'bannerUrl': 'http://ad-cdn.cainiao.com/361/1607308583670.JPG',
        'miniBannerUrl': 'http://ad-cdn.cainiao.com/361/1607308576681.JPG',
        'trackUrl': 'https://ad.cainiao.com/9kESOzk'
      },
      'cpCode': 'ZTO', // 不同快递 cpCode不同
      'needEncrypt': false,
      'packageInfo': {
        'currentPackageSequence': 0,
        'id': '-1',
        'totalPackagesCount': 0,
        'volume': 0,
        'weight': 0
      },
      'parent': false,
      'recipient': {
        'address': {
          'city': '杭州市',
          'detail': '文一西路969号',
          'district': '余杭区',
          'province': '浙江省'
        },
        'mobile': '13100000001',
        'name': '李四'
      },
      'routingInfo': {
        'blockCode': '969',
        'consolidation': {
          'code': '571901'
        },
        'origin': {
          'code': '731091',
          'name': '湖南省长沙市岳麓三部'
        },
        'receiveBranch': {
          'code': '571937',
          'name': '浙江省杭州市余杭区桃花港直营'
        },
        'routeCode': '342-075-00 250',
        'sortation': {
          'name': '余杭'
        },
        'startCenter': {},
        'terminalCenter': {
          'code': '571901',
          'name': '杭州转运中心'
        }
      },
      'sender': {
        'address': {
          'city': '长沙市',
          'detail': '东方红中路175号',
          'district': '岳麓区',
          'province': '湖南省'
        },
        'mobile': '13000000000',
        'name': '张三'
      },
      'shippingOption': {
        'code': 'STANDARD_EXPRESS',
        'title': '标准快递'
      },
      'waybillCode': 'YT5202203890344'
    },
    'signature': 'MD:U1Pw5p49tvW2JMD0HlRIEA==',
    // templateURL  每个快递的模板都不同
    'templateURL': 'http://cloudprint.cainiao.com/template/standard/308812/7'

  }

}
export default {
  name: 'FrmOrdersShip',
  mounted() {
    const that = this
    socket = new WebSocket('ws://127.0.0.1:13528')
    socket.onopen = function(event) {
      // 监听消息
      socket.onmessage = function(event) {
        console.log('Client received a message', event)
        console.log(JSON.parse(event.data).defaultPrinter)
        defaultPrinter = JSON.parse(event.data).defaultPrinter
        that.subscribe(JSON.parse(event.data))
      }
      // 监听Socket的关闭
      socket.onclose = function(event) {
        console.log('Client notified socket has closed', event)
      }
    }
  },
  methods: {
    subscribe: function(data) {
      switch (data.cmd) {
        case 'getPrinters':
          console.log('获取打印机列表')
          console.log(data.printers)
          break
        case 'getPrinterConfig':
          console.log('获取打印机配置')
          console.log(data.printer)
          break
        case 'print':
          console.log('发送打印')
          console.log(data)
          break
        case 'notifyPrintResult':
          console.log('打印通知')
          console.log(data)
          break
        case 'setPrinterConfig':
          console.log('设置打印机配置')
          console.log(data)
          break
      }
    },
    getPrints: function() {
      this.getPrintList()// 打印机列表
    },
    getExpressCompaniesPrinter: function() {
      const express_companies_printer = localStorage.getItem('rmt_set_express_companies_printer')
      console.log(express_companies_printer)
    },
    getPrinterConfig: function() {
      const request = this.getRequestObject('getPrinterConfig')
      request.printer = 'KM-118'
      if (socket.readyState === 1) {
        console.log(request)
        socket.send(JSON.stringify(request))
      }
    },
    setPrinterConfig: function() {
      const request = this.getRequestObject('setPrinterConfig')
      request.printer = {
        'name': 'KM-118',
        'needTopLogo': true
      }
      if (socket.readyState === 1) {
        console.log(request)
        socket.send(JSON.stringify(request))
      }
    },
    onStart: function() {
      this.doPrint(defaultPrinter, num)
    },
    getPrintList: function() {
      const request = this.getRequestObject('getPrinters')

      if (socket.readyState === 1) {
        console.log(request)
        socket.send(JSON.stringify(request))
      }
    },
    getRequestObject: function(cmd) {
      const request = {}
      request.requestID = this.getUUID(8, 16)
      request.version = '1.0'
      request.cmd = cmd
      return request
    },
    getUUID: function(len, radix) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
      const uuid = []; let i
      radix = radix || chars.length
      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
      } else {
        let r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
          }
        }
      }
      return uuid.join('')
    },

    // printer 指定打印机
    doPrint: function(printer, waybillArray) {
      const request = this.getRequestObject('print')
      request.task = {}
      request.task.taskID = this.getUUID(8, 10)
      request.task.preview = false
      request.task.printer = printer
      const documents = []
      for (let i = 0; i < waybillArray.length; i++) {
        const doc = {}
        doc.documentID = waybillArray[i]
        const content = []
        const waybillJson = this.getWaybillJson(waybillArray[i])
        const customAreaData = this.getCustomAreaData(waybillArray[i])
        content.push(waybillJson, customAreaData)
        doc.contents = content
        documents.push(doc)
      }
      request.task.documents = documents
      socket.send(JSON.stringify(request))
    },
    getWaybillJson: function(waybillNO) {
      // 获取waybill对应的json object，此处的ajaxGet函数是伪代码
      // let jsonObject = ajaxGet(waybillNO);
      return jsonObject
    },
    getCustomAreaData: function(waybillNO) {
      // 获取waybill对应的自定义区的JSON object，此处的ajaxGet函数是伪代码
      // let jsonObject = ajaxGet(waybillNO);
      const ret = {}
      ret.templateURL = jsonObject.content.templateURL
      ret.data = jsonObject.content.data
      return ret
    }
  }
}
</script>

<style scoped>

</style>
