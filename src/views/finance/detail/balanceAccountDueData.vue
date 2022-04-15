<template>
  <div style="height:780px">
    <div style="height:60px">
      <el-form :ref="`balanceAccountDueData`" size="mini" :model="balanceAccountDueDTO" label-width="100px" :rules="rules">
        <el-col :span="4">
          <el-form-item label="承运商" prop="carrierId">
            <customerSelect :ref="`carrierSelect`" :is-disabled="dialogType !== 'add'" :is-customer="false" @changeCarrierId="changeCarrierId" />
          </el-form-item>
          <el-form-item label="支付方式" prop="payWay">
            <el-select v-model="balanceAccountDueDTO.payWay">
              <el-option
                v-for="item in payWayList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="付款期限" prop="paytimeLimit">
            <el-input v-model="balanceAccountDueDTO.paytimeLimit" placeholder="天数" />
          </el-form-item>
          <el-form-item label="应付总额" prop="amount">
            <el-input v-model="balanceAccountDueDTO.amount" readonly placeholder="系统自动计算" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="对账开始时间" prop="balanceStart">
            <el-date-picker
              v-model="balanceAccountDueDTO.balanceStart"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="对账结束时间" prop="balanceEnd">
            <el-date-picker
              v-model="balanceAccountDueDTO.balanceEnd"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="balanceAccountDueDTO.remark"
              type="textarea"
              autosize
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
      </el-form>
    </div>

    <div style="float:right">
      <el-button type="primary" @click="addDetailButton">增加</el-button>
      <el-button type="danger" @click="deleteDetailButton">删除</el-button>
    </div>
    <el-table
      :ref="`table`"
      :data="tableData"
      :row-key="getRowKeys"
      height="580"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" reserve-selection width="45" />
      <el-table-column label="序号" type="index" width="45" />
      <!-- <el-table-column class="orderTableDetail" align="center" prop="orderTableDetail" label="明细" type="expand" width="50">
            <template slot-scope="{row}">
              <incomeAuditDetail :waybill-charge-d-t-o-s="row.waybillChargeDTOS" :waybill-send-cost-d-t-o-s="row.waybillSendCostDTOS" />
            </template>
          </el-table-column> -->
      <el-table-column label="源头单号" sortable prop="sourceOrderNo" width="90" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          <span :data-clipboard-text="row.sourceOrderNo" class="tag-read" @click="copyText"> {{ row.sourceOrderNo == null ? '空' : row.sourceOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" sortable prop="orderNo" width="100" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          <span style="color:#409EFF" :data-clipboard-text="row.orderNo" class="tag-read" @click="copyText"> {{ row.orderNo == null ? '空' : row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运单号" show-overflow-tooltip prop="mailNo">
        <template slot-scope="{ row }">
          <span :data-clipboard-text="row.mailNo" class="tag-read" @click="copyText"> {{ row.mailNo == null ? '空' : row.mailNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" sortable show-overflow-tooltip prop="customer" align="center" />
      <el-table-column label="下单时间" show-overflow-tooltip sortable prop="placeBillwayTime" width="90" align="center" />
      <el-table-column label="货品" prop="goods" show-overflow-tooltip width="60" align="center" />
      <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip width="70" align="center" />
      <el-table-column label="箱数" width="50" align="center" prop="quantity" show-overflow-tooltip />
      <el-table-column label="体积" width="60" prop="cubage" align="center" show-overflow-tooltip />
      <el-table-column label="重量" width="60" prop="weight" align="center" show-overflow-tooltip />
      <el-table-column label="收货人" width="70" prop="receiver" align="center" show-overflow-tooltip />
      <el-table-column label="收货人公司" width="90" prop="receiverCompany" align="center" show-overflow-tooltip />
      <el-table-column label="计价方式" prop="dictionaryDTO.value" width="60" />
      <el-table-column label="运输方式" prop="waybillTypeDICDTO.value" width="60" show-overflow-tooltip />
      <el-table-column label="费用" prop="waybillCharges" width="50" align="center">
        <template slot-scope="{row}">
          <span>
            {{ row.waybillCharges = row.waybillCharges?row.waybillCharges:0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="成本" prop="waybillCost" width="50" align="center">
        <template slot-scope="{row}">
          <span>
            {{ row.waybillCost = row.waybillCost?row.waybillCost:0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="应收" sortable prop="free.Charge" width="50" align="center">
        <template slot-scope="{row}">
          <span v-if="!Object.keys(row.free).length" @click="getFreeDetail('')">
            0
          </span>
          <span v-else style="color:#409EFF" @click="getFreeDetail(row.id,row.waybillCharges,'Charge')">
            {{
              row.free.Charge = !row.free.Charge
                ?0:row.free.Charge
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="应付" sortable prop="free.SendCost" width="50" align="center">
        <template slot-scope="{row}">
          <span v-if="!Object.keys(row.free).length" @click="getFreeDetail('')">
            0
          </span>
          <span v-else style="color:#409EFF" @click="getFreeDetail(row.id,row.waybillCost,'SendCost')">
            {{
              row.free.SendCost = !row.free.SendCost
                ?0:row.free.SendCost
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="承运商1" prop="carrierDTO1.name" width="70" show-overflow-tooltip />
      <el-table-column label="承运商2" prop="carrierDTO2.name" width="70" show-overflow-tooltip />
      <el-table-column label="始发地地址" align="center" width="90" show-overflow-tooltip prop="startAddress" />
      <el-table-column label="目的地地址" width="90" show-overflow-tooltip prop="goalAddress" />
      <el-table-column label="委托事项" width="50" show-overflow-tooltip prop="entrustThing" />
    </el-table>

    <div slot="footer" style="float:right;margin-top:10px" class="dialog-footer">
      <el-button @click="parentCancelHandel">取消</el-button>
      <el-button type="primary" :loading="confirmBtnLoading" @click="confirm">确定</el-button>
    </div>
    <el-dialog v-dialogDrag :close-on-click-modal="false" :append-to-body="true" title="运单详情" top="5vh" :visible.sync="addWaybillInfoVisible" width="80%">
      <addWaybillInfo ref="addWaybillInfo" @addWaybill="addWaybill" @waybillCancelHandel="waybillCancelHandel" />
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="`${freeType === 'Charge'?'费用':'成本'}详情`"
      top="5vh"
      :visible.sync="freeDetailVisible"
      width="48%"
    >
      <freeDetail ref="freeDetail" :waybill-free="waybillFree" :free-type="freeType" />
    </el-dialog>
  </div>

</template>

<script>
import { BalanceDueApi } from '@/api/finance/balanceAccountDue'
import customerSelect from '../components/customerSelect'
import addWaybillInfo from './addWaybillInfo'
import freeDetail from './freeDetail'
import { WaybillApi } from '@/api/waybill/waybill'
import Clipboard from 'clipboard'
export default {
  components: {
    customerSelect,
    addWaybillInfo,
    freeDetail
  },
  data() {
    return {
      // 主信息
      tableData: [], // 明细表信息
      payWayList: [], // 支付方式下拉框
      addWaybillInfoVisible: false, // 运单增加弹窗显示隐藏
      confirmBtnLoading: false, // 确定按钮加载
      rules: {
        carrierId: [
          { required: true, message: '请选择承运商', trigger: 'blur' }
        ]
      },
      getRowKeys(row) { // 行id
        return row.id
      },
      isDisabled: true, // 编辑是不能选择承运商的
      dialogType: 'add',
      // 费用以及成本明细弹窗
      freeDetailVisible: false,
      freeType: 'Charge', // 所需要的费用以及成本类型
      waybillFree: '', // 运单的费用或成本
      balanceAccountDueDTO: {
        balanceStart: this.formatTime(new Date(), true),
        balanceEnd: new Date()
      }
    }
  },
  mounted() {
    WaybillApi.getDictionaryWay(1326439346873696256n).then(res => {
      this.payWayList = res.data
    })
  },
  methods: {
    init() {
      this.tableData = []
      this.balanceAccountDueDTO = {
        balanceStart: this.formatTime(new Date(), true),
        balanceEnd: new Date()
      }
      this.$refs.carrierSelect0[0].carrierId = ''
      this.isDisabled = false
    },
    /**
     * 获取费用或者成本明细
     */
    getFreeDetail(id, waybillFree, freeType = 'Charge') {
      if (!id) {
        this.$message.error('暂无明细数据')
        return
      }
      this.freeDetailVisible = true
      this.freeType = freeType
      this.waybillFree = waybillFree
      this.$nextTick(() => {
        this.$refs.freeDetail.getFree(id)
      })
    },
    /**
     * 确认制定对账单
     */
    confirm() {
      // 校验数据是否已录入
      let isValid = true
      this.$refs.balanceAccountDueData.validate((valid) => {
        isValid = valid
      })
      if (!isValid) {
        this.$message.warning('请添加承运商对账单信息')
        return
      }

      if (!this.tableData.length) {
        this.$message.warning('您还未增加订单')
        return
      }
      const balanceAccountDueDTOList = [] // 保存发给后端的数据
      const carrier = this.balanceAccountDueDTO.carrierId // 承运商
      let isSameCarrier = true
      const balanceAccountDueDTO = this.balanceAccountDueDTO
      // 准备数据发给后端同时判断数据承运商是否与所选存在不一致
      const balanceAccountDueDetailDTOList = this.tableData.map(item => {
        if (item.carrier1 !== carrier && item.carrier2 !== carrier) {
          isSameCarrier = false
        }
        return {
          waybillId: item.id,
          amount: item.free.Charge,
          tenantId: this.$store.getters.tenantId,
          orgId: this.$store.getters.orgId,
          companyId: this.$store.getters.companyId,
          createdBy: this.$store.getters.UserId,
          creator: this.$store.getters.name
        }
      })
      if (!isSameCarrier) {
        this.$message.warning('明细表存在一级或二级承运商与所选承运商不匹配，请检查')
        return
      }
      balanceAccountDueDTO.balanceStart = this.formatTime(balanceAccountDueDTO.balanceStart)
      balanceAccountDueDTO.balanceEnd = this.formatTime(balanceAccountDueDTO.balanceEnd)
      Object.assign(balanceAccountDueDTO, { balanceAccountDueDetailDTOList })
      balanceAccountDueDTOList.push(balanceAccountDueDTO)
      this.confirmBtnLoading = true
      // 调用增加和编辑的接口
      BalanceDueApi[this.dialogType](balanceAccountDueDTOList).then(res => {
        const msg = this.dialogType === 'add' ? '制定' : '编辑'
        if (res) {
          this.$message.success(`${msg}成功`)
        } else {
          this.$message.success(`${msg}失败`)
        }
        this.confirmBtnLoading = false
        this.parentCancelHandel()
      }).catch(() => {
        this.confirmBtnLoading = false
      })
    },
    /**
     * 获取编辑的数据
     */
    getEditData(row) {
      this.isDisabled = true
      this.balanceAccountDueDTO = {
        balanceStart: this.formatTime(new Date(), true),
        balanceEnd: new Date()
      }
      BalanceDueApi.getBARInfo(row.id).then(res => {
        this.dialogType = 'edit'
        this.balanceAccountDueDTO = res
        this.$refs.carrierSelect.getCarrierId(res.carrierId)
        this.tableData = res.balanceAccountDueDetailDTOList.map(item => {
          return item.waybill
        })
      })
    },
    /**
     * 取消制定对账单
     */
    parentCancelHandel() {
      this.balanceAccountDueDTO = {
        balanceStart: this.formatTime(new Date(), true),
        balanceEnd: new Date()
      }
      this.tableData = []
      this.isDisabled = false
      this.$emit('parentCancelHandel')
    },
    /**
     * 添加详细按钮
     * params ：
     */
    addDetailButton() {
      console.log(this.balanceAccountDueDTO.carrierId)
      if (!this.balanceAccountDueDTO.carrierId) {
        this.$message.warning('请先选择一级承运商再进行明细添加')
        return
      }
      this.addWaybillInfoVisible = true
      this.$nextTick(() => {
        this.$refs.addWaybillInfo.waybillInfoType = 'Due'
        this.$refs.addWaybillInfo.isCustomerVisible = false
        const carrierRealyList = [this.balanceAccountDueDTO.carrierId]
        this.$refs.addWaybillInfo.carrierRealyList = carrierRealyList
        this.$refs.addWaybillInfo.searchForm.carrierId = this.balanceAccountDueDTO.carrierId
        this.$refs.addWaybillInfo.getCarrierList()
      })
    },
    deleteDetailButton() {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      this.multiSelection.map(itemDelete => {
        this.tableData.remove(itemDelete)
      })
      this.multiSelection = []
      this.$refs[`table`].clearSelection()
    },
    // 取消隐藏事件
    waybillCancelHandel() {
      this.addWaybillInfoVisible = false
      this.freeDetailVisible = false
    },
    /**
     * 复制订单号或源头订单号
     */
    copyText() {
      var clipboard = new Clipboard('.tag-read')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        //  释放内存
        e.clearSelection()
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持复制',
          type: 'success'
        })
        console.log('该浏览器不支持复制')
        // 释放内存
        e.clearSelection()
        clipboard.destroy()
      })
    },
    /**
     * 将订单添加到对账计划里面
     */
    addWaybill(val) {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      val.map(item => {
        this.tableData.map(tdItem => {
          if (tdItem.orderNo === item.orderNo) {
            this.tableData.remove(tdItem)
          }
        })
      })
      this.tableData = [...this.tableData, ...val]
      let amountCarrier = 0
      // this.tableData
      this.tableData.map(item => {
        item.waybillSendCostDTOS.map(itemSC => {
          if (this.balanceAccountDueDTO.carrierId === itemSC.carrierId) {
            amountCarrier += itemSC.fee
          }
        })
      })
      this.balanceAccountDueDTO.amount = amountCarrier.toFixed(2)
      this.addWaybillInfoVisible = false
    },
    /**
     * 子组件选框发送carrierId
     */
    changeCarrierId(carrierId) {
      this.balanceAccountDueDTO.carrierId = carrierId
      this.tableData = []
    },
    /**
     * 时间格式化
     * @param time 传入所需格式化时间
     */
    formatTime(time, isMonthBegin = false, isData = true) {
      if (!time) {
        return
      }
      time = new Date(time)
      let timeF = time.getFullYear() + '-' +
      ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-'
      if (!isMonthBegin) {
        timeF = timeF + (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' '
      } else {
        timeF = timeF + 1 + ' '
      }
      if (isData) {
        timeF = timeF +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      }

      return timeF
    },
    // 选择的数据
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>
