<template>
  <div>

    <!--查询框 -->
    <div>
      <el-form
        :inline="true"
        size="mini"
        :label-position="'right'"
        label-width="90px"
        :model="searchForm"
      >
        <el-col :span="4">
          <el-form-item
            label="配送单号"
            label-position="right"
          >
            <el-input
              v-model="searchForm.dispatchBillNo"
              clearable
            />
          </el-form-item>
          <el-form-item label="调度员">
            <el-input
              v-model="searchForm.dispatcher"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="司机">
            <el-select
              v-model="searchForm.driverId"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in driverList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车辆">
            <el-select
              v-model="searchForm.car"
              filterable
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
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="配送类型"
            style="margin-left:1.8%"
          >
            <el-select
              v-model="searchForm.dispatchType"
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in dispatchTypeList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="分拨点"
            style="margin-left:0.8%"
          >
            <el-select
              v-model="searchForm.allactionCentreId"
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in allactionCentreList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="执行状态">
            <el-input
              v-model="searchForm.billStatus"
              clearable
            />
          </el-form-item>
          <el-form-item label="始发地">
            <el-select
              v-model="searchForm.startStation"
              clearable
            >
              <el-option
                v-for="item in startStationList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="目的地"
            label-width="110px"
          >
            <el-select
              v-model="searchForm.goalStation"
              style="width:230px"
              clearable
              size="mini"
            >
              <el-option
                v-for="item in goalStationList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="业务时间"
            label-width="110px"
          >
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
        </el-col>
        <el-col
          :span="2"
          style="margin-top:2.8%"
        >
          <el-form-item label="">
            <el-button
              type="primary"
              @click="search()"
            >查询</el-button>
          </el-form-item>
        </el-col>
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
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      :row-style="{height:1+'px'}"
      style="margin-left:10px"
      :cell-style="{padding:3+'px'}"
      :header-cell-style="{height:'2px',width:'20px', padding:'0px'}"
      :row-class-name="tableRowClassName"
      @expand-change="expandChange"
      @cell-dblclick="showStatusDialog"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        class="orderTableDetail"
        align="center"
        prop="orderTableDetail"
        label="明细"
        type="expand"
        width="50"
      >
        <template slot-scope>
          <detail
            ref="detail"
            @preupdatewaybilltransfer="preupdatewaybilltransfer"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="配送单号"
        prop="dispatchBillNo"
        width="110"
        show-overflow-tooltip
      />
      <!-- <el-table-column label="运单号" prop="waybillNo" width="100" show-overflow-tooltip /> -->
      <el-table-column
        label="配送批次"
        prop="dispatchBatchNo"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column
        label="调度员"
        prop="dispatcher"
        width="68"
        show-overflow-tooltip
      />
      <el-table-column
        label="调度员电话"
        prop="tel"
        width="108"
        show-overflow-tooltip
      />
      <el-table-column
        label="司机"
        prop="driver"
        width="68"
        show-overflow-tooltip
      />
      <el-table-column
        label="车辆"
        prop="car"
        width="86"
        show-overflow-tooltip
      />
      <el-table-column
        prop="billStatus"
        sortable
        label="运单状态"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <img
            v-show="parseInt(row.billStatus) === 3"
            :src="statusFinishImgSrc"
            width="40%"
            style="position:absolute;top:32%;right:70%;width:20px;height:20px;"
          >
          <img
            v-show="parseInt(row.billStatus) === 0"
            :src="statusRejeckImgSrc"
            width="40%"
            style="position:absolute;top:32%;right:70%;width:20px;height:20px;"
          >
          <img
            v-show="parseInt(row.billStatus) === 1"
            :src="statusDealAcceptImgSrc"
            width="40%"
            style="position:absolute;top:37%;right:72%;width:15px;height:15px;"
          >
          <img
            v-show="parseInt(row.billStatus) === 2"
            :src="statusAcceptImgSrc"
            width="40%"
            style="position:absolute;top:37%;right:72%;width:16px;height:16px;"
          >
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
        <template slot-scope="{ row }">
          <img
            v-show=" parseInt(row.billStatus) === 3"
            :src="statusFinishImgSrc"
            width="40%"
            style="position:absolute;top:32%;right:70%;width:20px;height:20px;"
          >
          <img
            v-show=" parseInt(row.billStatus) === 1"
            :src="statusDealAcceptImgSrc"
            width="40%"
            style="position:absolute;top:32%;right:70%;width:20px;height:20px;"
          >
          <img
            v-show=" parseInt(row.billStatus) === 2"
            :src="statusAcceptImgSrc"
            width="40%"
            style="position:absolute;top:37%;right:72%;width:15px;height:15px;"
          >
          <img
            v-show=" parseInt(row.billStatus) === 0"
            :src="statusRejectImgSrc"
            width="40%"
            style="position:absolute;top:37%;right:72%;width:16px;height:16px;"
          >
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
      <el-table-column
        label="目的地"
        prop="goalStation"
        width="60"
        show-overflow-tooltip
      />
      <el-table-column
        label="始发地"
        prop="startStation"
        width="60"
        show-overflow-tooltip
      />
      <el-table-column
        prop="allocationDTO.name"
        label="分拨点"
        width="90"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="dispatchType"
        label="配送类型"
        width="78"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="{row}">
          <span>
            {{
              parseInt(row.dispatchType) == 1
                ?'直达'
                :parseInt(row.dispatchType) == 2
                  ?'中转'
                  :parseInt(row.dispatchType) == 3
                    ?'调拨'
                    :row.dispatchType
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="分公司"
        prop="companyDTO.name"
        width="88"
        show-overflow-tooltip
      />
      <el-table-column
        label="预约配送时间"
        prop="preSendTime"
        width="100"
      />
      <el-table-column
        prop="createdTime"
        sortable
        label="业务时间"
        width="100"
        align="center"
      />
      <el-table-column
        prop="urgentDegree"
        label="紧急程度"
        width="76"
        show-overflow-tooltip
        align="center"
      >
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

      <!-- <el-table-column label="已到达明细" prop="dispatchArriveCount" width="70" show-overflow-tooltip align="center" /> -->
      <!-- <el-table-column label="已签收明细" prop="dispatchSignCount" width="60" show-overflow-tooltip align="center" /> -->
      <!-- <el-table-column label="签收异常明细" prop="dispatchExceptionCount" width="70" show-overflow-tooltip align="center" /> -->
      <!--  billStatus：1未接收，2处理中，3已完成，0拒绝 -->
      <el-table-column
        label="操作时间"
        prop="operateTime"
        width="100"
        align="center"
      />
      <el-table-column
        label="司机当前位置"
        width="100"
        prop="businessAddress"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
        width="100"
      >
        <template slot-scope="row">
          <el-button
            v-if="parseInt(row.row.billStatus)===3"
            size="mini"
            type="primary"
            @click="accecptPlan(row)"
          >确认接受</el-button>

          <el-button
            v-if="parseInt(row.row.billStatus)===2"
            size="mini"
            type="primary"
            @click="unaccecptPlan(row)"
          >撤销接受</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        :current-page="page.current"
        :page-sizes="page.sizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
      >
        <el-card class="box-card-router">
          <el-steps
            :active="routeActiveCount"
            finish-status="success"
          >
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
                <div v-show="routeInfo.preSendTime">预约配送时间：{{ routeInfo.preSendTime }}</div>
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
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <el-divider content-position="left" style="margin-top:-30px">配送细节展示区域(单击上表展示)</el-divider>
    <detail ref="detail" style="margin-top:0px;margin-bottom:100px" /> -->
  </div>
</template>

<script>
import detail from './waybill/detail.vue'
import { planAndExecuteApi } from '@/api/planAndExecute/dispatchPlan'
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
        { billStatus: 1, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
        { billStatus: 0, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
        { billStatus: 2, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
        { billStatus: 3, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' }
      ],
      routeActiveCount: 0,
      dialogVisible: false,
      statusFinishImgSrc: require('../../../../assets/404_images/finish.png'),
      statusDealAcceptImgSrc: require('../../../../assets/404_images/dealAccept.png'),
      statusAcceptImgSrc: require('../../../../assets/404_images/accept.png'),
      statusRejectImgSrc: require('../../../../assets/404_images/reject.png'),
      getRowKeys(row) { // 行id
        return row.id
      },
      vehicleList: [], // 车辆下拉列表
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
        status: 2,
        sizes: [10, 20, 50, 100]
      },
      waybillTableVisible: false,
      queryLoading: false,
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      driverList: [],
      tableData: [],
      searchForm: {
        dispatchBillNo: '',
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        car: '',
        driverId: '',
        billStatus: '',
        allactionCentreId: '',
        dispatchArriveCompanyId: ''
      },
      expands: [], // 展开行，
      dispatchTypeList: [{
        id: 1,
        name: '直达'
      }, { id: 2, name: '中转' }]
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
      this.data = res.body
    })
    this.getTableData(this.searchForm)
  },
  mounted() {
    this.search()
  },
  methods: {
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      // if (row.status === 1) {
      //   return 'green'
      // } else if (row.status === 0) {
      //   return 'red'
      // } else if (row.status === 2) {
      //   return 'blue'
      // } else {
      //   return 'yellow'
      // }
    },
    showStatusDialog(row) {
      if (parseInt(row.billStatus) !== 0) {
        this.routeInfos = [
          { billStatus: 1, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 2, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 3, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' }
        ]
      } else {
        this.routeInfos = [
          { billStatus: 1, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 0, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 2, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' },
          { billStatus: 3, preSendTime: '', driver: '', dispatcher: '', goalStation: '', startStation: '' }
        ]
      }

      this.routeInfos.map(item => {
        item.preSendTime = row.preSendTime
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
      this.handleRowClick(row)
    },
    /**
     * 单击表格事件
     */

    handleRowClick(row) {
      this.$refs.detail.queryLoading = true
      planAndExecuteApi.showPlan(row.id).then(res => {
        res.waybillDTOList.map(item => {
          if (item.placeBillwayTime) {
            item.placeBillwayTime = this.formatTime(item.placeBillwayTime)
          }
          if (item.updatedTime) {
            item.updatedTime = this.formatTime(item.updatedTime)
          }
        })
        document.documentElement.scrollTop = 1300
        this.$refs.detail.tableData = res.waybillDTOList
        this.$refs.detail.queryLoading = false
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
      // this.searchForm.dispatchType = 2
      // this.searchForm.allactionCentreId = this.$store.getters.companyId
      this.getTableData(this.searchForm)
      // this.searchForm.dispatchType = ''
      // this.searchForm.allactionCentreId = ''
    },
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
      this.queryLoading = true
      if (query.startTime && query.endTime) {
        query.startTime = this.dayTime(query.startTime, 'start')
        query.endTime = this.dayTime(query.endTime, 'end')
      }
      planAndExecuteApi.queryPlanDetail(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        // 自行增加字段以分类到达以及签收还有签收异常数

        res.data.map(item => {
          item.dispatchStatusCountDTOList.map(itemStatusCount => {
            itemStatusCount.status === 71
              ? item.dispatchArriveCount = itemStatusCount.count
              : itemStatusCount.status === 81
                ? item.dispatchSignCount = itemStatusCount.count
                : itemStatusCount.status === 91
                  ? item.dispatchExceptionCount = itemStatusCount.count : ''
          })
          // item.taskAcceptTime = this.FormatTime(item.taskAcceptTime)
          // item.finishTime = this.FormatTime(item.finishTime)
          item.operateTime = this.formatTime(item.operateTime)
          item.preSendTime = this.formatTime(item.preSendTime)
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
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm, false)
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    },

    // 仓管接收这个计划
    accecptPlan(info) {
      this.$confirm('您是否已确认该计划并且接受它?').then(result => {
        if (result === 'confirm') {
          
          planAndExecuteApi.updatePlanByTransfer(info.row).then(res => {
            console.log(res)
            
          }).catch(error => {
            console.log(error)
            
          })
        } else if (result === 'cancel' || result === 'close') {
          this.$message.info('取消操作')
        }
      }).catch(erroer => {
        this.$message.error(`${erroer}`)
        console.log(erroer)
      })
    },

    // 撤销计划
    unaccecptPlan(info) {
      
      this.$confirm('是否撤销计划?').then(result => {
        
        if (result === 'confirm') {
          planAndExecuteApi.updatePlanByTransfer(info.row).then(res => {
            console.log(res)
            
          }).catch(error => {
            console.log(error)
            
          })
        } else if (result === 'cancel' || result === 'close') {
          this.$message.info('取消操作')
        }
      }).catch(erroer => {
        this.$message.error(`${erroer}`)
        console.log(erroer)
      })
    },
    // 接受子组件返回得参数，参数为一个this
    preupdatewaybilltransfer(data) {
      
      if (data !== null || data !== undefined) {
        planAndExecuteApi.updatewaybillbytransfer(data).then(res => {
          // eslint-disable-next-line no-empty
          if (!res) {

          }
        }).catch(_error => {

        }).finally(props => {
          this.$refs.detail.dialogVisible = false
        })
      }
    }

  }
}
</script>

<style>
.customstep {
  padding-right: 110px;
}
.el-table td,
.el-table th {
  text-align: center;
}
body .el-table th.gutter {
  display: table-cell !important;
}
.el-table .red {
  background: hsl(0, 83%, 93%);
}
.el-table .green {
  background: hsl(138, 84%, 87%);
}
.el-table .blue {
  background: hsl(184, 71%, 77%);
}
.el-table .yellow {
  background: hsl(56, 100%, 84%);
}
.el-table__expanded-cell[class*="cell"] {
  padding: 0px;
}
.el-table {
  font-size: 13px;
  margin: 0;
}
</style>
