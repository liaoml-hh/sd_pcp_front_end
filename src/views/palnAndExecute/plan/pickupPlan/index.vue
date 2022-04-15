<template>
  <div>
    <!--查询框 -->
    <div>
      <el-form
        style="margin-left:10px"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="提货单号">
              <el-input v-model="searchForm.deliveryBillNo" style="width:90%" clearable size="mini" />
            </el-form-item>
            <!-- 加 -->
            <el-form-item label="调度员">
              <el-input v-model="searchForm.dispatcher" style="width:98%" size="mini" />
            </el-form-item>

            <el-form-item label="司机" style="margin-left:1.6%">
              <el-select v-model="searchForm.driverId" filterable clearable placeholder="请选择" style="width:90%" size="mini">
                <el-option
                  v-for="item in driverList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="车辆:">
              <el-input v-model="searchForm.car" style="width:90%" clearable size="mini" />
            </el-form-item> -->
            <el-form-item label="车辆" style="margin-left:1.6%">
              <el-select
                v-model="searchForm.car"
                filterable
                clearable
                style="width:140%"
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
            <br>
            <el-form-item label="状态" style="margin-left:1.6%">
              <el-select v-model="searchForm.status" style="width:90%" clearable size="mini">
                <el-option
                  v-for="item in statusList"
                  :key="item.status"
                  size="mini"
                  :label="item.name"
                  :value="item.status"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="始发地">
              <el-input v-model="searchForm.startStation" style="width:90%" clearable size="mini" />
            </el-form-item>
            <el-form-item label="目的地">
              <el-input v-model="searchForm.goalStation" style="width:90%" clearable size="mini" />
            </el-form-item>
            <el-form-item label="业务时间">
              <el-date-picker
                v-model="timeList"
                style="width:70%"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeTime"
              />
            </el-form-item>
            <el-button type="primary" size="mini" @click="search()">查询</el-button>
          </el-col>
        </el-row>

      </el-form>
      <div style="margin-left:10px;margin-bottom:10px">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add()">增加</el-button>
        <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteSelect()">删除</el-button> -->
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit()">修改</el-button>
        <el-button type="primary" size="mini" icon="el-icon-document" @click="copy()">复制</el-button>
        <el-button type="primary" size="mini" icon="el-icon-warning" @click="publishPlan()">发布</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="undoPlan()">作废</el-button>
        <el-button type="primary" size="mini" icon="el-icon-warning" @click="rePublishPlan()">重新发布</el-button>
        <el-button type="primary" size="mini" icon="el-icon-printer" @click="showPrintInfo()">条码打印</el-button>
      </div>

    </div>
    <!-- @row-dblclick="handleRowDoubleClick" -->
    <el-table
      ref="table"
      v-loading="queryLoading"
      :data="tableData"
      element-loading-text="Loading"
      tooltip-effect="dark"
      fit
      highlight-current-row
      border
      height="600"
      :row-class-name="tableRowClassName"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
      @sort-change="changeTableSort"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" reserve-selection width="45" align="center" />
      <el-table-column label="序号" width="50" type="index" align="center" />
      <el-table-column class="orderTableDetail" align="center" prop="orderTableDetail" label="明细" type="expand" width="50">
        <template slot-scope>
          <detail ref="detail" />
        </template>
      </el-table-column>
      <el-table-column prop="deliveryBillNo" sortable label="提货单号" width="110" show-overflow-tooltip align="center" />
      <el-table-column prop="dispatcher" sortable label="调度员" width="110" show-overflow-tooltip align="center" />
      <el-table-column prop="dispatcherTel" label="调度员电话" show-overflow-tooltip align="center" />
      <el-table-column prop="deliveryBatchNo" sortable label="提货批次" show-overflow-tooltip align="center" />
      <el-table-column prop="preDeliveryTime" width="164" sortable label="预约提货时间" align="center" />
      <el-table-column prop="createdTime" sortable label="业务时间" width="140" align="center" />
      <el-table-column prop="driver" label="司机" sortable show-overflow-tooltip align="center" />
      <el-table-column prop="car" label="车辆" show-overflow-tooltip align="center" />
      <el-table-column prop="startStation" sortable label="始发地" show-overflow-tooltip align="center" />
      <el-table-column prop="goalStation" sortable label="目的地" show-overflow-tooltip align="center" />
      <el-table-column prop="urgencyDegree" label="紧急程度" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <span>
            {{
              row.urgencyDegree == "1"
                ?'加急'
                :row.urgencyDegree == "2"
                  ?'正常'
                  :row.urgencyDegree
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" sortable label="运单状态" width="130" align="center">
        <template slot-scope="{ row }">
          <img v-show="parseInt(row.billStatus) === 3" :src="statusFinishImgSrc" width="40%" style="position:absolute;top:32%;right:70%;width:20px;height:20px;">
          <img v-show="parseInt(row.billStatus) === 0" :src="statusRejeckImgSrc" width="40%" style="position:absolute;top:32%;right:70%;width:20px;height:20px;">
          <img v-show="parseInt(row.billStatus) === 1" :src="statusDealAcceptImgSrc" width="40%" style="position:absolute;top:37%;right:72%;width:15px;height:15px;">
          <img v-show="parseInt(row.billStatus) === 2" :src="statusAcceptImgSrc" width="40%" style="position:absolute;top:35%;right:72%;width:16px;height:16px;">
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
                      : row.billStatus
            }}</span>

        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" sortable show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          <span>
            {{
              parseInt(row.status) === 1
                ? '未发布'
                : parseInt(row.status) === 0
                  ? '已作废'
                  : parseInt(row.status) === 2
                    ? '已发布'
                    : parseInt(row.status) === 3
                      ? '重新发布'
                      : row.status
            }}</span>

        </template>
      </el-table-column>
    </el-table>
    <div style="margin-left:10px">
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
    <!-- <el-divider content-position="left">提货细节展示区域(单击上表展示)</el-divider> -->
    <!-- <detail ref="detail" style="margin-top:-40px;margin-bottom:100px" /> -->
    <el-dialog v-dialogDrag :before-close="closePickupDialog" :close-on-click-modal="false" style="height:100%;width:110%" top="2vh" :visible.sync="dialogVisible" width="73%" append-to-body title="提货计划">
      <pickUp ref="pickup" :data="treeData" :type="pickupType" @parentCancelHandel="parentCancelHandel" @close="closePickup" />
    </el-dialog>
    <el-dialog
      v-dialogDrag
      title="打印条码"
      :visible.sync="dialogPrintVisible"
      width="60%"
      style="margin-top:-5%"
      :close-on-click-modal="false"
      :before-close="cancelPrint"
    >
      <!-- <CNPrint /> -->
      <!-- <NBPrint /> -->
      <div style="height:600px;margin:auto;overflow:auto"><Print ref="print" /></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPrint">取 消</el-button>
        <el-button type="primary" @click="confirmPrinting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pickUp from './pickUp.vue'
import waybill from './waybill/index.vue'
import detail from './waybill/detail.vue'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import { getName, getTel } from '@/utils/auth'
import axios from 'axios'
export default {
  components: {
    Print: () => import('@/components/Print/Print'),
    pickUp, detail },
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
      tatusRejectImgSrc: require('../../../../assets/404_images/reject.png'),
      driverList: [],
      statusList: [
        { status: 0, name: '已作废' },
        { status: 1, name: '未发布' },
        { status: 2, name: '已发布' },
        { status: 3, name: '重新发布' }
      ],
      startStationList: [],
      goalStationList: [],
      vehicleList: [], // 车辆下拉列表
      tableData: [],
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      searchForm: {
        deliveryBillNo: '',
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        dispatcher: '',
        car: '',
        driverId: '',
        status: ''
      },
      treeData: [],
      multiSelection: [],
      waybillTableVisible: false,
      expands: [], // 展开行
      getRowKeys(row) { // 行id
        return row.id
      },
      dialogPrintVisible: false
    }
  },

  created() {
    planAndExecuteApi.queryDriver().then(res => {
      // this.driverList = res.body
      this.driverList = res
    })
    planAndExecuteApi.getVehicle().then(res => {
      console.log(res)
      this.vehicleList = res.data
    })
  },
  mounted() {
    this.getTableData(this.searchForm)
  },
  methods: {
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
    // 展示打印条码
    showPrintInfo() {
      if (!this.multiSelection.length) {
        this.$message.warning('请勾选数据')
      }
      this.queryLoading = true
      const ids = this.multiSelection.map(item => {
        return item.id
      })
      planAndExecuteApi.getPrintData({ ids }).then(res => {
        this.print(res.data)
      })
    },
    /**
     * 打印初始化
     * @param printData 所需打印的数据
     */
    async print(printData) {
      const tableData = []
      const allPromise = printData.map((item, index) => {
        return this.getArea(item.goalProvince + item.goalCity + item.goalCounty + item.goalAddress).then(res => {
          item.goalProvince = res.province
          item.goalCity = res.city
          item.goalCounty = res.district
          var regP = new RegExp(res.province, 'g')
          item.goalAddress = item.goalAddress.replace(regP, '')
          var regC = new RegExp(res.city, 'g')
          item.goalAddress = item.goalAddress.replace(regC, '')
          var regD = new RegExp(res.district, 'g')
          item.goalAddress = item.goalAddress.replace(regD, '')
          var regE = new RegExp('[()]', 'g')
          item.goalAddress = item.goalAddress.replace(regE, '')
          var regN = new RegExp('null', 'g')
          item.goalAddress = item.goalAddress.replace(regN, '')
        }).catch(err => {
          this.queryLoading = false
          console.log(err)
        })
      })
      await Promise.all(allPromise)
      printData.map(item => {
        if (item.quantity) {
          for (let i = 1; i <= item.quantity; i++) {
            item.indexQ = i
            tableData.push(Object.assign({}, item))
          }
        } else {
          item.indexQ = 0
          item.quantity = 0
          tableData.push(item)
        }
      })
      this.queryLoading = false
      this.dialogPrintVisible = true
      this.$nextTick(() => {
        new Promise((resolve, reject) => {
          this.$refs.print.tableData = tableData
          resolve()
        }).then(() => {
          this.$refs.print.init()
        })
      })
    },
    // 解析地址
    getArea(address) {
      return new Promise((resolve, reject) => {
        axios.get('https://restapi.amap.com/v3/geocode/geo', {
          params: {
            key: '7379f3ce41be5f56ea05b43b504df9a5',
            address
          }
        }).then(function(response) {
          resolve(response.data.geocodes[0])
        }).catch(function(error) {
          reject(error)
        })
      })
    },
    // 取消打印
    cancelPrint() {
      this.dialogPrintVisible = false
      this.getTableData(this.searchForm)
    },
    // 确认打印
    confirmPrinting() {
      this.$refs.print.Printing()
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
      this.$refs.pickup.plan = { // 初始化回去
        id: '',
        deliveryBillNo: '',
        deliveryBatchNo: '',
        startStation: '',
        goalStation: '',
        urgentDegree: '2',
        preSendTime: '',
        car: '',
        driverId: '',
        driver: '',
        dispatcher: getName(),
        dispatcherTel: getTel(),
        version: ''
      }
      this.$set(this.$refs.pickup.plan, 'urgencyDegree', '2')
      this.$refs.pickup.tableData = []
    },
    // 表格单击事件
    handleRowClick(row, column, event) {
      setTimeout(() => {
        this.$refs.detail.queryLoading = true
      })
      setTimeout(() => {
        this.$refs.detail.queryLoading = false
      }, 1000)
      planAndExecuteApi.showPlan(row.id).then(res => {
        res.waybillDTOList.map(item => {
          if (item.placeBillwayTime) {
            item.placeBillwayTime = this.formatTime(item.placeBillwayTime)
          }
          if (item.updatedTime) {
            item.updatedTime = this.formatTime(item.updatedTime)
          }
        })
        // document.documentElement.scrollTop = 1300
        // this.queryLoading = true
        this.$set(this.$refs.detail, 'tableData', res.waybillDTOList)
        this.$refs.detail.queryLoading = false
        this.queryLoading = false
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
      this.pickupType = 'edit'
      this.dialogVisible = true
      this.$nextTick(function() {
        console.log(row.id)
        this.$refs.pickup.queryLoading = true
        this.$refs.pickup.init(row.id)
      })
      // planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      //   // this.treeData = res.body
      //   this.treeData = res
      //   this.$refs.pickup.queryLoading = false
      // }).catch(err => {
      //   this.$message.error(err)
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
    },
    deleteSelect() {
      let hasIssue = false // 是否已发布
      let hasIssueList = [] // 存放已发布配送单号
      hasIssueList = this.multiSelection.map(item => {
        if (parseInt(item.status) === 2) {
          hasIssue = true // 如果已发布就true
          return item.deliveryBillNo
        }
      })
      if (hasIssue) {
        this.$message.warning(`提货单号为${hasIssueList.join(',')}的计划已发布，无法删除`)
        return
      }
      const deleteDTO = this.multiSelection.map(item => {
        return { id: item.id, version: item.version }
      })
      this.queryLoading = true
      planAndExecuteApi.deleteList(deleteDTO).then(res => {
        if (res) {
          this.$message.success(`删除成功`)
        }

        this.getTableData(this.searchForm)
      }).catch(err => {
        this.$message.success(err)
        this.queryLoading = true
      })
    },
    /**
     * 监听查询时间的变化
     */
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
          if (!item.preDeliveryTime) {
            return
          }
          item.preDeliveryTime = this.formatTime(item.preDeliveryTime)
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
      this.pickupType = 'add'
      // planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      //   this.treeData = res
      // })
      this.dialogVisible = true
    },
    edit() {
      if (this.multiSelection.length !== 1) {
        this.$message.error('至少且只能选择一条数据')
        return
      }
      if (!this.multiSelection[0].id) {
        this.$message.error('数据错误，请重试！')
        return
      }
      let hasIssue = false // 是否已发布
      this.multiSelection.map(item => {
        if (parseInt(item.billStatus) === 2) {
          hasIssue = true // 如果已发布就true
        }
      })
      if (hasIssue) {
        this.$message.warning(`司机已接受任务，无法编辑`)
        return
      }
      this.pickupType = 'edit'
      this.dialogVisible = true
      this.$nextTick(function() {
        this.$refs.pickup.queryLoading = true
        this.$refs.pickup.init(this.multiSelection[0].id)
      })
      // planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      //   // this.treeData = res.body
      //   this.treeData = res
      // })
    },

    copy() {
      if (this.multiSelection.length !== 1) {
        this.$message.error('至少且只能选择一条数据')
        return
      }
      this.pickupType = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.pickup.plan = this.multiSelection[0]
      })

      // planAndExecuteApi.copyPlan(this.multiSelection[0]).then(res => {
      //   this.getTableData(this.searchForm)
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
        planAndExecuteApi.publishPlan(publishPlan).then(res => {
          if (res) {
            this.getTableData(this.searchForm)

            this.$message.success('发布成功')
          } else {
            this.$message.error('发布失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    undoPlan() {
      if (this.multiSelection.length < 1) {
        this.$message.error('至少选择一条数据')
        return
      }
      let hasIssue = false // 判断计划是否已完成
      const hasIssueList = [] // 存放已作废提货单号
      let hasUndoPlan = false // 判断计划是否已完成
      const hasUndoPlanList = [] // 存放已作废提货单号
      this.multiSelection.map(item => {
        if (parseInt(item.billStatus) === 3) {
          hasIssue = true // 如果已完成就true
          hasIssueList.push(item.deliveryBillNo)
        }
        if (parseInt(item.status) === 0) {
          hasUndoPlan = true // 如果已作废就true
          hasUndoPlanList.push(item.deliveryBillNo)
        }
      })
      if (hasUndoPlan) {
        this.$message.warning(`提货单号为${hasUndoPlanList.join(',')}的计划已经作废，无法再次作废`)
        return
      }
      if (hasIssue) {
        this.$message.warning(`提货单号为${hasIssueList.join(',')}的计划司机已完成，无法作废`)
        return
      }
      this.$confirm('确定作废该订单吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const publishPlan = []
        this.multiSelection.map(item => {
          publishPlan.push({
            id: item.id,
            version: item.version,
            status: 0,
            billStatus: item.billStatus
          })
        })
        this.queryLoading = true
        planAndExecuteApi.undoPlan(publishPlan).then(res => {
          if (res) {
            this.$message.success('订单作废成功')
            this.getTableData(this.searchForm)
          } else {
            this.$message.success('订单作废失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消作废'
        })
      })
    },
    rePublishPlan() {
      if (this.multiSelection.length < 1) {
        this.$message.error('至少选择一条数据')
        return
      }
      let hasIssue = false // 是否已发布
      // let hasPublic = false // 是否已发布
      const hasIssueList = [] // 存放已接收配送单号
      // const hasPublicList = [] // 存放已发布配送单号
      this.multiSelection.map(item => {
        if (parseInt(item.status) === 2 || parseInt(item.status) === 3) {
          hasIssue = true // 如果已发布就true
          hasIssueList.push(item.deliveryBillNo)
        }
      })
      if (hasIssue) {
        this.$message.warning(`提货单号为${hasIssueList.join(',')}的计划已发布，无法重新发布`)
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
            this.$message.success('订单重新发布成功')
            this.getTableData(this.searchForm)
          } else {
            this.$message.success('订单重新发布失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重新发布'
        })
      })
    },
    closePickup() {
      this.$refs.pickup.plan = { // 初始化回去
        id: '',
        deliveryBillNo: '',
        deliveryBatchNo: '',
        startStation: '',
        goalStation: '',
        urgentDegree: '',
        preSendTime: '',
        car: '',
        driverId: '',
        driver: '',
        dispatcher: getName(),
        dispatcherTel: getTel(),
        version: ''
      }
      this.$refs.pickup.tableData = []
      this.getTableData(this.searchForm)
      this.dialogVisible = false
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

<style>
.customstep {
  padding-right: 110px;
}
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 70px 0;
}
.el-table .red{
    background: hsl(0, 83%, 93%);
  }
  .el-table .green{
    background: hsl(138, 84%, 87%);
  }
  .el-table .blue{
    background: hsl(184, 71%, 77%);
  }
  .el-table .yellow{
    background: hsl(56, 100%, 84%);
  }
</style>
