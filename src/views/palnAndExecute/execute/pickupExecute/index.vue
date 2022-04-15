<template>
  <div>
    <!--查询框 -->
    <div style="margin-left:10px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <!-- <el-form-item label="运单号:">
          <el-input v-model="searchForm.waybillNo" clearable size="mini" />
        </el-form-item> -->
        <!-- <el-form-item label="接收时间:">
          <el-date-picker
            v-model="timeList"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
          />
        </el-form-item> -->
        <!--<el-form-item label="车辆:">-->
        <!--<el-input v-model="searchForm.car" clearable size="mini" />-->
        <!--</el-form-item>-->
        <!-- <el-form-item label="司机:">
          <el-select v-model="searchForm.driver" placeholder="请选择" size="mini">
            <el-option
              v-for="item in driverList"
              :key="item.id"
              size="mini"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item> -->
        <!--<el-form-item label="状态:">-->
        <!--<el-input v-model="searchForm.billStatus" clearable size="mini" />-->
        <!--</el-form-item>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="提货单号">
              <el-input v-model="searchForm.deliveryBillNo" style="width:90%" clearable size="mini" />
            </el-form-item>
            <!-- 加 -->
            <el-form-item label="调度员">
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
            <el-form-item label="车辆" style="margin-left:1.7%">
              <el-select
                v-model="searchForm.car"
                filterable
                style="width:138%"
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
            <el-form-item label="状态" style="margin-left:1.7%">
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
              <el-input v-model="searchForm.goalStation" clearable size="mini" />
            </el-form-item>
            <!-- <el-form-item label="提货时间">
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
            </el-form-item> -->
            <el-form-item label="业务时间">
              <el-date-picker
                v-model="dateList"
                style="width:70%"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDate"
              />
            </el-form-item>
            <el-button type="primary" @click="search()">查询</el-button>
          </el-col>
        </el-row>
        <!-- <el-button type="primary" @click="search()">查询</el-button> -->
      </el-form>
    </div>
    <!-- <div style="padding-right: 20px;width: 200px;overflow: scroll;height: 500px">
        <el-tree
          :data="data"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
        />
      </div> -->
    <el-table
      ref="table"
      v-loading="queryLoading"
      :data="tableData"
      element-loading-text="Loading"
      fit
      border
      height="600"
      style="margin-left:10px"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :row-class-name="tableRowClassName"
      @expand-change="expandChange"
      @selection-change="handleSelectionChange"
      @row-click="showStatusDialog"
    >
      <el-table-column type="selection" reserve-selection width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column class="orderTableDetail" align="center" prop="orderTableDetail" label="明细" type="expand" width="50">
        <template slot-scope>
          <detail ref="detail" :query-loading="queryDetailLoading" />
        </template>
      </el-table-column>
      <!-- TODO新增 -->
      <el-table-column label="提货单号" prop="deliveryBillNo" width="90" show-overflow-tooltip align="center" />
      <el-table-column label="提货批次" prop="deliveryBatchNo" width="110" show-overflow-tooltip align="center" />
      <!-- <el-table-column label="运单号" prop="waybillNo" width="100" show-overflow-tooltip align="center" /> -->
      <el-table-column label="调度员" prop="dispatcher" width="90" show-overflow-tooltip align="center" />
      <el-table-column label="调度员电话" prop="dispatcherTel" width="110" show-overflow-tooltip align="center" />
      <el-table-column label="司机" prop="driver" width="80" show-overflow-tooltip align="center" />
      <el-table-column label="车辆" prop="car" width="100" show-overflow-tooltip align="center" />
      <el-table-column prop="billStatus" sortable label="运单状态" width="130" align="center">
        <template slot-scope="{ row }">
          <img v-show="parseInt(row.billStatus) === 3" :src="statusFinishImgSrc" width="40%" style="position:absolute;top:32%;right:70%;width:20px;height:20px;">
          <img v-show="parseInt(row.billStatus) === 0" :src="statusRejeckImgSrc" width="40%" style="position:absolute;top:32%;right:70%;width:20px;height:20px;">
          <img v-show="parseInt(row.billStatus) === 1" :src="statusDealAcceptImgSrc" width="40%" style="position:absolute;top:37%;right:72%;width:15px;height:15px;">
          <img v-show="parseInt(row.billStatus) === 2" :src="statusAcceptImgSrc" width="40%" style="position:absolute;top:37%;right:72%;width:16px;height:16px;">
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
      <el-table-column prop="preDeliveryTime" width="160" label="预约提货时间" align="center" />
      <el-table-column prop="createdTime" sortable label="业务时间" width="140" align="center" />
      <el-table-column label="目的地" prop="goalStation" width="120" show-overflow-tooltip align="center" />
      <el-table-column label="始发地" prop="startStation" width="120" show-overflow-tooltip align="center" />

      <!-- <el-table-column label="接收时间" prop="taskAcceptTime" width="150" show-overflow-tooltip align="center" />
          <el-table-column label="接收备注" prop="acceptRemark" width="100" show-overflow-tooltip align="center" />
          <el-table-column label="完成时间" prop="finishTime" width="180" show-overflow-tooltip align="center" />
          <el-table-column label="完成备注" prop="finishRemark" width="100" align="center" /> -->
      <!-- <el-table-column label="货品" prop="goods" width="100" align="center" />
          <el-table-column label="箱数" prop="quantity" show-overflow-tooltip align="center" />
          <el-table-column label="重量" prop="weight" show-overflow-tooltip align="center" />
          <el-table-column label="体积" prop="cubage" show-overflow-tooltip align="center" /> -->
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
      <el-table-column label="已完成明细" prop="pickupFinishCount" width="120" show-overflow-tooltip align="center" />
      <!--  billStatus：1未接收，2处理中，3已完成，0拒绝 -->

      <el-table-column label="操作时间" prop="operateTime" show-overflow-tooltip align="center" />
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
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="handleClose"
    >
      <el-card class="box-card-router">
        <el-steps :active="routeActiveCount" finish-status="success">
          <!-- v-for="(routeInfo, index) in routeInfos" -->
          <el-step
            v-for="(routeInfo, index) in routeInfos"
            :key="index"
            :title="parseInt(routeInfo.billStatus) === 1?
              '未接收':parseInt(routeInfo.billStatus) === 0?

                '已拒绝':parseInt(routeInfo.billStatus) === 2?
                  '已接收':parseInt(routeInfo.billStatus) === 3?
                    '已完成':routeInfo.billStatus"
          >
            <template slot="description">
              <div v-show="routeInfo.preDeliveryTime">预约提货时间：{{ routeInfo.preDeliveryTime }}</div>
              <el-collapse-transition>
                <div>
                  <div v-show="routeInfo.driver">司机：{{ routeInfo.driver }}</div>
                  <div v-show="routeInfo.dispatcher">调度员：{{ routeInfo.dispatcher }}</div>
                  <div v-show="routeInfo.startStation">始发地：{{ routeInfo.startStation }}</div>
                  <div v-show="routeInfo.goalStation">目的地：{{ routeInfo.goalStation }}</div>
                </div>
              </el-collapse-transition>
            </template>
          </el-step>
          <!-- <i :class="showRouteDetail?'el-icon-arrow-up':'el-icon-arrow-down'" style="float: right; padding: 3px 0" @click="showRouteDetailClick" /> -->
        </el-steps>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- <el-divider content-position="left">提货细节展示区域(双击上表展示)</el-divider>
    <detail ref="detail" style="margin-top:10px;margin-bottom:100px" /> -->
  </div>
</template>

<script>
import waybill from './waybill/index.vue'
import detail from './waybill/detail.vue'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import { parse } from 'path-to-regexp'
export default {
  components: { detail },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      routeInfos: [
        { billStatus: 1, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
        { billStatus: 0, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
        { billStatus: 2, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
        { billStatus: 3, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' }
      ],
      routeActiveCount: 0,
      statusFinishImgSrc: require('../../../../assets/404_images/finish.png'),
      statusDealAcceptImgSrc: require('../../../../assets/404_images/dealAccept.png'),
      statusAcceptImgSrc: require('../../../../assets/404_images/accept.png'),
      tatusRejectImgSrc: require('../../../../assets/404_images/reject.png'),
      dialogVisible: false,
      vehicleList: [], // 车辆下拉列表
      getRowKeys(row) { // 行id
        return row.id
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      statusList: [
        { status: 0, name: '已作废' },
        { status: 1, name: '未发布' },
        { status: 2, name: '已发布' },
        { status: 3, name: '重新发布' }
      ],

      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      dateList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      waybillTableVisible: false,
      queryLoading: false,
      queryDetailLoading: false,
      driverList: [],
      tableData: [],
      searchForm: {
        deliveryBillNo: '',
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        dispatcher: '',
        car: '',
        driverId: '',
        status: ''
      },
      expands: [] // 展开行
    }
  },

  created() {
    planAndExecuteApi.queryDriver().then(res => {
      this.driverList = res
    })
    // 车辆下拉
    planAndExecuteApi.getVehicle().then(res => {
      console.log(res)
      this.vehicleList = res.data
    })
    planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      // this.data = res.body
      this.data = res
    })
    this.getTableData(this.searchForm)
  },
  mounted() {
    this.search()
  },
  methods: {
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      // if (parseInt(row.billStatus) === 1) {
      //   return 'green'
      // } else if (parseInt(row.billStatus) === 0) {
      //   return 'red'
      // } else if (parseInt(row.billStatus) === 2) {
      //   return 'blue'
      // } else {
      //   return 'yellow'
      // }
    },
    showStatusDialog(row) {
      if (parseInt(row.billStatus) !== 0) {
        this.routeInfos = [
          { billStatus: 1, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 2, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 3, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' }
        ]
      } else {
        this.routeInfos = [
          { billStatus: 1, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 0, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 2, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 3, preDeliveryTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' }
        ]
      }
      
      this.routeInfos.map(item => {
        item.preDeliveryTime = row.preDeliveryTime
        item.driver = row.driver
        item.dispatcher = row.dispatcher
        item.goalStation = row.goalStation
        item.startStation = row.startStation
      })
      if (parseInt(row.billStatus) === 1) {
        this.routeActiveCount = 1
      } else if (parseInt(row.billStatus) === 2) {
        this.routeActiveCount = 3
      } else if (parseInt(row.billStatus) === 0) {
        this.routeActiveCount = 2
      } else if (parseInt(row.billStatus) === 3) {
        this.routeActiveCount = 4
      }
      row.billStatus
      this.dialogVisible = true
    },

    handleClose() {
      this.dialogVisible = false
    },
    expandChange(row, expandedRows) {
      // 全屏遮罩加载显示
      this.expand_change_arr = row
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
    /**
     * 单击展示细节事件
     */
    handleRowClick(row) {
      setTimeout(() => {
        this.$set(this, 'queryDetailLoading', true)
      })
      setTimeout(() => {
        this.$set(this, 'queryDetailLoading', false)
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
        this.$refs.detail.tableData = res.waybillDTOList
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
    handleNodeClick(data) {
      if (data.type === '2') {
        var parms = {
          warehouseCode: data.value
        }
        this.getTableData(parms)
      }
      console.log(data)
    },
    search() {
      this.page.current = 1
      this.getTableData(this.searchForm, true)
    },
    // changeTime() {
    //   if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
    //     this.searchForm.startTime = this.timeList[0]
    //     this.searchForm.endTime = this.timeList[1]
    //   } else {
    //     this.searchForm.startTime = ''
    //     this.searchForm.endTime = ''
    //   }
    // },
    changeDate() {
      if (this.dateList != null && this.dateList !== undefined && this.dateList.length === 2) {
        this.searchForm.startTime = this.dateList[0]
        this.searchForm.endTime = this.dateList[1]
      } else {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
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
      }
      this.queryLoading = true
      planAndExecuteApi.queryPlanDetail(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        res.data.map(item => {
          item.dispatchStatusCountDTOList.map(itemStatusCount => {
            itemStatusCount.status === 41
              ? item.pickupFinishCount = itemStatusCount.count : ''
          })
          // item.taskAcceptTime = this.FormatTime(item.taskAcceptTime)
          // item.finishTime = this.FormatTime(item.finishTime)
          item.operateTime = this.FormatTime(item.operateTime)
          item.preDeliveryTime = this.FormatTime(item.preDeliveryTime)
        })
        this.tableData = res.data
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
      })
    },
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
    FormatTime(time) {
      if (!time) {
        return
      }
      time = new Date(time)
      time = time.getFullYear() + '-' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
            time.getDate() + ' ' +
            (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
            (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
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
body .el-table th.gutter{
  display: table-cell!important;
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
  .el-table__expanded-cell[class*=cell] {
    padding: 0px;
  }
  .el-table{
    font-size: 13px!important;
  }
</style>
