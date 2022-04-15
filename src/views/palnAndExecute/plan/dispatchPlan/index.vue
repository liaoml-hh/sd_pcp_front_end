<template>
  <div>
    <!--查询框 -->
    <div class="searchAndBatch">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="配送单号">
          <el-input v-model="searchForm.dispatchBillNo" clearable size="mini" />
        </el-form-item>
        <el-form-item label="调度员" style="margin-left:0.8%">
          <el-input v-model="searchForm.dispatcher" size="mini" />
        </el-form-item>
        <el-form-item label="司机" style="margin-left:1.7%">
          <el-select v-model="searchForm.driverId" filterable clearable placeholder="请选择" size="mini">
            <el-option
              v-for="item in driverList"
              :key="item.id"
              size="mini"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆" style="margin-left:0.8%">
          <el-select
            v-model="searchForm.car"
            filterable
            clearable
            style="width:176px"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in vehicleList"
              :key="item.id"
              size="mini"
              :label="item.plateNumber"
              :value="item.plateNumber"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配送类型">
          <el-select v-model="searchForm.dispatchType" clearable style="width:130%" placeholder="请选择" size="mini">
            <el-option
              v-for="item in dispatchTypeList"
              :key="item.id"
              size="mini"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="分拨点" style="margin-left:0.8%">
          <el-select v-model="searchForm.allactionCentreId" clearable placeholder="请选择" size="mini">
            <el-option
              v-for="item in allactionCentreList"
              :key="item.id"
              size="mini"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="接收状态">
          <el-select v-model="searchForm.billStatus" style="width:92%" clearable size="mini">
            <el-option
              v-for="(item,index) in billStatusList"
              :key="index"
              :value="item.billStatus"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="始发地">
          <el-input v-model="searchForm.startStation" style="width:100%" clearable size="mini">
            <!-- <el-option
              v-for="item in startStationList"
              :key="item.id"
              size="mini"
              :label="item.name"
              :value="item.id"
            /> -->
          </el-input>
        </el-form-item>
        <el-form-item label="目的地">
          <el-input v-model="searchForm.goalStation" style="width:100%" clearable size="mini">
            <!-- <el-option
              v-for="item in goalStationList"
              :key="item.id"
              size="mini"
              :label="item.name"
              :value="item.id"
            /> -->
          </el-input>
        </el-form-item>
        <el-form-item label="业务时间">
          <el-date-picker
            v-model="timeList"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:230px"
            @change="changeTime"
          />
        </el-form-item>
        <el-button style="margin-top:6px" type="primary" size="mini" @click="search()">查询</el-button>
      </el-form>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add()">增加</el-button>
      <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteSelect()">删除</el-button> -->
      <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit()">修改</el-button>
      <el-button type="primary" size="mini" icon="el-icon-document" @click="copy()">复制</el-button>
      <el-button type="primary" size="mini" icon="el-icon-warning" @click="publishPlan()">发布</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" @click="undoPlan()">作废</el-button>
      <el-button type="primary" size="mini" icon="el-icon-warning" @click="rePublishPlan()">重新发布</el-button>
    </div>
    <div>
      <el-table
        ref="table"
        v-loading="queryLoading"
        element-loading-text="Loading"
        :data="tableData"
        tooltip-effect="dark"
        border
        :row-class-name="tableRowClassName"
        :row-key="getRowKeys"
        height="600"
        :expand-row-keys="expands"
        @expand-change="expandChange"
        @sort-change="changeTableSort"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDoubleClick"
      >
        <el-table-column type="selection" reserve-selection width="40" align="center" />
        <el-table-column label="序号" width="50" type="index" align="center" />
        <el-table-column class="orderTableDetail" align="center" prop="orderTableDetail" label="明细" type="expand" width="50">
          <template slot-scope>
            <detail ref="detail" />
          </template>
        </el-table-column>
        <el-table-column prop="dispatchBillNo" sortable label="配送单号" show-overflow-tooltip align="center" />
        <el-table-column prop="dispatcher" sortable label="调度员" width="86" align="center" />
        <el-table-column prop="tel" label="电话" show-overflow-tooltip width="100" align="center" />
        <el-table-column prop="dispatchBatchNo" sortable label="配送批次" width="110" show-overflow-tooltip align="center" />
        <el-table-column prop="preSendTime" sortable label="预配送时间" width="140" align="center" />
        <el-table-column prop="createdTime" sortable label="业务时间" width="140" align="center" />
        <el-table-column prop="driver" sortable label="司机" show-overflow-tooltip align="center" />
        <el-table-column prop="car" label="车辆" align="center" />
        <el-table-column prop="allocationDTO.name" sortable label="分拨点" width="90" show-overflow-tooltip align="center">
          <template slot-scope="{row}">
            <span>
              {{ row.allocationDTO.name?row.allocationDTO.name:'无' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="companyDTO.name" sortable label="分公司" width="90" show-overflow-tooltip align="center">
          <template slot-scope="{row}">
            <span>
              {{ row.companyDTO.name?row.companyDTO.name:'无' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="carrierDTO.name" sortable label="承运商" show-overflow-tooltip align="center" />
        <el-table-column prop="dispatchType" sortable label="配送类型" show-overflow-tooltip align="center">
          <template slot-scope="{row}">
            <span>
              {{
                parseInt(row.dispatchType) === 1
                  ?'直达'
                  :parseInt(row.dispatchType) === 2
                    ?'中转'
                    :parseInt(row.dispatchType) === 3
                      ?'调拨':''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="startStation" sortable label="始发地" show-overflow-tooltip align="center" />
        <el-table-column prop="goalStation" sortable label="目的地" show-overflow-tooltip align="center" />
        <el-table-column prop="urgentDegree" sortable label="紧急程度" show-overflow-tooltip align="center">
          <template slot-scope="{row}">
            <span>
              {{
                row.urgentDegree === '1'
                  ?'加急'
                  :'正常'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="billStatus" sortable label="执行状态" width="100" align="center">
          <template slot-scope="{ row }">
            <img v-show=" parseInt(row.billStatus) === 3" :src="statusFinishImgSrc" width="40%" style="position:absolute;top:32%;right:70%;width:20px;height:20px;">
            <img v-show=" parseInt(row.billStatus) === 1" :src="statusDealAcceptImgSrc" width="40%" style="position:absolute;top:32%;right:70%;width:20px;height:20px;">
            <img v-show=" parseInt(row.billStatus) === 2" :src="statusAcceptImgSrc" width="40%" style="position:absolute;top:35%;right:72%;width:15px;height:15px;">
            <img v-show=" parseInt(row.billStatus) === 0" :src="statusRejectImgSrc" width="40%" style="position:absolute;top:35%;right:72%;width:16px;height:16px;">
            <span>
              {{
                parseInt(row.billStatus) === 1
                  ? '未接收'
                  : parseInt(row.billStatus) === 0
                    ? '已拒绝'
                    : parseInt(row.billStatus) === 2
                      ? '已接收'
                      : parseInt(row.billStatus) === 3
                        ? '已完成'
                        : parseInt(row.billStatus) === 4
                          ? '其他'
                          : row.billStatus
              }}</span>

          </template>
        </el-table-column>
        <el-table-column prop="status" sortable label="状态" align="center">
          <template slot-scope="{row}">
            <span>
              {{
                parseInt(row.status) === 0
                  ?'已作废'
                  :parseInt(row.status) === 1
                    ? '未发布'
                    : parseInt(row.status) === 2
                      ? '已发布'
                      : parseInt(row.status) === 3
                        ? '重新发布'
                        :parseInt(row.status)
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin-left: 10px;">
      <el-pagination
        :current-page="page.current"
        :page-sizes="page.sizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <!-- <el-divider content-position="left" style="margin-top:70px">配送细节展示区域(单击上表展示)</el-divider> -->
    <!-- <detail ref="detail" style="margin-top:-40px;margin-bottom:100px" /> -->
    <el-dialog v-dialogDrag :before-close="closePickupDialog" :close-on-click-modal="false" style="left:10%;height:100%" top="2vh" :visible.sync="dialogVisible" width="86%" append-to-body title="配送计划">
      <pickUp ref="pickup" :data="treeData" :type="pickupType" @parentCancelHandel="parentCancelHandel" @close="closePickup" />
    </el-dialog>
    <el-dialog v-dialogDrag :before-close="closePickupDialog" :close-on-click-modal="false" style="left:10%;height:100%" top="2vh" :visible.sync="dialogCarrierVisible" width="86%" append-to-body title="配送计划">
      <carrierDistribute ref="carrierDistribute" :data="treeData" :type="pickupType" @parentCancelHandel="parentCancelHandel" @close="closePickup" />
    </el-dialog>
  </div>
</template>

<script>
import pickUp from './pickUp.vue'
import carrierDistribute from './carrierDistribute.vue'
// import waybill from './waybill/index.vue'
import detail from './waybill/detail.vue'
import { planAndExecuteApi } from '@/api/planAndExecute/dispatchPlan'
import { getName, getTel } from '@/utils/auth'
export default {
  components: { pickUp, detail, carrierDistribute },
  data() {
    return {
      pickupType: 'add',
      dialogVisible: false,
      queryLoading: false,
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      statusFinishImgSrc: require('../../../../assets/404_images/finish.png'),
      statusDealAcceptImgSrc: require('../../../../assets/404_images/dealAccept.png'),
      statusAcceptImgSrc: require('../../../../assets/404_images/accept.png'),
      statusRejectImgSrc: require('../../../../assets/404_images/reject.png'),
      driverList: [], // 司机下拉列表
      // 配送类型下拉框
      dispatchTypeList: [
        { id: 1, name: '直达' },
        { id: 2, name: '中转' }
        // { id: 3, name: '调拨' }
      ],
      billStatusList: [
        { billStatus: 1, name: '未接收' },
        { billStatus: 2, name: '已接收' },
        { billStatus: 3, name: '已完成' },
        { billStatus: 0, name: '已拒绝' }
      ],
      vehicleList: [], // 车辆下拉列表
      // 分拨点下拉框
      allactionCentreList: [],
      tableData: [],
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      // startStationList: [],
      goalStationList: [],
      searchForm: {
        dispatchBillNo: '',
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        car: '',
        driverId: '',
        billStatus: ''
      },
      treeData: [],
      multiSelection: [],
      waybillTableVisible: false,
      dialogQueryLoading: false, // 弹窗加载
      dialogCarrierVisible: false, // 弹出隐藏
      expands: [], // 展开行
      getRowKeys(row) { // 行id
        return row.id
      }
    }
  },

  created() {
    // 获取司机下拉框数据
    planAndExecuteApi.queryDriver().then(res => {
      this.driverList = res
    }).catch(err => {
      this.$$message.error(err)
      this.$$message.error('获取司机下拉框数据失败，请刷新')
    })
    // 车辆下拉
    planAndExecuteApi.getVehicle().then(res => {
      console.log(res)
      this.vehicleList = res.data
    })
    // 获取配送类型下拉框数据
    planAndExecuteApi.allocation().then(res => {
      this.allactionCentreList = res.data
    })
  },
  mounted() {
    this.getTableData(this.searchForm)
  },
  methods: {
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
        this.handleRowClick(row)
      } else {
        this.expands = []
      }
    },
    // 监听表格排序变化
    changeTableSort(column) {
      console.log(column)
      console.log(this.$refs.table.tableData)
      // 获取排序后的数据
      this.tableData = this.$refs.table.tableData

      console.log(this.tableData)
    },
    /**
     * 点击 X 关闭对话框的回调
     */
    closePickupDialog() {
      this.dialogVisible = false
      this.dialogCarrierVisible = false
      this.$refs.pickup.plan = { // 初始化回去
        id: '', dispatchBillNo: '', dispatchBatchNo: '', startStation: '',
        goalStation: '', urgentDegree: '2', transportWay: '陆运方式', dispatchType: '1',
        preSendTime: '', car: '', driverId: '', driver: '',
        dispatcher: getName(), tel: getTel(), version: ''
      }
      this.$refs.pickup.tableData = []
      this.$refs.carrierDistribute.allData = [
        { plan: { id: '', dispatchBillNo: '', dispatchBatchNo: '', dispatchType: '2',
          startStation: '', goalStation: '', urgentDegree: '2', preSendTime: '',
          transportWay: '陆运方式', car: '', isMainPlan: true, // 标记主从计划
          driverId: '', driver: '', dispatcher: getName(),
          tel: getTel()
        }, tableData: [] }
      ]
    },
    // 单击事件
    handleRowClick(row) {
      // this.$refs.detail.queryLoading = true
      setTimeout(() => {
        this.$set(this.$refs.detail, 'queryLoading', true)
      })
      setTimeout(() => {
        this.$set(this.$refs.detail, 'queryLoading', false)
      }, 1000)

      // this.$refs.detail.detailTableHeight = 84
      // this.$refs.detail.tableData = []
      planAndExecuteApi.showPlan(row.id).then(res => {
        res.waybillDTOList.map(item => {
          if (item.placeBillwayTime) {
            item.placeBillwayTime = this.formatTime(item.placeBillwayTime)
          }
          if (item.updatedTime) {
            item.updatedTime = this.formatTime(item.updatedTime)
          }
        })

        this.$forceUpdate()
        this.$nextTick(() => {
          if (res.waybillDTOList.length >= 2) {
            this.$refs.detail.detailTableHeight = 350
          } else {
            this.$refs.detail.detailTableHeight = ''
          }
          this.$set(this.$refs.detail, 'tableData', res.waybillDTOList)
          // this.$refs.detail.tableData = res.waybillDTOList
          this.$refs.detail.queryLoading = false
        })
      }).catch(() => {
        this.$refs.detail.queryLoading = false
      })
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
            (time.getHours() + 1 < 10 ? ('0' + time.getHours()) : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
            (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
    },
    handleRowDoubleClick(row) {
      if (parseInt(row.billStatus) === 2) {
        this.$message.warning(`司机已接收任务，无法编辑`)
        return
      }
      this.pickupType = (row.carrierDTO && row.carrierDTO.name)
        ? 'carrierEdit' : 'edit'
      if (this.pickupType === 'edit') {
        this.dialogVisible = true
        this.$nextTick(function() {
          this.$refs.pickup.queryLoading = true
          this.$refs.pickup.init(row.id)
        })
      } else {
        this.dialogCarrierVisible = true
        this.$nextTick(() => {
          this.$refs.carrierDistribute.init(row.id)
        })
      }

      // planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      //   // this.treeData = res.body
      //   this.treeData = res
      //   this.$refs.pickup.queryLoading = false
      // }).catch(err => {
      //   console.log(err)
      //   this.$refs.pickup.queryLoading = false
      // })
    },
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      // if (parseInt(row.status) === 1) {
      //   return 'green'
      // } else if (parseInt(row.status) === 0) {
      //   return 'red'
      // } else if (parseInt(row.status) === 2) {
      //   return 'blue'
      // } else {
      //   return 'yellow'
      // }
    },
    parentCancelHandel() {
      this.dialogVisible = false
      this.dialogCarrierVisible = false
    },
    deleteSelect() {
      let hasIssue = false // 是否已发布
      let hasIssueList = [] // 存放已发布配送单号
      hasIssueList = this.multiSelection.map(item => {
        if (parseInt(item.status) === 2) {
          hasIssue = true // 如果已发布就true
          return item.dispatchBillNo
        }
      })
      if (hasIssue) {
        this.$message.warning(`配送单号为${hasIssueList.join(',')}的计划已发布，无法删除`)
        return
      }
      const deleteDTO = this.multiSelection.map(item => {
        return { id: item.id, version: item.version }
      })
      planAndExecuteApi.deleteList(deleteDTO).then(res => {
        if (res) {
          this.$message.success('运单删除成功')
          this.getTableData(this.searchForm)
        } else {
          this.$message.success('运单删除失败')
        }
      })
    },
    // 监听查询时间变化
    changeTime() {
      if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
        this.searchForm.startTime = this.timeList[0]
        this.searchForm.endTime = this.timeList[1]
      } else {
        this.searchForm.startTime = null
        this.searchForm.endTime = null
      }
    },
    getTableData(param, isClear = true) {
      if (isClear) {
        this.$refs['table'].clearSelection()
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

      if (query.startTime && query.endTime) {
        query.startTime = this.dayTime(query.startTime, 'start')
        query.endTime = this.dayTime(query.endTime, 'end')
      } else {
        query.startTime = ''
        query.endTime = ''
      }

      planAndExecuteApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        res.data.map(item => {
          if (!item.preSendTime) {
            return
          }
          item.preSendTime = this.formatTime(item.preSendTime)
        })
        this.tableData = res.data
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
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
    search() {
      this.page.current = 1
      this.getTableData(this.searchForm)
    },
    add() {
      this.$confirm('', '请选择增加计划的类型', {
        confirmButtonText: '委托配送计划',
        cancelButtonText: '自配送计划',
        type: 'primary',
        center: true,
        distinguishCancelAndClose: true
      }).then(() => {
        // 委托配送计划
        this.pickupType = 'add'
        planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
          // this.treeData = res.body
          this.treeData = res
        })
        this.dialogCarrierVisible = true
      }).catch((err) => {
        // 自配送计划
        console.log(err)
        if (err === 'cancel') {
          this.pickupType = 'add'
          planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
            // this.treeData = res.body
            this.treeData = res
          })
          this.dialogVisible = true
        }
      })
    },
    edit() {
      if (this.multiSelection.length !== 1) {
        this.$message.error('至少且只能选择一条数据')
        return
      }
      let hasIssue = false // 是否已被司机接收
      this.multiSelection.map(item => {
        if (parseInt(item.billStatus) === 2) {
          hasIssue = true // 如果已接收就true
        }
      })
      if (hasIssue) {
        this.$message.warning(`司机已接收任务，无法编辑`)
        return
      }
      // 判断承运商字段是否为空,为空则为非承运商计划
      console.log('this.multiSelection[0]: ', this.multiSelection[0])
      this.pickupType = (!this.multiSelection[0].allactionCentreId && this.multiSelection[0].dispadtchType === '2')
        ? 'carrierEdit' : 'edit'
      if (this.pickupType === 'edit') {
        this.dialogVisible = true
        this.$refs.pickup.queryLoading = true
        this.$nextTick(function() {
          console.log(this.multiSelection[0].id)
          this.$refs.pickup.init(this.multiSelection[0].id)
        })
        planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
        // this.treeData = res.body
          this.treeData = res
        })
      } else {
        // 委托配送计划编辑
        this.$nextTick(() => {
          console.log(this.multiSelection[0].id)
          this.$refs.carrierDistribute.init(this.multiSelection[0].id)
        })
        planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
          // this.treeData = res.body
          this.treeData = res
        })
        this.dialogCarrierVisible = true
      }
    },
    copy() {
      if (this.multiSelection.length !== 1) {
        this.$message.error('至少且只能选择一条数据')
        return
      }
      this.pickupType = 'add'
      planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
        // this.treeData = res.body
        this.treeData = res
      })
      this.dialogVisible = true
      // this.multiSelection[0].preSendTime = new Date(this.multiSelection[0].preSendTime.preSendTime)
      this.$nextTick(() => {
        this.$refs.pickup.plan = this.multiSelection[0]
      })
      // planAndExecuteApi.copyPlan(this.multiSelection[0]).then(res => {
      //   if (res) {
      //     this.$message.success('运单复制成功')
      //     this.getTableData(this.searchForm)
      //   } else {
      //     this.$message.error('运单复制失败')
      //   }
      // })
    },
    publishPlan() {
      if (this.multiSelection.length < 1) {
        this.$message.error('至少选择一条数据')
        return
      }
      let hasIssue = false // 是否已发布
      this.multiSelection.map(item => {
        if (parseInt(item.status) === 2) {
          hasIssue = true // 如果已发布就true
        }
      })
      if (hasIssue) {
        this.$message.warning(`该计划已发布`)
        return
      }
      this.$confirm('确定发布此运单吗, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const publishPlan = []
        this.multiSelection.map(item => {
          publishPlan.push({
            id: item.id,
            version: item.version
          })
        })
        planAndExecuteApi.publishPlan(publishPlan).then(res => {
          if (res) {
            this.$message.success('运单发布成功')
            this.getTableData(this.searchForm)
          } else {
            this.$message.success('运单发布失败')
          }
        })
      })
    },
    undoPlan() {
      if (this.multiSelection.length < 1) {
        this.$message.error('至少选择一条数据')
        return
      }
      let hasIssue = false // 是否已完成
      const hasIssueList = [] // 存放已完成配送单号
      let hasUndoPlan = false // 判断计划是否已作废
      const hasUndoPlanList = [] // 存放已作废提货单号

      this.multiSelection.map(item => {
        if (parseInt(item.billStatus) === 3) {
          hasIssue = true // 如果已完成就true
          hasIssueList.push(item.dispatchBillNo)
        }
        if (parseInt(item.status) === 0) {
          hasUndoPlan = true // 如果已作废就true
          hasUndoPlanList.push(item.dispatchBillNo)
        }
      })
      if (hasUndoPlan) {
        this.$message.warning(`配送单号为${hasUndoPlanList.join(',')}的计划已经作废，无法再次作废`)
        return
      }
      if (hasIssue) {
        this.$message.warning(`配送单号为${hasIssueList.join(',')}的计划已完成，无法作废`)
        return
      }
      this.$confirm('确定作废此运单吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const publishPlan = []
        this.multiSelection.map(item => {
          publishPlan.push({
            id: item.id,
            version: item.version,
            billStatus: item.billStatus,
            status: 0
          })
        })
        this.queryLoading = true
        planAndExecuteApi.undoPlan(publishPlan).then(res => {
          if (res) {
            this.$message.success('运单作废成功')
            this.getTableData(this.searchForm)
            this.queryLoading = false
          } else {
            this.$message.success('运单作废失败')
            this.queryLoading = false
          }
        }).catch(err => {
          this.$message.error(err)
          this.queryLoading = false
        })
      })
    },
    // 重新发布
    rePublishPlan() {
      if (this.multiSelection.length < 1) {
        this.$message.error('至少选择一条数据')
        return
      }
      let hasIssue = false // 是否已发布
      let hasIssueList = [] // 存放已发布配送单号
      hasIssueList = this.multiSelection.map(item => {
        if (parseInt(item.status) === 2 || parseInt(item.status) === 3) {
          hasIssue = true // 如果已发布就true
          return item.dispatchBillNo
        }
      })
      if (hasIssue) {
        this.$message.warning(`配送单号为${hasIssueList.join(',')}的计划已发布，无法重新发布`)
        return
      }
      this.$confirm('确定重新发布此运单吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const publishPlan = []
        this.multiSelection.map(item => {
          publishPlan.push({
            id: item.id,
            version: item.version
          })
        })
        planAndExecuteApi.rePublishPlan(publishPlan).then(res => {
          if (res) {
            this.$message.success('运单重新发布成功')
            this.getTableData(this.searchForm)
          } else {
            this.$message.success('运单重新发布失败')
          }
        })
      })
    },
    /**
     * 关闭弹窗
     */
    closePickup() {
      this.dialogCarrierVisible = false
      this.dialogVisible = false
      this.getTableData(this.searchForm)
      this.$refs.pickUp.isShowAllactionAndCompany = false
      this.$refs.pickup.tableData = []
      this.$refs.pickup.plan = { // 初始化回去
        id: '', dispatchBillNo: '', dispatchBatchNo: '',
        startStation: '', goalStation: '', urgentDegree: '',
        preSendTime: '', car: '', driverId: '',
        driver: '', dispatcher: getName(), tel: getTel(), version: ''
      }
      this.$refs.carrierDistribute.allData = [
        { plan: { id: '', dispatchBillNo: '', dispatchBatchNo: '', dispatchType: '2',
          startStation: '', goalStation: '', urgentDegree: '2', preSendTime: '',
          transportWay: '陆运方式', car: '', isMainPlan: true, // 标记主从计划
          driverId: '', driver: '', dispatcher: getName(),
          tel: getTel()
        }, tableData: [] }
      ]
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    currentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm, false)
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style scoped>
body {
    overflow: visible !important;
}
.customstep {
  padding-right: 110px;
}
/* .el-table>>>td, .el-table>>>th {
    padding: 6px 0;
  } */
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 70px 0;
}
.el-table>>>.red{
    background: hsl(0, 83%, 93%);
  }
  .el-table>>>.green{
    background: hsl(138, 84%, 87%);
  }
  .el-table>>>.blue{
    background: hsl(184, 71%, 77%);
  }
  .el-table>>>.yellow{
    background: hsl(56, 100%, 84%);
  }
  .searchAndBatch{
    margin: 0;
    margin-left: 10px;
  }
  .tableC{
    /* display: flex; */
  }

  .el-table{
    width: 100%;
    margin: 0;
    font-size: 12px;
    margin-top: 10px;
    margin-left: 10px;
  }
</style>
<style>
/* .el-table__expanded-cell[class*=cell] {
    padding: 0px;
  } */
</style>
