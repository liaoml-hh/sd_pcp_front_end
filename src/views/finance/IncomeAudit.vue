<template>
  <div>
    <div style="margin-bottom:6%">
      <div style="height:2px"><!--查询区-->
        <el-form :model="searchForm" size="mini" label-width="90px">
          <el-col :span="4">
            <el-form-item label="订单号">
              <el-input v-model="searchForm.orderNo" placeholder="" />
            </el-form-item>
            <el-form-item label="运单号">
              <el-input v-model="searchForm.mailNo" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="承运商">
              <!-- <el-input v-model="searchForm.first" placeholder="" /> -->
              <el-select v-model="searchForm.carrierId" clearable filterable>
                <el-option
                  v-for="item in carrierList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户">
              <el-select
                v-model="searchForm.ids"
                filterable
                multiple
                clearable
                size="mini"
                @change="getWarehouse"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户结算方式" label-width="110px">
              <el-select v-model="searchForm.customerSetType" clearable>
                <el-option
                  v-for="item in settleWayOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="承运商结算方式" label-width="110px">
              <el-select v-model="searchForm.carrierSetType" clearable>
                <el-option
                  v-for="item in settleWayOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="仓库">
              <el-select
                v-model="searchForm.warehouseName"
                filterable
                style="width:113%"
                clearable
                size="mini"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.name"
                  size="mini"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="timeList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                style="width:220px"
                end-placeholder="结束日期"
                @change="changeTime"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" " style="margin-top:32%">
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </div>
    <div style="margin-bottom:10px;margin-left: 5px;height:30px">
      <el-button size="mini" style="float:left" icon="el-icon-share" type="primary" @click="handleExport">导出</el-button>
      <el-button v-show="tabName === 'first'" size="mini" style="float:left" type="warning" @click="passCheck">通过审核</el-button>
    </div>
    <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="未审核" name="first">
          <el-table
            ref="table"
            v-loading="queryLoading"
            element-loading-text="Loading"
            :data="tableData"
            fit
            highlight-current-row
            border
            height="600"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @expand-change="expandChange"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleDbClick"
          >
            <el-table-column type="selection" reserve-selection width="45" />
            <el-table-column label="序号" type="index" width="45" />
            <el-table-column class="orderTableDetail" align="center" prop="orderTableDetail" label="明细" type="expand" width="50">
              <template slot-scope="{row}">
                <incomeAuditDetail style="margin-left:89px" :waybill-charge-d-t-o-s="row.waybillChargeDTOS" :waybill-send-cost-d-t-o-s="row.waybillSendCostDTOS" />
              </template>
            </el-table-column>
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
            <el-table-column label="计价方式" prop="dictionaryDTO.value" width="70" />
            <el-table-column label="运输方式" prop="waybillTypeDICDTO.value" width="70" show-overflow-tooltip />
            <el-table-column label="承运商1" prop="carrierDTO1.name" width="70" show-overflow-tooltip />
            <el-table-column label="承运商2" prop="carrierDTO2.name" width="70" show-overflow-tooltip />
            <el-table-column label="始发地地址" align="center" width="90" show-overflow-tooltip prop="startAddress" />
            <el-table-column label="目的地地址" width="90" show-overflow-tooltip prop="goalAddress" />
            <el-table-column label="费用" sortable prop="waybillCharges" width="50" align="center">
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCharges?row.waybillCharges:0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="成本" sortable prop="waybillCost" width="50" align="center">
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCost?row.waybillCost:0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="应收" sortable prop="free.Charge" width="50" align="center">
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.Charge
                      ?'0':row.free.Charge
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="应付" sortable prop="free.SendCost" width="50" align="center">
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.SendCost
                      ?'0':row.free.SendCost
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="委托事项" width="50" show-overflow-tooltip prop="entrustThing" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleUpdateMoney(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="second">
          <el-table
            ref="approvalTable"
            v-loading="queryLoading"
            :data="tableData"
            element-loading-text="Loading"
            fit
            highlight-current-row
            border
            height="600"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @expand-change="expandChange"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleDbClick"
          >
            <el-table-column type="selection" reserve-selection width="45" />
            <el-table-column label="序号" type="index" width="45" />
            <el-table-column class="orderTableDetail" align="center" prop="orderTableDetail" label="明细" type="expand" width="50">
              <template slot-scope="{row}">
                <incomeAuditDetail :waybill-charge-d-t-o-s="row.waybillChargeDTOS" :waybill-send-cost-d-t-o-s="row.waybillSendCostDTOS" />
              </template>
            </el-table-column>
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
            <el-table-column label="收货人" width="60" prop="receiver" align="center" show-overflow-tooltip />
            <el-table-column label="收货人公司" width="80" prop="receiverCompany" align="center" show-overflow-tooltip />
            <el-table-column label="计价方式" prop="dictionaryDTO.value" width="70" />
            <el-table-column label="运输方式" prop="waybillTypeDICDTO.value" width="70" show-overflow-tooltip />
            <el-table-column label="承运商1" prop="carrierDTO1.name" width="70" show-overflow-tooltip />
            <el-table-column label="承运商2" prop="carrierDTO2.name" width="70" show-overflow-tooltip />
            <el-table-column label="始发地地址" align="center" width="90" show-overflow-tooltip prop="startAddress" />
            <el-table-column label="目的地地址" width="90" show-overflow-tooltip prop="goalAddress" />
            <el-table-column label="费用" sortable prop="waybillCharges" width="50" align="center">
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCharges?row.waybillCharges:0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="成本" sortable prop="waybillCost" width="50" align="center">
              <template slot-scope="{row}">
                <span>
                  {{ row.waybillCost?row.waybillCost:0 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="应收" sortable prop="free.Charge" width="50" align="center">
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.Charge
                      ?'0':row.free.Charge
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="应付" sortable prop="free.SendCost" width="50" align="center">
              <template slot-scope="{row}">
                <span v-if="!Object.keys(row.free).length">
                  0
                </span>
                <span v-else>
                  {{
                    !row.free.SendCost
                      ?'0':row.free.SendCost
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="委托事项" width="50" show-overflow-tooltip prop="entrustThing" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-pagination
      :current-page="page.pageNum"
      :page-sizes="[1, 5, 10, 20, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="sizeChange"
      @current-change="currentChange"
    />

    <!-- dialog区域 -->
    <el-dialog
      v-dialogDrag
      top="1vh"
      title="运单详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <waybillInfoDG
        ref="waybillInfoDG"
        :readonly="waybillDetailDisabled"
        :waybill-info-detail-query-loading="waybillInfoDetailQueryLoading"
        :data="waybillInfo"
        :tab-name="tabName"
        @showAddReceiver="showAddReceiver"
        @handleUpdateForm="handleUpdateForm"
        @cancelDetailDialog="cancelDetailDialog"
      />
    </el-dialog>
    <!-- 运单详情中添加收货人 -->
    <el-dialog v-dialogDrag :before-close="parentCancelAddreceiverHandel" :close-on-click-modal="false" style="left:10%;height:100%" top="15vh" :visible.sync="addReceiverDialogVisible" width="50%" append-to-body title="增加收货人">
      <addReceiver ref="addReceiver" @addReceiverInfo="addReceiverInfo" @parentCancelHandel="parentCancelAddreceiverHandel" @close="parentCancelAddreceiverHandel" />
    </el-dialog>
  </div>
</template>

<script>

import incomeAuditDetail from './detail/incomeAuditDetail'
import waybillInfoDG from './detail/waybillInfoDG'
import addReceiver from '@/views/waybill/addReceiver'

import { AuditApi } from '@/api/finance/IncomeAudit'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
// import { pageMixin } from '@/views/mixin/page'
import { exportExcel } from '@/utils/ExcelUtils'
import { WaybillApi } from '@/api/waybill/waybill'
import Clipboard from 'clipboard'

export default {
  name: 'IncomeAudit',
  components: { incomeAuditDetail, waybillInfoDG, addReceiver },
  // mixins: [pageMixin],
  data() {
    return {
      moneyForm: {},
      multiSelection: [],
      // 下单时间初始化
      timeList: [],
      searchForm: {
        placeStartTime: this.formatTime(new Date(), true),
        placeEndTime: new Date()
      },
      approvalFrom: {},
      activeName: 'first',
      itemDialogVisible: false,
      moneyFormVisible: false,
      dialogVisible: false,
      waybillInfo: [],
      waybillDetailDisabled: true,
      waybillInfoDetailQueryLoading: false,
      settleWayOptions: [], // 客户以及承运商结算方式
      tableData: [],
      carrierList: [], // 承运商下拉框列表
      rowData: {},
      expands: [], // 展开行
      getRowKeys(row) { // 行id
        return row.id
      },
      itemTableData: [{ goods: 'iphon12', num: 3, cubage: 200, weight: 50 }, { goods: 'xiaomi', num: 2, cubage: 200, weight: 50 }, { goods: 'huawei', num: 1, cubage: 200, weight: 50 }],
      page: { // 分页
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      tabName: 'first',
      queryLoading: false,
      addReceiverDialogVisible: false, // 收货人增加弹窗
      customerList: [], // 客户下拉列表
      warehouseList: [] // 仓库下拉列表
    }
  },
  created() {
  },
  mounted() {
    this.timeList = [this.formatTime(new Date(), true), new Date()]
    this.getTableData(this.searchForm)
    // 获取承运商列表
    planAndExecuteApi.getCarrierList({ pageSize: 1000 }).then(res => {
      this.carrierList = res.data
    })
    // 客户以及仓库下拉框
    planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      this.customerList = res.customerDTOS
      this.warehouseList = res.customerWarehouseVOS
    }).catch(err => {
      this.$message.error(err)
    })
    /**
     * 结算方式下拉框
     */
    WaybillApi.getAllTypeList(1326439352527618049n).then(res => {
      this.settleWayOptions = res.data
    }).catch(err => {
      this.$message.error(err)
    })
  },
  methods: {
    /**
     * 获取指定客户的仓库
     */
    getWarehouse(ids) {
      planAndExecuteApi.queryCustomerAndWarehouse({ ids }).then(res => {
        this.warehouseList = res.customerWarehouseVOS
        if (this.warehouseList.length) {
          this.$set(this.searchForm, 'warehouseName', this.warehouseList[0].name)
        } else {
          this.$set(this.searchForm, 'warehouseName', '')
        }
      })
    },
    /**
     * 运单窗口关闭
     */
    cancelDetailDialog() {
      this.dialogVisible = false
      this.addFlag = false
    },
    /**
     * 运单编辑确认
     */
    handleUpdateForm() {
      const waybillSendCostDTOS = []
      const waybillChargeDTOS = []
      this.$refs.waybillInfoDG.waybillChargeInfo.map(itemChargeInfos => {
        let rateType, fee, id, version
        // rate, chargesRef,
        itemChargeInfos.map(item => {
          if (item.rateType) {
            rateType = item.rateType
            id = item.id
            version = item.version
          } else if (item.fee) {
            fee = item.fee
          }
          // else if (item.chargesRef) {
          //   chargesRef = item.chargesRef
          // }
          // else if (item.rate) {
          //   rate = item.rate
          // }
        })
        // && !chargesRef
        if (!rateType) {
          return
        }
        waybillChargeDTOS.push({
          rateType, fee, id, version,
          // rate, chargesRef,
          waybillId: this.$refs.waybillInfoDG.formData.id
        })
      })
      this.$refs.waybillInfoDG.waybillSendCostInfo.map(itemSendCostInfos => {
        let feeType, carrierId, fee, id, version
        // rate,settleWay, costRef,
        itemSendCostInfos.map(item => {
          if (item.feeType) {
            feeType = item.feeType
            id = item.id
            version = item.version
          } else if (item.fee) {
            fee = item.fee
          } else if (item.carrierId) {
            carrierId = item.carrierId
          }
          // else if (item.settleWay) {
          //   settleWay = item.settleWay
          // } else if (item.costRef) {
          //   costRef = item.costRef
          // }
          // else if (item.rate) {
          //   rate = item.rate
          // }
        })
        //  && !settleWay && !costRef
        if (!feeType) {
          return
        }
        waybillSendCostDTOS.push({
          feeType, carrierId, fee, id, version,
          // rate, settleWay, costRef,
          waybillId: this.$refs.waybillInfoDG.formData.id
        })
      })
      // if (this.$refs.waybillInfoDG.waybillChargeDTOS.length) {
      //   WaybillApi.updatedCharge(this.$refs.waybillInfoDG.waybillChargeDTOS).then(res => {
      //     if (res) {
      //       this.$message.success('费用信息修改成功')
      //     } else {
      //       this.$confirm('费用信息修改失败请重新对费用信息进行更改！', '提示', {
      //         confirmButtonText: '确定',
      //         type: 'warning',
      //         callback: actions => {}
      //       })
      //     }
      //   }).catch(err => {
      //     this.$message.error(err)
      //     this.$alert('费用信息修改失败请重新对费用信息进行更改！', '提示', {
      //       confirmButtonText: '确定',
      //       type: 'warning',
      //       callback: actions => {}
      //     })
      //   })
      // }
      // if (this.$refs.waybillInfoDG.waybillSendCostDTOS.length) {
      //   WaybillApi.updatedSendCost(this.$refs.waybillInfoDG.waybillSendCostDTOS).then(res => {
      //     console.log(res)
      //     if (res) {
      //       this.$message.success('成本信息修改成功')
      //     } else {
      //       this.$confirm('成本信息修改失败请重新对成本信息进行更改！', '提示', {
      //         confirmButtonText: '确定',
      //         type: 'warning'
      //       })
      //     }
      //   }).catch(err => {
      //     this.$message.error(err)
      //     this.$alert('成本信息修改失败请重新对成本信息进行更改！', '提示', {
      //       confirmButtonText: '确定',
      //       type: 'warning',
      //       callback: actions => {}
      //     })
      //   })
      // }
      const form = this.$refs.waybillInfoDG.formData
      form.placeBillwayTime = new Date(form.placeBillwayTime).format('yyyy-MM-dd hh:mm:ss')
      const allData = {}
      Object.assign(allData, form,
        { waybillChargeDTOS },
        { waybillSendCostDTOS }
      )
      WaybillApi.update(allData).then(res => {
        if (res) {
          this.$message.success('运单信息修改成功')
        } else {
          this.$message.success('运单信息修改失败请重试')
        }
        this.getTableData(this.searchForm)
        this.dialogVisible = false
      }).catch(err => {
        this.$message.error(err)
        this.$message.error('运单信息修改失败请重试')
      })
    },
    /**
     * 展开明细事件
     */
    expandChange(row, expandedRows) {
      // 全屏遮罩加载显示
      this.expand_change_arr = row
      // this.detailQueryLoading = true
      //	每次只展开一个扩展列表
      if (expandedRows.length) {
        if (row) {
          this.expands = [row.id]
        }
      } else {
        this.expands = []
      }
      // this.handleRowClick(row)
    },
    // 监听查询时间变化
    changeTime() {
      if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
        this.searchForm.placeStartTime = this.timeList[0]
        this.searchForm.placeEndTime = this.timeList[1]
      } else {
        this.searchForm.placeStartTime = null
        this.searchForm.placeEndTime = null
      }
    },
    // 展示增加收货人
    showAddReceiver() {
      this.addReceiverDialogVisible = true
    },
    /**
     * 收货人点击 取消 关闭对话框的回调
     */
    parentCancelAddreceiverHandel() {
      this.addReceiverDialogVisible = false
    },
    /**
     * 从子组件增加收货人点击确定之后获取所增加的信息
     */
    addReceiverInfo(receiverInfo) {
      this.$set(this.$refs.waybillInfoDG.formData, 'receiver', receiverInfo.name)
      this.$set(this.$refs.waybillInfoDG.formData, 'receiverMobile', receiverInfo.mobile)
      this.$set(this.$refs.waybillInfoDG.formData, 'receiverEmail', receiverInfo.email)
      this.$set(this.$refs.waybillInfoDG.formData, 'goalProvince', receiverInfo.province)
      this.$set(this.$refs.waybillInfoDG.formData, 'goalCity', receiverInfo.city)
      this.$set(this.$refs.waybillInfoDG.formData, 'goalCounty', receiverInfo.county)
      this.$set(this.$refs.waybillInfoDG.formData, 'goalAddress', receiverInfo.address)
    },
    /**
     * 时间格式化
     * @param time 传入所需格式化时间
     */
    formatTime(time, isMonthBegin = false) {
      if (!time) {
        return
      }
      time = new Date(time)
      if (!isMonthBegin) {
        time = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ' +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      } else {
        time = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        1 + ' ' +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      }

      return time
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
    // 监听分页页数变化
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    // 分页监听页码变化
    currentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm, false)
    },
    handleExport() {
      exportExcel(this.$refs.table, '收支审核')
    },
    passApproval() {
      const p = []
      p.push({
        id: this.rowData.id,
        auditVerdict: this.approvalFrom.text
      })
      AuditApi.passApproval(p).then(res => {
        this.$message.success('操作成功!')
        this.getTableData()
        this.itemDialogVisible = false
      })
    },
    /**
     * 编辑事件
     */
    handleUpdateMoney(row) {
      WaybillApi.getWaybillInfo(row.id).then(res => {
        this.editAndMerge(res)
      }).catch(() => {
        this.$message.error('网络错误，请重试')
      })
    },
    /**
     * 编辑以及合单都调用此方法
     * @param res 传后端返回的数据
     */
    editAndMerge(res) {
      // 对费用信息进行收录,转换成我们需要的数据形式
      const waybillChargeInfo = []
      res.waybillChargeDTOS.map(item => {
        const { rateType, id, version } = item
        let { fee } = item
        // let { rate, fee, chargesRef, } = item
        // if (!parseFloat(rate)) {
        //   rate = 0
        // }
        if (!parseFloat(fee)) {
          fee = 0
        }
        const waybillCharge = [
          { label: '费用类型', rateType, value: 'rateType', id, version },
          // { label: '收费依据', chargesRef, value: 'chargesRef' },
          // { label: '费率', rate, value: 'rate' },
          { label: '费用', fee, value: 'fee' }
        ]
        waybillChargeInfo.push(waybillCharge)
      })
      // 对成本信息进行收录,转换成我们需要的数据形式
      const waybillSendCostInfo = []
      res.waybillSendCostDTOS.map(item => {
        const { feeType, id, version, carrierId } = item
        // , settleWay, costRef
        let { fee } = item
        // let { rate, fee } = item
        // if (!parseFloat(rate)) {
        //   console.log(parseFloat(rate))

        //   rate = 0
        // }
        if (!parseFloat(fee)) {
          fee = 0
        }
        const waybillSendCost = [
          { label: '承运商', carrierId, value: 'carrierId' },
          { label: '费用类型', feeType, value: 'feeType', id, version },
          // { label: '结算方式', settleWay, value: 'settleWay' },
          // { label: '成本依据', costRef, value: 'costRef' },
          // { label: '费率', rate, value: 'rate' },
          { label: '费用', fee, value: 'fee' }
        ]

        waybillSendCostInfo.push(waybillSendCost)
      })
      const waybillDetailList = res.waybillDetailDTOS
      // this.waybillInfo = res
      this.dialogVisible = true
      this.$nextTick(() => {
        // 判断是否为空,如果为空就提货detail组件里面所初始化的值
        if (waybillDetailList.length) {
          this.$refs.waybillInfoDG.waybillDetailList = waybillDetailList
        }
        if (waybillChargeInfo.length) {
          this.$refs.waybillInfoDG.waybillChargeInfo = waybillChargeInfo
        }
        if (waybillSendCostInfo.length) {
          this.$refs.waybillInfoDG.waybillSendCostInfo = waybillSendCostInfo
        }
        this.$refs.waybillInfoDG.formData = res
      })
      this.waybillInfoDetailQueryLoading = false
    },
    updateMoney() {
      const p = {
        id: this.moneyForm.id,
        ar: this.moneyForm.ar,
        due: this.moneyForm.due
      }
      AuditApi.commonUpdate(p).then(res => {
        this.$message.success('修改成功！')
        this.moneyFormVisible = false
        this.getTableData()
      })
    },
    handleTabClick(e) {
      this.tabName = e.name
      this.tableData = []
      this.getTableData()
    },
    getTableData(param, isClear = true) {
      if (isClear) {
        this.$refs['table'].clearSelection()
        this.$refs['approvalTable'].clearSelection()
      }
      this.queryLoading = true
      const query = {}
      var page = {
        pageNum: this.page.current,
        pageSize: this.page.pageSize
      }
      Object.assign(query, page)
      if (param) {
        Object.assign(query, param)
      }
      // query.approval = this.activeName !== 'first'
      query.incomeAuditStatus = this.activeName === 'first' ? 0 : 1
      if (query.placeStartTime && query.placeEndTime) {
        query.placeStartTime = this.dayTime(query.placeStartTime, 'start')
        query.placeEndTime = this.dayTime(query.placeEndTime, 'end')
      } else {
        query.placeStartTime = ''
        query.placeEndTime = ''
      }
      // AuditApi查询改为waybill查询结果都一样
      query.passFlag = 1
      WaybillApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        // this.tableData = res.body.data
        this.tableData = res.data
        this.queryLoading = false
      }).catch(() => {
        this.queryLoading = false
      })
    },
    /**
     * 时间格式化查询
     */
    dayTime(myTime, type) {
      const time = new Date(myTime)
      let str = ''
      myTime = time.getFullYear() + '-' +
          ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
          time.getDate()
      if (type === 'end') {
        str = ' 23:59:59'
      } else {
        str = ' 00:00:00'
      }
      return myTime + str
    },
    handleDbClick(row) {
      WaybillApi.getWaybillInfo(row.id).then(res => {
        this.editAndMerge(res)
      }).catch(() => {
        this.$message.error('网络错误，请重试')
      })
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    },
    /**
     * 查询事件
     */
    handleSearch() {
      const p = Object.assign({}, this.searchForm)
      this.page.current = 1
      this.getTableData(p)
    },
    passCheck() {
      if (!this.multiSelection || this.multiSelection.length < 1) {
        this.$message.info('请先勾选数据！！！')
        return
      }
      const p = []
      for (const item of this.multiSelection) {
        p.push({ id: item.id })
      }
      AuditApi.passApproval(p).then(res => {
        this.$message.success('操作成功!')
        this.getTableData()
        this.multiSelection = []
        this.$refs.table.clearSelection()
      })
    }
  }
}
</script>

<style scoped>
  .el-tabs>>>.el-tabs__header{
    margin: 0;
  }

  .el-table{
    margin: 0;
    font-size: 8px;
    width: 100%!important;
  }
  /* .el-table>>>td, .el-table>>>th {
    padding: 11px 0;
  } */

</style>
<style>
div{
  display: block;
}
  .el-table__expanded-cell[class*=cell] {
    padding: 0;
  }
</style>
