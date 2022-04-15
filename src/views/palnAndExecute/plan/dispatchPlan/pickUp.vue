<template>
  <div style="height:600px">
    <el-row>
      <el-form ref="dispatchForm" :inline="true" :model="plan" :rules="rules" class="demo-form-inline">
        <!-- <el-form-item label="配送单号:">
          <el-input v-model="plan.dispatchBillNo" size="mini" />
        </el-form-item>
        <el-form-item label="配送批次:">
          <el-input v-model="plan.dispatchBatchNo" size="mini" />
        </el-form-item> -->
        <el-col :span="3">
          <el-form-item label="司机:" style="width:156%" prop="driverId">
            <el-select v-model="plan.driverId" style="width:70%" placeholder="请选择" size="mini" @change="changeDriver">
              <el-option
                v-for="item in driverList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="车辆:" style="width:150%" prop="car">
            <el-select
              v-model="plan.car"
              filterable
              style="width:70%"
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
          <el-form-item label="配送类型:" style="width:156%" prop="dispatchType" label-width="90px">
            <el-select v-model="plan.dispatchType" style="width:70%" clearable placeholder="请选择" size="mini" @change="handleSelect">
              <el-option
                v-for="item in dispatchTypeList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="紧急程度:" style="width:156%" prop="urgentDegree" label-width="90px">
            <el-select v-model="plan.urgentDegree" style="width:70%" placeholder="请选择" size="mini">
              <el-option
                v-for="item in urgencyDegreeList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="始发地:" style="width:100%" prop="startStation" label-width="70px">
            <el-input v-model="plan.startStation" placeholder="请输入始发地" size="mini" />
          </el-form-item>
          <el-form-item label="到达地:" style="width:100%" prop="goalStation" label-width="70px">
            <el-input v-model="plan.goalStation" placeholder="请输入到达地" size="mini" />
          </el-form-item>
        </el-col>
        <el-col v-show="isShowAllactionAndCompany" :span="4">
          <el-form-item label="分拨点:" style="width:156%" prop="allactionCentreId" label-width="70px">
            <el-select v-model="plan.allactionCentreId" style="width:70%" clearable placeholder="请选择" size="mini">
              <el-option
                v-for="item in allactionCentreList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="分公司:" style="width:156%" prop="dispatchArriveCompanyId" label-width="70px">
            <el-select v-model="plan.dispatchArriveCompanyId" style="width:70%" clearable placeholder="请选择" size="mini">
              <el-option
                v-for="item in dispatchArriveCompanyList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="运输方式:" style="width:152%" label-width="90px" prop="dispatchType">
            <el-select v-model="plan.transportWay" style="width:70%" clearable placeholder="请选择" size="mini" @change="handleSelect">
              <el-option
                v-for="item in transportWayList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="调度员:" style="width:152%" label-width="90px">
            <el-input v-model="plan.dispatcher" disabled style="width:76%" size="mini" />
          </el-form-item>
        </el-col>
        <el-form-item label="预约配送时间:" prop="preSendTime">
          <el-date-picker
            v-model="plan.preSendTime"
            size="mini"
            type="datetime"
            style="width:180px"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择时间"
          />
        </el-form-item>

        <el-form-item label="调度员电话:" label-width="110px">
          <el-input v-model="plan.tel" disabled size="mini" style="width:180px" />
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="10">
      <div style="display: flex">
        <!-- <div style="padding-right: 20px;width: 200px;overflow: scroll;height: 500px">
          <el-tree
            :data="data"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
          />
        </div> -->
        <div style="padding-left: 5px;width: 100%">
          <el-input v-model="orderValue" clearable size="mini" style="width:200px" placeholder="搜索订单号录入" @keyup.enter.native="getWaybillTableData()" @click="getWaybillTableData()" />
          <div style="float: right;">
            <el-button type="primary" @click="chooseWaybill()">增加</el-button>
            <el-button type="danger" @click="deleteWaybill()">删除</el-button>
          </div>
          <el-table
            ref="table"
            v-loading="queryLoading"
            element-loading-text="Loading"
            height="400px"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            :data="tableData"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" reserve-selection width="55" />
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column label="客户" prop="customer" width="100" show-overflow-tooltip />
            <el-table-column label="订单号" prop="orderNo" width="120" show-overflow-tooltip />
            <el-table-column label="下单时间" prop="createdTime" width="100" />
            <el-table-column label="状态" prop="status" width="90">
              <template slot-scope="{row}">
                <span>
                  {{
                    parseInt(row.status) === 1
                      ?'待制定'
                      :parseInt(row.status) === 21
                        ?'待提货'
                        :parseInt(row.status) === 31
                          ?'提货中'
                          :parseInt(row.status) === 41
                            ?'已提货'
                            :parseInt(row.status) === 51
                              ?'待配送'
                              :parseInt(row.status) === 61
                                ?'配送中'
                                :parseInt(row.status) === 71
                                  ?'到达'
                                  :parseInt(row.status) === 81
                                    ?'配送签收'
                                    :parseInt(row.status) === 91
                                      ?'签收异常'
                                      :parseInt(row.status) === 111
                                        ?'部分签收':row.status
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="收货人" prop="receiver" width="90" align="center" />
            <el-table-column label="收货人公司" prop="receiverCompany" width="90" show-overflow-tooltip align="center" />
            <el-table-column label="目的地址" show-overflow-tooltip prop="goalAddress" width="120" align="center" />
            <el-table-column label="始发地" show-overflow-tooltip prop="startAddress" width="120" align="center" />
            <el-table-column label="仓库" prop="warehouseAddress" width="120" align="center" />
            <!-- <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip /> -->
            <el-table-column label="货品" prop="goods" show-overflow-tooltip />
            <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip />
            <el-table-column label="箱数" prop="quantity" show-overflow-tooltip />
            <el-table-column label="体积" prop="cubage" show-overflow-tooltip />
            <el-table-column label="重量" prop="weight" show-overflow-tooltip />
            <el-table-column label="计价方式" prop="dictionaryDTO.value" show-overflow-tooltip />
            <el-table-column label="回单份数" prop="signDocumentNum" show-overflow-tooltip />
            <!-- <el-table-column label="机构" prop="orgizationDTO.name" show-overflow-tooltip />
            <el-table-column label="公司" prop="companyDTO.name" show-overflow-tooltip />
            <el-table-column label="更新人" prop="modifier" show-overflow-tooltip />
            <el-table-column label="更新时间" prop="updatedTime" width="100" /> -->
          </el-table>
          <!-- <div class="block" style="float:left">
            <el-pagination
              :current-page="page.current"
              :page-sizes="page.sizes"
              :page-size="page.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div> -->
        </div>
      </div>
    </el-row>
    <el-row style="float:right;margin-top:1%">
      <el-button @click="parentCancelHandel()">取 消</el-button>
      <el-button type="primary" :loading="confirmBtnLoading" @click="confirm">确 定</el-button>
    </el-row>
    <el-dialog v-dialogDrag top="5vh" :before-close="waybillCancelHandel" :close-on-click-modal="false" :visible.sync="waybillTableVisible" width="90%" append-to-body>
      <waybill ref="waybill" @addWaybill="addWaybill" @waybillCancelHandel="waybillCancelHandel" />
    </el-dialog>
  </div>
</template>

<script>
import waybill from './waybill/index.vue'
import detail from './waybill/detail'
import { WaybillApi } from '@/api/waybill/waybill'
import { planAndExecuteApi } from '@/api/planAndExecute/dispatchPlan'
import { getName, getTel } from '@/utils/auth'
export default {

  name: 'PickUp',
  components: { waybill, detail },
  props: ['data', 'type'],
  data() {
    return {
      // 表单校验
      rules: {
        car: [
          { required: true, message: '请选择车辆', trigger: 'blur' }
        ],
        driverId: [
          { required: true, message: '请选择司机', trigger: 'blur' }
        ],
        dispatchType: [
          { required: true, message: '请选择配送类型', trigger: 'blur' }
        ],
        allactionCentreId: [
          { required: false, message: '请选择分拨点', trigger: 'blur' }
        ],
        dispatchArriveCompanyId: [
          { required: false, message: '请选择分公司', trigger: 'blur' }
        ],
        startStation: [
          { required: true, message: '请输入始发地', trigger: 'blur' }
        ],
        goalStation: [
          { required: true, message: '请输入到达地', trigger: 'blur' }
        ],
        urgentDegree: [
          { required: true, message: '请选择紧急程度', trigger: 'blur' }
        ],
        preSendTime: [
          { required: true, message: '请选择预约配送时间', trigger: 'blur' }
        ]
      },
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      defaultProps: {
        children: 'children',
        label: 'label',
        value: 'value'
      },
      // 司机，配送类型、分拨点、分公司、紧急程度下拉
      driverList: [],
      vehicleList: [], // 车辆下拉列表
      transportWayList: [], // 运输方式下拉框列表
      dispatchTypeList: [
        { id: '1', name: '直达' },
        { id: '2', name: '中转' }
        // { id: 3, name: '调拨' }
      ],
      isShowAllactionAndCompany: false,
      queryLoading: false, // 表格加载
      allactionCentreList: [],
      dispatchArriveCompanyList: [],
      getRowKeys(row) { // 行id
        return row.id
      },
      urgencyDegreeList: [
        {
          id: '1',
          name: '加急'
        },
        {
          id: '2',
          name: '正常'
        }
      ],
      // ===============================
      tableData: [],
      multiSelection: [],
      dialogVisible: false,
      plan: {
        id: '',
        dispatchBillNo: '',
        dispatchBatchNo: '',
        dispatchType: '1',
        startStation: '',
        goalStation: '',
        urgentDegree: '2',
        preSendTime: '',
        transportWay: '陆运方式',
        car: '',
        driverId: '',
        driver: '',
        dispatcher: getName(),
        tel: getTel(),
        version: ''
      },
      orderValue: '',
      waybillTableVisible: false,
      confirmBtnLoading: false, // 确认按钮加载
      deleteWaybillDTO: [], // 存放编辑时删除的数据
      dispatchPlanDetailDTOList: {} // 存放pickupPlanDetail数据
    }
  },

  created() {
    planAndExecuteApi.queryDriver().then(res => {
      // this.driverList = res.body
      this.driverList = res
    })
    // 车辆下拉
    planAndExecuteApi.getVehicle().then(res => {
      console.log(res)
      this.vehicleList = res.data
    })
    // 获取分拨点下拉框数据
    planAndExecuteApi.allocation().then(res => {
      this.allactionCentreList = res.data
    })
    // 获取分公司下拉框数据
    planAndExecuteApi.allocationGetCompany().then(res => {
      this.dispatchArriveCompanyList = res.data
    })
    WaybillApi.getDictionaryWay(1340588501313388544n).then(res => {
      this.transportWayList = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
  },
  methods: {
    init(id) {
      planAndExecuteApi.showPlan(id).then(res => {
        res.waybillDTOList.map(item => {
          if (item.updatedTime) {
            item.updatedTime = this.formatTime(item.updatedTime)
          }
          if (item.createdTime) {
            item.createdTime = this.formatTime(item.createdTime)
          }
        })
        this.plan = res.dispatchPlanDTO
        this.tableData = res.waybillDTOList
        this.dispatchPlanDetailDTOList = res.dispatchPlanDetailDTOList
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
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
            (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
            (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
    },
    // 配送类型选框发生改变时对表单的分公司与分拨点校验规则进行改变
    handleSelect(selectValue) {
      console.log(selectValue)

      if (parseInt(selectValue) === 2) {
        this.isShowAllactionAndCompany = true
        this.rules.allactionCentreId.map(item => {
          item.required = true
        })
        this.rules.dispatchArriveCompanyId.map(item => {
          item.required = true
        })
      } else {
        this.isShowAllactionAndCompany = false
        this.rules.allactionCentreId.map(item => {
          item.required = false
        })
        this.rules.dispatchArriveCompanyId.map(item => {
          item.required = false
        })
      }
    },
    // 取消隐藏事件
    waybillCancelHandel() {
      this.waybillTableVisible = false
    },
    parentCancelHandel() {
      this.plan = { // 取消时数据初始化
        id: '',
        dispatchBillNo: '',
        dispatchBatchNo: '',
        startStation: '',
        goalStation: '',
        urgentDegree: '2',
        transportWay: '陆运方式',
        preSendTime: '',
        car: '',
        driverId: '',
        driver: '',
        dispatcher: getName(),
        tel: getTel(),
        version: ''
      }
      this.tableData = []
      this.isShowAllactionAndCompany = false
      this.$set(this.plan, 'urgencyDegree', '2')
      this.$set(this.plan, 'dispatchType', '1')
      this.$set(this.plan, 'transportWay', '陆运方式')
      this.$emit('parentCancelHandel')
    },
    confirm() {
      let isValid = true
      this.confirmBtnLoading = true
      console.log(this.$refs)
      this.$refs['dispatchForm'].validate((valid) => {
        isValid = valid
      })
      if (!isValid) {
        this.confirmBtnLoading = false
        return
      }
      var list = []
      // for (var i = 0; i < this.tableData.length; i++) {
      //   list.push({
      //     waybillId: this.tableData[i].id,
      //     waybillNo: this.tableData[i].mailNo,
      //     version: this.tableData[i].version
      //   })
      // }

      // var plan = this.plan
      // var parm = {
      //   dispatchPlanDTO: plan,
      //   dispatchPlanDetailDTOList: list
      // }
      if (!this.tableData.length) {
        this.$message.warning('您还未增加配送单')
        this.confirmBtnLoading = false
        return
      }
      const plan = this.plan
      plan.preSendTime = this.formatTime(plan.preSendTime)
      let parm = {}

      if (this.type === 'add') {
        console.log(this.tableData)
        for (var i = 0; i < this.tableData.length; i++) {
          // 增加状态：10 删除状态：20
          list.push({
            waybillId: this.tableData[i].id,
            waybillNo: this.tableData[i].mailNo,
            version: this.tableData[i].version,
            status: 1
          })
        }

        parm = {
          dispatchPlanDTO: plan,
          dispatchPlanDetailDTOList: list
        }
        planAndExecuteApi.add(parm).then(res => {
          this.parentCancelHandel()
          this.$emit('close', 1)
          this.confirmBtnLoading = false
        }).catch(err => {
          this.$message.error(err)
          this.confirmBtnLoading = false
        })
      } else {
        this.tableData.map(item => {
          // 增加状态：10 删除状态：20
          list.push({
            waybillId: item.id,
            waybillNo: item.mailNo,
            version: item.version
          })
        })
        parm = {
          dispatchPlanDTO: plan,
          dispatchPlanDetailDTOList: list
        }
        planAndExecuteApi.update(parm).then(res => {
          if (!res) {
            this.$message.warning('编辑失败，请重试')
          }
          this.parentCancelHandel()
          this.$emit('close', 1)
          this.confirmBtnLoading = false
        }).catch(err => {
          this.$message.error(err)
          this.parentCancelHandel()
          this.confirmBtnLoading = false
        })
      }
    },
    changeDriver() {
      for (var i = 0; i < this.driverList.length; i++) {
        if (this.driverList[i].id === this.plan.driverId) {
          this.plan.driver = this.driverList[i].name
          break
        }
      }
    },
    addWaybill(val) {
      // for (var i = 0; i < val.length; i++) {
      //   if (this.tableData.indexOf(val[i]) === -1) {
      //     this.tableData.push(val[i])
      //   }
      // }
      val.map(item => {
        // if (JSON.stringify(this.tableData).indexOf(JSON.stringify(Object.assign(item, { status: 1 }))) === -1) {
        if (JSON.stringify(this.tableData).indexOf(JSON.stringify(Object.assign(item, { status: 41 }))) === -1) {
          this.tableData.push(item)
        }
      })
      this.page.total = this.tableData.length
      this.waybillTableVisible = false
    },
    /**
     * 删除内容
     */
    deleteWaybill() {
      // var list = []
      // for (var i = 0; i < this.multiSelection.length; i++) {
      //   for (var j = 0; j < this.tableData.length; j++) {
      //     if (this.multiSelection[i].id !== this.tableData[j].id) {
      //       list.push(this.tableData[j])
      //     }
      //   }
      // }
      // this.tableData = list
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
      // this.multiSelection.map(itemDelete => {
      //   this.tableData.remove(itemDelete)
      // })
      this.multiSelection = []
      this.$refs.table.clearSelection()
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    // 表头样式设置
    headClass() {
      return 'text-align: center;color:rgb(140,138,140)'
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 分页监听页数变化
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // this.page.current = val
      // this.getTableData()
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleEdit(row) {
      this.dialogVisible = true
    },
    getWaybillTableData() {
      this.queryLoading = true
      const query = {
        orderNo: this.orderValue
      }

      var page = {
        pageNum: 1,
        pageSize: this.page.pageSize
      }
      Object.assign(query, page)
      if (query.startTime && query.endTime) {
        query.startTime = this.dayTime(query.startTime, 'start')
        query.endTime = this.dayTime(query.endTime, 'end')
      } else {
        query.startTime = ''
        query.endTime = ''
      }
      query.status = 41
      query.masterFlag = 1
      // query.passFlag = 1
      WaybillApi.commonQuery(query).then(res => {
        // eslint-disable-next-line no-extend-native
        Array.prototype.remove = function(val) {
          var index = this.indexOf(val)
          if (index > -1) {
            this.splice(index, 1)
          }
          console.log(res)
        }
        let hasTableData = false // 判断是否有订单添加
        this.tableData.map(item => {
          if (item.orderNo === res.data[0].orderNo) {
            this.$message.error('该运单已添加')
            hasTableData = true
            this.queryLoading = false
          }
        })
        if (hasTableData) {
          return
        }
        this.tableData.push(res.data[0])
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
      })
    },
    chooseWaybill() {
      this.$nextTick(function() {
        this.$refs.waybill.getTableData(this.$refs.waybill.searchForm)
      })
      this.waybillTableVisible = true
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style>

</style>
