<template>
  <div style="height:600px;overflow:auto">
    <el-col v-for="(itemInfo, index) in imageInfo" :key="index" style="margin:3px;width:24%">
      <el-card body-style="padding:0px;">
        <div class="block">
          <el-carousel trigger="click" height="150px">
            <el-carousel-item v-for="(imgUrl,indexUrl) in itemInfo.oosurl" :key="indexUrl">
              <viewer
                ref="viewer1"
                :images="imgUrl"
                style="height:250px"
              >
                <!-- style="border:1px solid red" -->
                <img :src="imgUrl" height="150" width="228">
              </viewer>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div style="padding: 14px;border-top:1px solid #409EFF;font-size:12px">
          <el-row>订单号：{{ itemInfo.orderNo }}</el-row>
          <el-row style="margin-top:5px">运单号：{{ itemInfo.waybillNo }}</el-row>
          <el-row style="margin-top:5px;width:205px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">收货人：{{ itemInfo.waybillDTO.receiver }}</el-row>
          <el-col :span="11" style="margin-top:5px">司机：{{ itemInfo.operator }}</el-col>
          <el-col :span="11" style="margin-top:5px">发货人：{{ itemInfo.waybillDTO.sender }}</el-col>
          <el-col :span="11" style="margin-top:5px">物品：{{ itemInfo.waybillDTO.goods }}</el-col>
          <el-col :span="11" style="margin-top:5px">重量：{{ itemInfo.waybillDTO.weight }}</el-col>
          <el-col :span="11" style="margin-top:5px">体积：{{ itemInfo.waybillDTO.cubage }}</el-col>
          <el-col :span="11" style="margin-top:5px;color:#67C23A">件数：{{ itemInfo.waybillDTO.quantity }}</el-col>
          <div class="bottom clearfix">
            <time class="time">{{ currentDate }}</time>
            <!-- <el-button type="text" class="button">操作按钮</el-button> -->
          </div>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'PictureViewer',
  props: {
    imageInfo: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
