<template>
  <div>
    <el-form v-model="formData" label-width="80px" size="mini" style="height: 650px;overflow-y: scroll">
      <el-divider>基本信息</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="订单号">
            <el-input v-model="formData.orderNo" disabled />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="上游订单号" label-width="100px">
            <el-input v-model="formData.customerOrderNo" disabled />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="源头单号" label-width="100px">
            <el-input v-model="formData.sourceOrderNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运单号">
            <el-input v-model="formData.mailNo" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="订单类型">
            <el-select v-model="formData.orderType" disabled>
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运单类型" label-width="100px">
            <el-select v-model="formData.waybillType" disabled>
              <el-option
                v-for="item in waybillTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="下单渠道" label-width="100px">
            <el-select v-model="formData.channel" disabled>
              <el-option
                v-for="item in orderChannelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-divider>货品信息</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="货品">
            <el-input v-model="formData.goods" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="货品类型">
            <el-input v-model="formData.goodsTypeShortName" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="箱数" label-width="100px">
            <el-input v-model="formData.quantity" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="体积" label-width="100px">
            <el-input v-model="formData.cubage" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="重量">
            <el-input v-model="formData.weight" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>费用信息</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="收费依据">
            <el-input v-model="formData.chargesRef" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计费单位" label-width="100px">
            <el-input v-model="formData.chargesUnit" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="费率" label-width="100px">
            <el-input v-model="formData.rate" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="费用">
            <el-input v-model="formData.free" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>成本信息</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="成本依据">
            <el-input v-model="formData.costRef" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结算方式" label-width="100px">
            <el-input v-model="formData.settleWay" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="费率" label-width="100px">
            <el-input v-model="formData.rate2" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="费用">
            <el-input v-model="formData.fee2" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="计价方式">
            <el-select v-model="formData.costWay" :disabled="readonly">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="保险" label-width="100px">
            <el-input v-model="formData.insurance" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6" />
        <el-col :span="6" />
      </el-row>
      <el-divider>地址信息</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="始发地省份" label-width="100px">
            <el-input v-model="formData.startProvince" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="始发地城市" label-width="100px">
            <el-input v-model="formData.startCity" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="始发地地址" label-width="100px">
            <el-input v-model="formData.startAddress" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="目的地省份" label-width="100px">
            <el-input v-model="formData.goalProvince" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目的地城市" label-width="100px">
            <el-input v-model="formData.goalCity" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="目的地地址" label-width="100px">
            <el-input v-model="formData.goalAddress" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-divider>发货人信息</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="下单时间">
            <el-input v-model="formData.placeBillwayTime" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发货人">
            <el-input v-model="formData.sender" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发货人邮箱" label-width="100px">
            <el-input v-model="formData.senderEmail" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发货人手机" label-width="100px">
            <el-input v-model="formData.senderMobile" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="送货开始时间" label-width="100px">
            <el-input v-model="formData.beginTime" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="送达时间">
            <el-input v-model="formData.reachTime" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="价格协议" label-width="100px">
            <el-input v-model="formData.priceProtocal" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="送货人要求" label-width="100px">
            <el-input v-model="formData.senderRequirement" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="送货前通知" label-width="100px">
            <el-input v-model="formData.noticeBeforeSend" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="委托事项">
            <el-input v-model="formData.entrusThing" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6" />
        <el-col :span="6" />
      </el-row>
      <el-divider>收货人信息</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="收货人">
            <el-input v-model="formData.receiver" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收货人邮箱" label-width="100px">
            <el-input v-model="formData.receiverEmail" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户" label-width="100px">
            <el-input v-model="formData.customer" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-divider>其他</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="仓库编码">
            <el-input v-model="formData.warehouseCode" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库地址">
            <el-input v-model="formData.warehouseAddress" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="揽件开始时" label-width="100px">
            <el-input v-model="formData.collectBeginTime" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="揽件结束时" label-width="100px">
            <el-input v-model="formData.collectEndTime" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="结算类型">
            <el-input v-model="formData.settleType" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="提货方式">
            <el-input v-model="formData.deliveryWay" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物控">
            <el-input v-model="formData.controll" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="回单要求" label-width="100px">
            <el-input v-model="formData.signDocumentBackRequirement" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="回单份数">
            <el-input v-model="formData.signDocumentNum" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="扩展信息">
            <el-input v-model="formData.extends" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="修改人">
            <el-input v-model="formData.modifier" :disabled="readonly" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="修改时间" label-width="100px">
            <el-input v-model="formData.updatedTime" :disabled="readonly" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { WaybillApi } from '@/api/waybill/waybill'

export default {
  name: 'WaybillDetail',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    readonly: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: this.data,
      orderTypeOptions: [{ label: '订单类型1', value: 1 }, { label: '订单类型2', value: 2 }],
      waybillTypeOptions: [{ label: '类型1', value: 1 }, { label: '类型2', value: 2 }],
      orderChannelOptions: [{ label: '渠道1', value: 1 }, { label: '渠道2', value: 2 }],
      typeOptions: [{ label: '类型1', value: 1 }, { label: '类型2', value: 2 }]
    }
  },
  created() {
    if (this.add) {
      this.formData = {}
    }
  },
  methods: {
    submitForm() {
      const p = { id: this.formData.id }
      WaybillApi.update(p, this.formData).then(res => {

      })
    }
  }
}
</script>

<style scoped>

</style>
