<template>
  <el-container>
    <div id="printDiv">
      <!-- <ul class="print-ul"> -->
      <div
        v-for="(item,index) of tableData"
        :id="'printDiv' + index"
        :key="index"
        style="page-break-after:always;"
      >
        <div id="printContent">
          <div class="content">
            <span>{{ item.startCity }}</span>
            <div class="arrowsContent">
              <div class="goalCityStyle">{{ item.goalCity }}</div>
              <img class="arrowsImg" src="../../../../assets/404_images/arrive.png" alt="">
            </div>
            <span>{{ item.goalCounty }}</span>
            <p class="goalAddress">{{ item.goalAddress }}</p>
            <p>{{ item.receiver }}</p>
            <div class="goodsInfo">
              <p class="goods">{{ item.goods }}</p>
              <div class="quantity">
                1 / {{ item.quantity }}
                <p class="quantityText">件</p>
              </div>

            </div>
            <!-- <div style="width:200px;height:40px;background:black">{{ item.orderNo }}</div> -->
            <img id="barcode">
            <!-- <p class="orderNo">{{ item.orderNo }}</p> -->
          </div>
        </div>
        <!-- <div style="width:60%;border:1px solid red" /> -->
        <!-- </li> -->
        <!-- </ul> -->

      </div>
      <div @click="handlePrint">打印</div>
    </div>
    <button v-print="'#printDiv'">打印</button>
  </el-container>
</template>

<script>
import printJS from 'print-js'
import JsBarcode from 'jsbarcode'
export default {
  data() {
    return {
      tableData: [{
        startCity: '厦门市',
        receiver: '王小虎',
        goalCity: '上海',
        goalCounty: '普陀区',
        goalAddress: '上海市普陀区金沙江路 1518 弄',
        orderNo: 'XM36546200333',
        goods: '手机',
        quantity: 200
      }, {
        startCity: '厦门市',
        receiver: '王小虎',
        goalCity: '上海',
        goalCounty: '普陀区',
        goalAddress: '上海市普陀区金沙江路 1518 弄',
        orderNo: 'XM36546200333',
        goods: '手机',
        quantity: 20
      }]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      JsBarcode('#barcode', 'DY2020080400088', {
        format: 'CODE128',
        // lineColor: '#000',
        // background: '#EBEEF5',
        width: 1.2,
        height: 30,
        // displayValue: false,
        fontSize: '12',
        margin: 0
      })
    },
    handlePrint() {
      var newWin = window.open('') // 新打开一个空窗口
      for (var i = 0; i < this.tableData.length; i++) {
        var imageToPrint = document.getElementById('printDiv' + i) // 获取需要打印的内容
        newWin.document.write(imageToPrint.outerHTML) // 将需要打印的内容添加进新的窗口
      }
      const styleSheet = `<style>
          #printContent{
            height: 180px;
            width: 320px;
            font-size: 16px;
            border: 1px solid gray;
            box-shadow: 1px 1px 1px 1px gray;
          }
          .content{
              padding: 0 20px;
          }
          .arrowsContent{
            margin:10px 30px;
            display:inline-block;
            width:100px;
          }
          .goalCityStyle{
              margin-left:20px;
          }
          .arrowsImg{
              width:100%
          }
          .goalAddress{
            font-size: 4px;
          }
          .orderNo{
            font-size: 2px;
          }
          .goodsInfo{
            float: right;
          }
          .goods{
            font-size: 2px;
            margin:-30px 0 10px;
          }
          .quantity{
            font-size: 22px;
          }
          .quantityText{
            font-size: 8px;
            float: right;
          }
        </style>`
      newWin.document.head.innerHTML = styleSheet // 给打印的内容加上样式
      printJS(newWin, 'html')
      // newWin.document.close() // 在IE浏览器中使用必须添加这一句
      // newWin.focus() // 在IE浏览器中使用必须添加这一句
      // setTimeout(function() {
      //   newWin.print() // 打印
      //   // newWin.close() // 关闭窗口
      // }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
  #printContent{
    height: 180px;
    width: 320px;
    font-size: 16px;
    border: 1px solid gray;
    box-shadow: 1px 1px 1px 1px gray;
    .content{
      padding: 0 20px;
      .arrowsContent{
        margin:10px 30px;
        display:inline-block;
        width:100px;
        .goalCityStyle{
           margin-left:20px;
        }
        .arrowsImg{
           width:100%
        }
      }
      .goalAddress{
        font-size: 4px;
      }
      .orderNo{
        font-size: 2px;
      }
      .goodsInfo{
        float: right;
        .goods{
          font-size: 2px;
          margin:-30px 0 10px;
        }
        .quantity{
          font-size: 22px;
          .quantityText{
            font-size: 8px;
            float: right;
          }
        }
      }

    }
  }
</style>
