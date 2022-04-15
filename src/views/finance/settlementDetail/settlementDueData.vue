<template>
  <div style="height:740px">
    <el-form ref="settlementDueData" :inline="true" :model="settlementDueData" :rules="rules" size="mini" label-width="70px">
      <el-col :span="5">
        <el-form-item label="承运商" prop="carrierId">
          <customerSelect ref="carrierSelect" :is-customer="false" @changeCarrierId="changeCarrierId" />
        </el-form-item>
        <el-form-item label="结算人">
          <el-input v-model="settlementDueData.settler" disabled style="width:110%" placeholder="" />
        </el-form-item>
        <!-- <el-form-item label="结算单号">
          <el-input v-model="settlementDueData.settleNo" placeholder="" style="width:110%" />
        </el-form-item> -->
      </el-col>
      <el-col :span="5">
        <el-form-item label="应付款" prop="due">
          <el-input v-model="settlementDueData.due" readonly placeholder="系统自动计算" />
        </el-form-item>
        <el-form-item label="实付款" prop="actualDue">
          <el-input v-model="settlementDueData.actualDue" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="结算方式" prop="settleWay" label-width="80px">
          <el-select
            v-model="settlementDueData.settleWay"
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
            v-model="settlementDueData.settleTime"
            type="date"
            style="width:92%"
            placeholder="选择日期"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="备注">
          <el-input v-model="settlementDueData.remark" />
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
      <el-table-column label="对账单号" prop="balanceAccountDueNo" width="100" align="center" />
      <el-table-column label="订单号" prop="orderNo" width="150" align="center" />
      <el-table-column label="运单号" prop="mailNo" width="110" align="center" />
      <el-table-column label="客户" prop="customer" width="110" show-overflow-tooltip align="center" />
      <el-table-column label="货品" prop="goods" show-overflow-tooltip align="center" />
      <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip align="center" />
      <el-table-column label="承运商1" prop="carrierDTO1.name" width="70" show-overflow-tooltip />
      <el-table-column label="承运商2" prop="carrierDTO2.name" width="70" show-overflow-tooltip />
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
      <el-table-column label="下单时间" prop="placeBillwayTime" width="100" show-overflow-tooltip align="center" />
      <el-table-column label="对账时间" prop="checkTime" width="100" align="center" />
      <!-- <el-table-column label="审核状态" prop="accountStatus" align="center" /> -->
      <el-table-column label="仓库" prop="warehouseAddress" show-overflow-tooltip align="center" />
      <el-table-column label="数量" prop="quantity" width="60" align="center" />
      <el-table-column label="重量" prop="weight" width="60" align="center" />
      <el-table-column label="体积" prop="cubage" width="60" align="center" />
      <el-table-column label="计价方式" width="80" prop="dictionaryVO.name" align="center" />

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
      <el-button @click="settlementDueDataCancelHandel">取消</el-button>
      <el-button type="primary" @click="settlementDueDataConfirm">确 定</el-button>
    </span>
    <el-dialog
      v-dialogDrag
      top="1vh"
      title="对账信息"
      style="height:1000px"
      :before-close="addBalanceAccountDueDataCancelHandel"
      :close-on-click-modal="false"
      :visible.sync="addBalanceAccountDueDataVisible"
      :append-to-body="true"
      width="90%"
    >
      <addBalanceAccountDueData
        ref="addBalanceAccountDueData"
        @addBalanceAccountDueDataCancelHandel="addBalanceAccountDueDataCancelHandel"
        @addBalanceAccountDueDataConfirm="addBalanceAccountDueDataConfirm"
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
import { settlementDueApi } from '@/api/finance/settlementDue'

import { pageMixin } from '@/views/mixin/page'
import { client } from '@/api/ali-oss/oss' // 引入oss.js文件

import freeDetail from '../detail/freeDetail'
import customerSelect from '../components/customerSelect'
import addBalanceAccountDueData from './addBalanceAccount/addBalanceAccountDueData'
export default {
  components: {
    customerSelect,
    freeDetail,
    addBalanceAccountDueData
  },
  mixins: [pageMixin],
  data() {
    return {
      settlementDueData: {
        settler: this.$store.getters.name,
        settleTime: new Date()
      },
      settleWayOptions: [],
      dialogType: 'add',
      tableData: [],
      dueSettleVisible1: false,
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
        carrierId: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        // due: [
        //   { required: true, message: '请输入应付款', trigger: 'blur' }
        // ],
        actualDue: [
          { required: true, message: '请输入实付款', trigger: 'blur' }
        ],
        settleWay: [
          { required: true, message: '请选择结算方式', trigger: 'blur' }
        ]

      },
      addBalanceAccountDueDataVisible: false // 添加应付对账单dialog显示
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
      getCarrierId: this.getCarrierId
    }
  },
  methods: {
    /**
     * 获取客户id
     */
    getCarrierId() {
      return this.settlementDueData.carrierId
    },
    /**
     * 获取编辑信息
     */
    getEditInfo(row) {
      settlementDueApi.getEditInfo(row.id).then(res => {
        const tableData = res.settlementDueDetailDTOList.map(item => {
          Object.assign(item.balanceAccountDueDTO, item.waybillDTO, { id: item.waybillDTO.id, balanceAccountDueId: item.balanceAccountDueDTO.id })
          return item.balanceAccountDueDTO
        })
        this.changeCarrierId(res.carrierId)
        this.settlementDueData = res
        this.tableData = tableData
        this.dialogType = 'edit'
      })
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
     * 子组件选框发送carrierId
     */
    changeCarrierId(carrierId) {
      this.$refs.carrierSelect.carrierId = carrierId
      this.settlementDueData.carrierId = carrierId
    },
    settlementDueDataCancelHandel() {
      this.settlementDueData = {
        settler: this.$store.getters.name,
        settleTime: new Date()
      }
      this.tableData = []
      this.$refs.carrierSelect.carrierId = ''
      this.$emit('settlementDueDataCancelHandel')
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
     * 确认制定应付结算计划
     */
    settlementDueDataConfirm() {
      let isValid = true
      this.$refs['settlementDueData'].validate((valid) => {
        isValid = valid
      })
      if (!isValid) {
        return
      }
      if (!this.tableData.length) {
        this.$message.error('请选择结算数据')
        return
      }
      const settlementDueDTO = this.settlementDueData
      settlementDueDTO.settleTime = this.formatTime(settlementDueDTO.settleTime)
      const settlementDueDetailDTOList = this.tableData.map(item => {
        return {
          waybillId: item.id,
          balanceAccountDueId: item.balanceAccountDueId,
          waybillNo: item.mailNo,
          amount: item.free.Charge
        }
      })
      Object.assign(settlementDueDTO, { settlementDueDetailDTOList })
      settlementDueApi[this.dialogType](settlementDueDTO).then(res => {
        if (!res) {
          this.$message.error('未知错误')
        } else {
          this.$message.success(`${this.dialogType === 'edit' ? '编辑' : '增加'}结算单成功`)
        }
        this.settlementDueDataCancelHandel()
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
    addBalanceAccountDueDataConfirm(waybillData) {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      
      this.addBalanceAccountDueDataVisible = false
      const oldTableData = this.tableData
      waybillData.map(item => {
        this.tableData.map(itemTD => {
          
          if (item.orderNo === itemTD.orderNo) {
            oldTableData.remove(itemTD)
          }
        })
      })
      this.tableData = [...new Set([...oldTableData, ...waybillData])]
      let due = 0
      this.tableData.map(item => {
        item.waybillSendCostDTOS.map(itemC => {
          if (itemC.carrierId === this.settlementDueData.carrierId) {
            due += itemC.fee
          }
        })
      })
      this.settlementDueData.due = due.toFixed(2)
    },
    /**
     * 弹窗挑选取消
     */
    addBalanceAccountDueDataCancelHandel() {
      this.addBalanceAccountDueDataVisible = false
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
      if (!this.settlementDueData.carrierId) {
        this.$message.warning('请先选择承运商再添加明细')
        return
      }
      this.addBalanceAccountDueDataVisible = true
      this.$nextTick(() => {
        this.$refs.addBalanceAccountDueData.initData()
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
