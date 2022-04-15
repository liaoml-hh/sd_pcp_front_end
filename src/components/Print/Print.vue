<template>
  <div style="margin:auto;width:990px;">
    <div id="print" ref="print">
      <!--style="page-break-after:always" 表示添加分页功能  -->
      <!-- <div
        v-for="(item,index) of tableData"
        :key="index"
        class="printBox"
      > -->
      <!--  -->
      <div
        v-for="(item,index) of tableData"
        :id="'printContent' + index"
        :key="index"
        class="printContent"
      >
        <div class="content">
          <div class="area">
            <span style="font-size:22px">{{ item.startCity }}</span>
            <div class="arrowsContent">
              <div class="goalCityStyle" style="font-size:22px">{{ item.goalCity }}</div>
              <!-- <img class="arrowsImg" src="../../assets/404_images/arrive.png" alt=""> -->
              <img class="arrowsImg" width="100" height="12" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAALCAYAAADoWAqZAAABEElEQVRIid3WQUrDYBAF4C9aBMWluHInqCvP4TG8gXdzU/AEtrFqi2LFhYitta4UN2K1upi4ESptMbTJg4Hw817mz2N4k0Xlwi6OsI1VvOE5z4ZJni+fAXZw9evsAtfooo0UTQz+o2HZDFzA5xi8RzSy6ghzW9nzREhwgE0MJxXPGQZYw/6U+qEw8Rh1nIjJff9LlGSkrSmblh199HCLmpjYFp5+CAmq2JvF7QqMFIeoVrA+48vMO17FFPZwKZbUTVb9Cs6wpPgZ+IEVsYmnxRfuRAamWZ3jZZSgbFt4A/djcgfCnJowqi2mbFw9qExCLgBGfU9HhH9XGNTAqfidyaVhUbEsDHoQeVXPqimniPoGG3BHg7Ud0XwAAAAASUVORK5CYII=" alt="">
              <!-- <div v-show="false" :id="`arrowsImage${index}`">
                <div class="cross-bar" />
                <div class="cross-arrows-bottom" />
                <div class="cross-arrows-top" />
              </div> -->
            </div>
            <span style="font-size:22px">{{ item.goalCounty }}</span>
          </div>
          <div class="goalAddress">{{ item.goalAddress }}</div>

          <div class="receiverBox">
            <div class="receiver">{{ item.receiver?(item.receiver.length>15 ? item.receiver.substring(0,12):item.receiver):item.receiver }}</div>
            <!-- <div class="receiverMobile">{{ item.receiverMobile?(item.receiverMobile.length>14?item.receiverMobile.substring(0,14): item.receiverMobile):item.receiverMobile }}</div> -->
            <!-- <div class="receiver">{{ '=============================='.substring(0,12) }}</div>
            <div class="receiverMobile">{{ '133333333331333333333313333333333133333333331333333333313333333333'.substring(0,14) }}</div> -->
            <div style="font-size:18px;margin-top:4px">{{ item.customer.includes('北京普天太力')?item.sourceOrderNo:item.orderNo }}</div>
          </div>

          <div class="goodsInfo">
            <!-- <div class="quantityText">件</div> -->
            <div class="quantity">
              <div class="quantityContent">{{ item.indexQ }} / {{ item.quantity }}</div>
              <!-- <div class="quantityContent">{{ 999 }} / {{ 999 }}</div> -->
            </div>

          </div>
          <!-- <div style="width:200px;height:40px;background:black">{{ item.orderNo }}</div> -->
          <div class="barcodeBox">
            <!-- <div class="goods">{{ item.goods }}</div> -->
            <!-- <div><img :id="'barcode' + index"></div> -->
            <qriously
              v-show="false"
              :class="'barcode' + index"
              :value="item.customer.includes('北京普天太力')?item.sourceOrderNo:item.orderNo"
              :size="50"
            />
            <div class="imgQRCode"><img v-if="hackReset" :id="'barcode' + index" width="50" height="50" :src="item.qrcodeSrc"></div>
          </div>

          <!-- <p class="orderNo">{{ item.orderNo }}</p> -->
        </div>
      </div>
      <!-- <div style="width:60%;border:1px solid red" /> -->
      <!-- </li> -->
      <!-- </ul> -->

      <!-- </div> -->
    </div>
    <!-- <div v-show="true" ref="arrowsImage">
      <div class="cross-bar" />
      <div class="cross-arrows-bottom" />
      <div class="cross-arrows-top" />
    </div> -->
    <!-- <el-button type="info" plain size="medium" @click="Printing">打印</el-button> -->
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      // tableData: [{
      //   startCity: '厦门市',
      //   receiver: '王小虎',
      //   goalCity: '福州',
      //   goalCounty: '台江区',
      //   goalAddress: '宇宏国际物流中心',
      //   orderNo: 'XM36546200331',
      //   goods: '小米9',
      //   indexQ: 1,
      //   quantity: 2
      // }]
      tableData: [],
      hackReset: false,
      arrowsImgSrc: '',
      arrowsImgReset: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.tableData.map((item, index) => {
        let No = item.orderNo
        // 判断是不是太力的，太力的条码需要打印源头单号
        if (item.customer.includes('北京普天太力')) {
          No = item.sourceOrderNo
        } else {
          No = item.orderNo
        }
        const canvas = document.querySelector(`.barcode${index} canvas`)
        const imgSrc = canvas.toDataURL('image/png')
        item.qrcodeSrc = imgSrc

        item.qrcodeSrc = imgSrc
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })

        // 生成单号
        // JsBarcode(`#barcode${index}`, No, {
        //   format: 'CODE128',
        //   // lineColor: '#000',
        //   // background: '#EBEEF5',
        //   width: 1.5,
        //   height: 30,
        //   // displayValue: false,
        //   fontSize: '16',
        //   margin: 0
        // })
      })
    },
    // 打印
    Printing() {
      this.$print(this.$refs.print)
    }
  }
}
</script>
<style  scoped>

</style>
<style media="print">

</style>
<style lang="scss" scoped>
  @media print{
    .printContent{
      display: block!important;
      border: none!important;
      .quantityContent{
        float: right;
        text-align: right;
        width:110px;
        margin-top: -20px!important;
      }
      .imgQRCode img{
        margin-top: -10px;
        margin-right: 40px;
      }
    }
  }
  .printContent{
    position:relative;
    page-break-after: always;
    display: inline-block;
    border: 1px solid gray;
    // height: 180px;
    height: 200px;
    width: 330px;
    font-size: 18px;
    // box-shadow: 1px 1px 1px 1px gray;
    .content{
      padding: 0 10px;
      .area{
        padding: 0 0px;
      }
      .goods{
        width: 300px;
        font-size: 2px;
        margin:10px 0 10px;
      }
      .receiverBox{
          font-size: 14px;
          height:20px;
          padding: 2px;
          // margin:20px 0 8px;
        .receiver{
          display: inline-block;
        }
        .receiverMobile{
          display: inline-block;
        }
      }

      .arrowsContent{
        margin:10px 30px;
        display:inline-block;
        width:100px;
        .goalCityStyle{
           margin-left:20px;
        }
        .arrowsImg{
          display:inline-block;
           width:100%;
           .cross-bar{
             width: 110px;
             height:5px;
             margin-top:-10px;
             margin-left:-5px;
             background: black;
           }
           .cross-arrows-bottom{
             width: 15px;
             height:5px;
             margin-left:92px;
             background: black;
             transform: rotateZ(-45deg);
           }
           .cross-arrows-top{
             width: 15px;
             height:5px;
             margin-left:92px;
             margin-top:-14px;
             background: black;
             transform: rotateZ(45deg);
           }
        }
      }
      .goalAddress{
        font-size: 10px;
        // height:20px;
        width: 300px;
        overflow: hidden;
        // text-overflow:ellipsis;
        white-space: nowrap;
        line-height: 20px;
      }
      .orderNo{
        font-size: 2px;
      }
      .goodsInfo{
        position: absolute;
        margin-top: 40px;
        // margin-top: 0px;
        // .goods{
        //   font-size: 2px;
        //   margin:-10px 0 10px;
        // }
        .quantityText{
            float: right;
            font-size: 30px;
            margin: 12px 0 0 2px;
          }
        .quantity{
          float: right;
          font-size: 26px;
          .quantityContent{
            float: right;
            text-align: right;
            width:110px;
            margin-top: -10px;
          }
        }
      }
      .barcodeBox{
        // width: 300px;
        margin-top: 20px;
        margin-left: -9px;
        .goods{
          width: 300px;
          font-size: 2px;
          margin:10px 0 10px;
        }
        .imgQRCode img{
          float: right;
          margin-top: -10px;
        }
      }
    }
  }
</style>
