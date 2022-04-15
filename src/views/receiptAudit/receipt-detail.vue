<template>
  <div>
    <el-form :model="formData" size="mini" label-width="80px" class="demo-form-inline">
      <el-row>
        <el-col :span="8">
          <el-form-item label="订单号">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.orderNo" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运单号" label-width="100px">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.mailNo" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.customer" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="司机">
            <el-col :span="18">
              <el-input v-model="formData.operator" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="货品" label-width="100px">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.goods" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="货品类型">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.goodsTypeShortName" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间">
            <el-col :span="18">
              <el-input v-model="formData.operateTime" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="件数" label-width="100px">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.quantity" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="体积">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.volume" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="重量">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.weight" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计价方式" label-width="100px">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.dictionarycostway.name" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发货人">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.sender" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收货人">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.receiver" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收货人公司" label-width="100px">
            <el-col :span="18">
              <el-input v-model="formData.waybillDTO.receiverCompany" />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="回单状态">
            <el-col :span="18">
              <el-select v-model="formData.status">
                <el-option
                  v-for="item in statusList"
                  :key="item.status"
                  :label="item.label"
                  :value="item.status"
                />
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-image
          style="width: 100px; height: 100px"
          :src="url"
          :preview-src-list="srcList"
        /> -->
        <el-form-item v-if="formData.oosurl.length" label="回单图片:">
          <viewer
            v-for="(imgUrl,index) in formData.oosurl"
            ref="viewer1"
            :key="index"
            style="display:inline-block;box-shadow:0px 0px 1px 1px gray;margin-left:10%"
            :images="imgUrl"
          >
            <img :src="imgUrl" width="90" height="90">
          </viewer>
        </el-form-item>
        <el-form-item v-else label="回单图片:">
          暂无图片
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ReceiptDetail',
  props: {
    formData: {
      type: Object,
      required: true,
      default: () => {
        return {
          oosurl: []
        }
      }
    }
  },
  data() {
    return {
      url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=119141606,4154547077&fm=26&gp=0.jpg',
      srcList: [
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=119141606,4154547077&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=119141606,4154547077&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=119141606,4154547077&fm=26&gp=0.jpg'
      ],
      statusList: [
        { status: 1, label: '待审核' },
        { status: 103, label: '通过' },
        { status: 111, label: '发送失败' },
        { status: 110, label: '已送达' }
      ]
    }
  }
}
</script>

<style scoped>

</style>
