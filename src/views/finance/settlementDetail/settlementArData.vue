<template>
  <div style="height:740px">
    <el-form ref="settlementArData" :inline="true" :model="settlementArData" :rules="rules" size="mini" label-width="70px">
      <el-col :span="5">
        <el-form-item label="客户" prop="customerId">
          <customerSelect ref="customerSelect" @changeCustomerId="changeCustomerId" />
        </el-form-item>
        <el-form-item label="结算人">
          <el-input v-model="settlementArData.settler" disabled style="width:110%" placeholder="" />
        </el-form-item>
        <!-- <el-form-item label="结算单号">
          <el-input v-model="settlementArData.settleNo" placeholder="" style="width:110%" />
        </el-form-item> -->
      </el-col>
      <el-col :span="5">
        <el-form-item label="应收款" prop="ar">
          <el-input v-model="settlementArData.ar" readonly placeholder="系统自动计算" />
        </el-form-item>
        <el-form-item label="实收款" prop="actualAr">
          <el-input v-model="settlementArData.actualAr" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="结算方式" prop="settleWay" label-width="80px">
          <el-select
            v-model="settlementArData.settleWay"
            placeholder="请选择"
          >
            <el-option
              v-for="item in settleWayOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结算时间" label-width="80px">
          <el-date-picker
            v-model="settlementArData.settleTime"
            type="date"
            style="width:92%"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="备注">
          <el-input v-model="settlementArData.remark" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :on-remove="handleRemove"
            :on-change="importImgChange"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-form>
    <div style="float:right">
      <el-button type="primary" float="left" @click="onBtnAddClick">增加 </el-button>
      <el-button type="danger" float="left" @click="onBtnDeleteClick">删除 </el-button>
    </div>

    <el-table
      ref="tableData"
      v-loading="queryLoading"
      :row-key="getRowKeys"
      :data="tableData"
      fit
      highlight-current-row
      height="570"
      style="position:relative;top:0px;left:0px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" width="45" type="selection" reserve-selection />
      <el-table-column type="index" align="center" width="50" label="序号" />
      <el-table-column label="对账单号" prop="balanceAccountArNo" width="100" align="center" />
      <el-table-column label="订单号" prop="orderNo" width="100" align="center" />
      <el-table-column label="运单号" prop="mailNo" width="100" align="center" />
      <el-table-column label="客户" prop="customer" width="100" show-overflow-tooltip align="center" />
      <el-table-column label="货品" prop="goods" width="50" show-overflow-tooltip align="center" />
      <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip align="center" />
      <el-table-column label="下单时间" prop="placeBillwayTime" width="100" show-overflow-tooltip align="center" />
      <el-table-column label="对账时间" prop="checkTime" width="100" align="center" />
      <!-- <el-table-column label="审核状态" prop="accountStatus" align="center" /> -->
      <el-table-column label="仓库" prop="warehouseAddress" width="70" show-overflow-tooltip align="center" />
      <el-table-column label="数量" prop="quantity" width="50" align="center" />
      <el-table-column label="重量" prop="weight" width="50" align="center" />
      <el-table-column label="体积" prop="cubage" width="50" align="center" />
      <el-table-column label="计价方式" width="50" show-overflow-tooltip prop="dictionaryVO.name" align="center" />
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
      <el-table-column label="委托事项" prop="attorney" align="center" show-overflow-tooltip />
    </el-table>
    <!-- <div>
      <el-pagination
        :current-page="page.pageNum"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div> -->
    <span slot="footer" style="float:right;margin-top:10px" class="dialog-footer">
      <el-button @click="settlementArDataCancelHandel">取消</el-button>
      <el-button type="primary" @click="settlementArDataConfirm">确 定</el-button>
    </span>
    <el-dialog
      v-dialogDrag
      top="1vh"
      title="对账信息"
      style="height:1000px"
      :before-close="addBalanceAccountArDataCancelHandel"
      :close-on-click-modal="false"
      :visible.sync="addBalanceAccountArDataVisible"
      :append-to-body="true"
      width="90%"
    >
      <addBalanceAccountArData
        ref="addBalanceAccountArData"
        @addBalanceAccountArDataCancelHandel="addBalanceAccountArDataCancelHandel"
        @addBalanceAccountArDataConfirm="addBalanceAccountArDataConfirm"
      />
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
import { WaybillApi } from '@/api/waybill/waybill'
import { settlementArApi } from '@/api/finance/settlementAr'

import { pageMixin } from '@/views/mixin/page'
import { client } from '@/api/ali-oss/oss' // 引入oss.js文件

import freeDetail from '../detail/freeDetail'
import customerSelect from '../components/customerSelect'
import addBalanceAccountArData from './addBalanceAccount/addBalanceAccountArData'
export default {
  components: {
    customerSelect,
    freeDetail,
    addBalanceAccountArData
  },
  mixins: [pageMixin],
  data() {
    return {
      settlementArData: {
        settler: this.$store.getters.name,
        settleTime: new Date()
      },
      settleWayOptions: [],
      dialogType: 'add',
      tableData: [],
      arSettleVisible1: false,
      fileList: [],
      queryLoading: false,
      // 费用以及成本明细弹窗
      freeDetailVisible: false,
      freeType: 'Charge', // 所需要的费用以及成本类型
      waybillFree: '', // 运单的费用或成本
      getRowKeys(row) { // 行id
        return row.id
      },
      rules: {
        customerId: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        // ar: [
        //   { required: true, message: '请输入应收款', trigger: 'blur' }
        // ],
        actualAr: [
          { required: true, message: '请输入实收款', trigger: 'blur' }
        ],
        settleWay: [
          { required: true, message: '请选择结算方式', trigger: 'blur' }
        ]

      },
      addBalanceAccountArDataVisible: false // 添加应收对账单dialog显示
    }
  },
  mounted() {
    // 结算方式下拉框列表
    WaybillApi.getAllTypeList(1326439352527618049n).then(res => {
      this.settleWayOptions = res.data
      if (this.add) {
        this.$set(this.formData, 'settleWay', this.settleWayOptions[0].id)
      }
    }).catch(err => {
      this.$message.error(err)
    })
  },
  // 父组件中返回要传给下级的数据
  provide() {
    return {
      getCustomerId: this.getCustomerId
    }
  },
  methods: {
    /**
     * 获取编辑信息
     */
    getEditInfo(row) {
      settlementArApi.getEditInfo(row.id).then(res => {
        const tableData = res.settlementArDetailDTOList.map(item => {
          Object.assign(item.balanceAccountArDTO, item.waybill, { id: item.waybill.id, balanceAccountArId: item.balanceAccountArDTO.id })
          return item.balanceAccountArDTO
        })
        this.changeCustomerId(res.customerId)
        this.settlementArData = res
        this.tableData = tableData
        this.dialogType = 'edit'
      })
    },
    /**
     * 获取客户id
     */
    getCustomerId() {
      return this.settlementArData.customerId
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
     * 子组件选框发送customerId
     */
    changeCustomerId(customerId) {
      this.$refs.customerSelect.customerId = customerId
      this.settlementArData.customerId = customerId
    },
    settlementArDataCancelHandel() {
      this.settlementArData = {
        settler: this.$store.getters.name,
        settleTime: new Date()
      }
      this.tableData = []
      this.$refs.customerSelect.customerId = ''
      this.$emit('settlementArDataCancelHandel')
    },
    /**
     * 删除按钮
     */
    onBtnDeleteClick() {
      if (!this.multiSelection.length) {
        this.$message.error('请先选择要删除的数据')
        return
      }
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      const tableData = [...this.tableData]
      this.multiSelection.map(delItem => {
        this.tableData.map(item => {
          if (item.orderNo === delItem.orderNo) {
            tableData.remove(item)
          }
        })
      })
      this.tableData = tableData
      this.$refs.tableData.clearSelection()
    },
    /**
     * 确认制定应收结算计划
     */
    settlementArDataConfirm() {
      let isValid = true
      this.$refs['settlementArData'].validate((valid) => {
        isValid = valid
      })
      if (!isValid) {
        return
      }
      if (!this.tableData.length) {
        this.$message.error('请选择结算数据')
        return
      }
      const settlementArDTO = this.settlementArData
      settlementArDTO.settleTime = this.formatTime(settlementArDTO.settleTime)
      const settlementArDetailDTOList = this.tableData.map(item => {
        return {
          waybillId: item.id,
          balanceAccountArId: item.balanceAccountArId,
          waybillNo: item.mailNo,
          amount: item.free.Charge
        }
      })
      Object.assign(settlementArDTO, { settlementArDetailDTOList })
      settlementArApi[this.dialogType](settlementArDTO).then(res => {
        if (!res) {
          this.$message.error('未知错误')
        } else {
          this.$message.success(`${this.dialogType === 'edit' ? '编辑' : '制定'}结算单成功`)
        }
        this.settlementArDataCancelHandel()
      })
      //
      // this.tableData
    },
    /**
     * 时间格式化
     * @param time 传入所需格式化时间
     */
    formatTime(time) {
      if (!time) {
        return
      }
      time = new Date(time)
      time = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ' +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
    },
    /**
     * 弹窗挑选确认
     */
    addBalanceAccountArDataConfirm(waybillData) {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      // settlementArData.ar
      this.addBalanceAccountArDataVisible = false
      const oldTableData = this.tableData
      waybillData.map(item => {
        this.tableData.map(itemTD => {
          if (item.orderNo === itemTD.orderNo) {
            oldTableData.remove(itemTD)
          }
        })
      })
      this.tableData = [...new Set([...oldTableData, ...waybillData])]
      let ar = 0
      this.tableData.map(item => {
        ar += item.free.Charge
      })
      this.settlementArData.ar = ar.toFixed(2)
    },
    /**
     * 弹窗挑选取消
     */
    addBalanceAccountArDataCancelHandel() {
      this.addBalanceAccountArDataVisible = false
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    importImgChange(file, fileList) {
      // this.fileList = fileList
    },
    /**
     * 增加对账单
     */
    onBtnAddClick() {
      if (!this.settlementArData.customerId) {
        this.$message.warning('请先选择客户再添加明细')
        return
      }
      this.addBalanceAccountArDataVisible = true
      this.$nextTick(() => {
        this.$refs.addBalanceAccountArData.initData()
      })
    },
    /**
     * 表格选择事件
     */
    handleSelectionChange(row) {
      this.multiSelection = row
    }
  }
}
</script>
