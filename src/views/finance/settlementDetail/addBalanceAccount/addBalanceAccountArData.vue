<template>
  <div style="height:820px;">
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="客户" label-width="70px">
        <customerSelect ref="customerSelect" :is-disabled="true" @changeCustomerId="changeCustomerId" />
      </el-form-item>
    </el-form>
    <el-table
      v-if="btnShow"
      ref="balanceAccountArTable"
      v-loading="balanceAccountArQueryLoading"
      :data="balanceAccountArTable"
      :row-key="getRowKeys"
      fit
      highlight-current-row
      height="300"
      element-loading-text="Loading"
    >
      <!-- <el-table-column type="selection" reserve-selection align="center" /> -->
      <el-table-column type="index" width="50px" label="序号" align="center" />
      <el-table-column label="客户" prop="customerVO.name" align="center" />
      <el-table-column label="支付方式" prop="dictionaryVO.name" align="center" />
      <el-table-column label="收款期限" prop="paytimeLimit" align="center" />
      <el-table-column label="对账开始时间" prop="balanceStart" show-overflow-tooltip align="center" />
      <el-table-column label="对账结束时间" prop="balanceEnd" show-overflow-tooltip align="center" />
      <el-table-column label="对账时间" prop="checkTime" show-overflow-tooltip align="center" />
      <el-table-column label="订单数" prop="orderQuantity" align="center" />
      <el-table-column label="应收总额" prop="amount" align="center" />
      <el-table-column align="center" prop="option" label="操作">
        <template slot-scope="{row}">
          <div>
            <el-button
              v-if="btnShow"
              type="primary"
              size="mini"
              @click="addOrderSelect(row)"
            >{{ !row.selectedFlag?"加入订单挑选":'已加入挑选' }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="position:relative">
      <el-pagination
        :current-page="page.pageNum"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <el-button type="danger" size="small" style="float:right;margin-top:-30px" @click="deleteSelect">删除</el-button>
    </div>

    <el-table
      ref="waybillTable"
      v-loading="waybillQueryLoading"
      :row-key="getRowKeys"
      :data="waybillTableData"
      fit
      highlight-current-row
      height="400"
      element-loading-text="Loading"
      @selection-change="handleSelectionChange"
    >
      <!-- .balanceAccountArDetailDTOList -->
      <el-table-column align="center" width="45" type="selection" reserve-selection />
      <el-table-column type="index" align="center" width="50" label="序号" />
      <el-table-column label="对账单号" prop="balanceAccountArNo" width="100" align="center" />
      <el-table-column label="订单号" prop="orderNo" width="150" align="center" />
      <el-table-column label="运单号" prop="mailNo" width="110" align="center" />
      <el-table-column label="客户" prop="customer" width="110" show-overflow-tooltip align="center" />
      <el-table-column label="货品" prop="goods" show-overflow-tooltip align="center" />
      <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip align="center" />
      <el-table-column label="下单时间" prop="placeBillwayTime" show-overflow-tooltip align="center" />
      <el-table-column label="对账时间" prop="checkTime" show-overflow-tooltip align="center" />
      <!-- <el-table-column label="审核状态" prop="accountStatus" align="center" /> -->
      <el-table-column label="仓库" prop="warehouseAddress" show-overflow-tooltip align="center" />
      <el-table-column label="数量" prop="quantity" width="60" align="center" />
      <el-table-column label="重量" prop="weight" width="60" align="center" />
      <el-table-column label="体积" prop="cubage" width="60" align="center" />
      <el-table-column label="计价方式" width="80" prop="dictionaryVO.name" align="center" />
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

    <span slot="footer" style="float:right;margin-top:10px" class="dialog-footer">
      <el-button @click="addBalanceAccountArDataCancelHandel">取消</el-button>
      <el-button type="primary" @click="addBalanceAccountArDataConfirm">确定</el-button>
    </span>
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
import { BalanceArApi } from '@/api/finance/balanceAccountAr'
import freeDetail from '../../detail/freeDetail'
import customerSelect from '../../components/customerSelect'
import { pageMixin } from '@/views/mixin/page'
export default {
  inject: ['getCustomerId'],
  components: {
    customerSelect,
    freeDetail
  },
  mixins: [pageMixin],
  data() {
    return {
      searchForm: {},
      balanceAccountArQueryLoading: false,
      waybillQueryLoading: false,
      // 费用以及成本明细弹窗
      freeDetailVisible: false,
      freeType: 'Charge', // 所需要的费用以及成本类型
      waybillFree: '', // 运单的费用或成本
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      btnShow: true,
      balanceAccountArTable: [],
      waybillTableData: [],
      arSettleVisible2: true,
      getRowKeys(row) { // 行id
        return row.id
      },
      multiSelection: []
    }
  },
  mounted() {
  },
  methods: {
    initData() {
      this.$refs.customerSelect.customerId = this.getCustomerId()
      this.changeCustomerId(this.getCustomerId())
    },
    /**
     * 子组件选框发送customerId
     */
    changeCustomerId(customerId) {
      this.searchForm.customerId = customerId
      this.getTableData(this.searchForm, true)
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
     * 挑选对账单
     */
    addOrderSelect(row) {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      // balanceAccountArDetailDTOList
      let waybillTableData = row.balanceAccountArDetailDTOList.map(item => {
        if (item.status === 1) {
          // 合并对象，id延用waybill的id，避免照成两处表格keys重复
          Object.assign(item.waybill, row, { id: item.waybill.id, balanceAccountArId: row.id })
          return item.waybill
        }
      })
      const oldWaybillTableData = [...this.waybillTableData]
      this.waybillTableData.map(item => {
        waybillTableData.map(itemND => {
          if (itemND && itemND.orderNo === item.orderNo) {
            oldWaybillTableData.remove(item)
          }
        })
      })
      /**
       * 去除undefine,map方法缺陷
       */
      waybillTableData = waybillTableData.filter(Boolean)

      if (!row.selectedFlag) {
        // 加入
        this.waybillTableData = [...new Set([...this.waybillTableData, ...waybillTableData])]
        row.selectedFlag = 1
        this.$set(row, 'selectedFlag', 1)
      } else {
        // 取消加入
        this.waybillTableData = oldWaybillTableData
        row.selectedFlag = 0
        this.$set(row, 'selectedFlag', 0)
      }
      this.btnShow = false
      this.$nextTick(() => {
        this.btnShow = true
      })
    },
    /**
     * 取消挑选
     */
    addBalanceAccountArDataCancelHandel() {
      this.balanceAccountArTable = []
      this.waybillTableData = []
      this.$emit('addBalanceAccountArDataCancelHandel')
      this.$refs.balanceAccountArTable.clearSelection()
    },
    addBalanceAccountArDataConfirm() {
      this.$emit('addBalanceAccountArDataConfirm', this.waybillTableData)
      this.balanceAccountArTable = []
      this.waybillTableData = []
      this.$refs.balanceAccountArTable.clearSelection()
    },
    // 监听分页页数变化
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    deleteSelect() {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      const waybillTableData = this.waybillTableData
      this.multiSelection.map(item => {
        this.waybillTableData.map(itemWB => {
          if (itemWB.orderNo === item.orderNo) {
            waybillTableData.remove(itemWB)
          }
        })
      })
      this.waybillTableData = waybillTableData
      this.$refs['waybillTable'].clearSelection()
    },
    // 分页监听页码变化
    currentChange(val) {
      this.page.pageNum = val
      this.getTableData(this.searchForm, false)
    },
    /**
     * 查询
     */
    getTableData(param, isClear = true) {
      // if (isClear) {
      //   this.$refs['balanceAccountArTable'].clearSelection()
      // }
      // this.$refs['approvalTable'].clearSelection()
      this.balanceAccountArQueryLoading = true
      const query = {}
      var page = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      Object.assign(query, page)
      if (param) {
        Object.assign(query, param)
      }
      query.status = 1
      BalanceArApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        if (res.data) {
          res.data.map(item => {
            item.orderQuantity = item.balanceAccountArDetailDTOList.length
          })
        }
        this.balanceAccountArTable = res.data
        this.balanceAccountArQueryLoading = false
      }).catch(() => {
        this.balanceAccountArQueryLoading = false
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
