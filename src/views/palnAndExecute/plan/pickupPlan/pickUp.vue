<template>
  <div>
    <el-row>
      <el-form ref="pickupForm" :inline="true" :model="plan" :rules="rules" class="demo-form-inline">
        <!-- <el-form-item label="提货单号:">
          <el-input v-model="plan.deliveryBillNo" placeholder="由系统生成" disabled size="mini" />
        </el-form-item>
        <el-form-item label="提货批次:">
          <el-input v-model="plan.deliveryBatchNo" placeholder="由系统生成" disabled size="mini" />
        </el-form-item> -->
        <el-col :span="5">
          <el-form-item label="司机:" prop="driverId">
            <el-select
              v-model="plan.driverId"
              filterable
              style="width:176px"
              placeholder="请选择"
              size="mini"
              @change="changeDriver"
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
          <el-form-item label="车辆:" prop="car">
            <el-select
              v-model="plan.car"
              filterable
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
        </el-col>
        <el-col :span="5">
          <el-form-item label="始发地:" prop="startStation">
            <!-- <el-select v-model="plan.startStation" size="mini">
            <option
              v-for="item in startStationList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select> -->
            <el-input v-model="plan.startStation" size="mini" />
          </el-form-item>
          <el-form-item label="目的地:" prop="goalStation">
            <el-input v-model="plan.goalStation" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="紧急程度:" prop="urgencyDegree" label-width="120px">
            <el-select v-model="plan.urgencyDegree" placeholder="请选择" size="mini">
              <el-option
                v-for="item in urgencyDegreeList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="预约提货时间:" prop="preDeliveryTime" label-width="120px">
            <el-date-picker
              v-model="plan.preDeliveryTime"
              size="mini"
              type="datetime"
              style="width:180px"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="站点:">
          <el-select v-model="plan.station" size="mini">
            <option
              v-for="item in stationList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="站点:">
          <el-input v-model="plan.station" size="mini" />
        </el-form-item> -->
        <el-col :span="6">
          <el-form-item label="调度员:" prop="dispatcher" label-width="90px">
            <el-input v-model="plan.dispatcher" disabled filterable size="mini" placeholder="请选择" />
          </el-form-item>
          <el-form-item label="调度员电话:" prop="dispatcherTel" label-width="90px">
            <el-input v-model="plan.dispatcherTel" disabled size="mini" />
          </el-form-item>
        </el-col>
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
          <div style="float: right">
            <el-button type="primary" @click.native="chooseWaybill()">增加</el-button>
            <el-button type="danger" @click.native="deleteWaybill()">删除</el-button>
          </div>
          <el-table
            ref="table"
            v-loading="queryLoading"
            :cell-style="rowClass"
            height="400px"
            :header-cell-style="headClass"
            element-loading-text="Loading"
            :data="tableData"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" reserve-selection width="55" />
            <el-table-column label="序号" type="index" width="55" />
            <el-table-column label="客户" prop="customer" width="100" show-overflow-tooltip />
            <el-table-column label="订单号" prop="orderNo" width="120" show-overflow-tooltip />
            <el-table-column label="仓库地址" prop="warehouseAddress" width="110" align="center" />
            <el-table-column label="状态" prop="status" width="100">
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
            <el-table-column label="收货人" prop="receiver" width="120" show-overflow-tooltip />
            <el-table-column label="收货人公司" prop="receiverCompany" width="90" show-overflow-tooltip align="center" />
            <el-table-column label="下单时间" prop="placeBillwayTime" width="100" />
            <!-- <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip /> -->
            <el-table-column label="起始城市" show-overflow-tooltip prop="startCity" width="120" />
            <el-table-column label="目的城市" show-overflow-tooltip prop="goalCity" width="120" />
            <el-table-column label="目的县区" show-overflow-tooltip prop="goalCounty" width="120" align="center" />
            <el-table-column label="货品" prop="goods" show-overflow-tooltip />
            <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip />
            <el-table-column label="箱数" prop="quantity" show-overflow-tooltip />
            <el-table-column label="未提箱数" prop="stock" show-overflow-tooltip>
              <template slot-scope="{row}">
                <span>
                  {{ !row.stock?'0':row.stock }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="体积" prop="cubage" show-overflow-tooltip />
            <el-table-column label="重量" prop="weight" show-overflow-tooltip />
            <el-table-column label="计价方式" prop="dictionaryDTO.value" show-overflow-tooltip />
            <el-table-column label="回单份数" prop="signDocumentNum" show-overflow-tooltip />
            <!-- <el-table-column label="机构" prop="orgName" show-overflow-tooltip />
            <el-table-column label="公司" prop="companyName" show-overflow-tooltip />
            <el-table-column label="更新人" prop="modifier" show-overflow-tooltip />
            <el-table-column label="更新时间" prop="updatedTime" width="100" />-->
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
    <el-row style="margin-left:80%;margin-top:1%">
      <el-button @click="parentCancelHandel()">取 消</el-button>
      <el-button type="primary" :loading="confirmBtnLoading" @click="confirm">确 定</el-button>
    </el-row>
    <el-dialog v-dialogDrag top="5vh" :before-close="comCancelHandel" :close-on-click-modal="false" :visible.sync="waybillTableVisible" width="90%" append-to-body>
      <waybill ref="waybill" @addWaybill="addWaybill" @comCancelHandel="comCancelHandel" />
    </el-dialog>
  </div>
</template>

<script>
import waybill from './waybill/index.vue'
import detail from './waybill/detail'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
// import { version } from 'element-ui'
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
        startStation: [
          { required: true, message: '请输入始发地', trigger: 'blur' }
        ],
        goalStation: [
          { required: true, message: '请输入目的地', trigger: 'blur' }
        ],
        urgencyDegree: [
          { required: true, message: '请选择紧急程度', trigger: 'blur' }
        ],
        preDeliveryTime: [
          { required: true, message: '请选择预约提货时间', trigger: 'blur' }
        ]
      },
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      queryLoading: false, // 表格加载
      defaultProps: {
        children: 'children',
        label: 'label',
        value: 'value'
      },
      driverList: [],
      carList: [],
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
      waybillList: [],
      vehicleList: [], // 车辆下拉列表
      stationList: [], // 站点下拉列表
      tableData: [],
      multiSelection: [],
      dialogVisible: false,
      getRowKeys(row) { // 行id
        return row.id
      },
      plan: {
        id: '',
        deliveryBillNo: '',
        deliveryBatchNo: '',
        startStation: '',
        goalStation: '',
        urgencyDegree: '',
        preDeliveryTime: '',
        car: '',
        driverId: '',
        driver: '',
        dispatcher: getName(),
        dispatcherTel: getTel()
      },
      waybillTableVisible: false,
      confirmBtnLoading: false, // 确认按钮加载
      deleteWaybillDTO: [], // 存放编辑时删除的数据
      pickupPlanDetailDTOList: {} // 存放pickupPlanDetail数据
    }
  },
  created() {
  },
  mounted() {
    this.$set(this.plan, 'urgencyDegree', '2')
    planAndExecuteApi.queryDriver().then(res => {
      // this.driverList = res.body
      this.driverList = res
      console.log(getName())
    })

    this.getSelectInfo()
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
          if (item.placeBillwayTime) {
            item.placeBillwayTime = this.formatTime(item.placeBillwayTime)
          }
        })
        this.queryLoading = false
        this.plan = res.pickupPlanDTO
        this.pickupPlanDetailDTOList = res.pickupPlanDetailDTOList
        this.tableData = res.waybillDTOList
      }).catch(err => {
        this.queryLoading = false
        this.$message.error(err)
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
    parentCancelHandel() {
      this.plan = { // 取消时数据初始化
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
      this.$set(this.plan, 'urgencyDegree', '2')
      this.tableData = []
      this.$emit('parentCancelHandel')
    },
    confirm() {
      let isValid = true
      this.confirmBtnLoading = true

      this.$refs['pickupForm'].validate((valid) => {
        isValid = valid
      })
      if (!isValid) {
        this.confirmBtnLoading = false
        return
      }
      var list = []

      // console.log(this.tableData)
      // for (var i = 0; i < this.tableData.length; i++) {
      //   list.push({
      //     waybillId: this.tableData[i].id,
      //     waybillNo: this.tableData[i].mailNo,
      //     version: this.tableData[i].version
      //   })
      // }
      // var plan = this.plan
      // var parm = {
      //   pickupPlanDTO: plan,
      //   pickupPlanDetailDTOList: list
      // }
      if (!this.tableData.length) {
        this.$message.warning('您还未增加提货单')
        this.confirmBtnLoading = false
        return
      }
      const plan = this.plan
      plan.preDeliveryTime = this.formatTime(plan.preDeliveryTime)
      let parm = {}
      if (this.type === 'add') {
        console.log(this.tableData)
        for (var i = 0; i < this.tableData.length; i++) {
          // 增加状态：10 删除状态：20
          list.push({
            waybillId: this.tableData[i].id,
            waybillNo: this.tableData[i].mailNo,
            version: this.tableData[i].version
            // status: 1
          })
        }

        parm = {
          pickupPlanDTO: plan,
          pickupPlanDetailDTOList: list
        }
        planAndExecuteApi.add(parm).then(res => {
          this.confirmBtnLoading = false
          this.$emit('close', 1)
          this.parentCancelHandel()
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
          pickupPlanDTO: plan,
          pickupPlanDetailDTOList: list
        }
        planAndExecuteApi.update(parm).then(res => {
          if (!res) {
            this.$message.warning('编辑失败，请重试')
          }
          this.confirmBtnLoading = false
          this.parentCancelHandel()
          this.$emit('close', 1)
        }).catch(err => {
          this.$message.error(err)
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
    // 初始化下拉框列表
    getSelectInfo() {
      planAndExecuteApi.getStation().then(res => {
        console.log(res)
        this.stationList = res
      })
      planAndExecuteApi.getVehicle().then(res => {
        console.log(res)
        this.vehicleList = res.data
      })
    },
    addWaybill(val) {
      // for (var i = 0; i < val.length; i++) {
      //   if (this.tableData.indexOf(val[i]) === -1) {
      //     this.tableData.push(val[i])
      //   }
      // }
      val.map(item => {
        if (JSON.stringify(this.tableData).indexOf(JSON.stringify(item)) === -1) {
          this.tableData.push(Object.assign(item, { status: 1 }))
        }
      })
      // this.$nextTick(function() {
      //   this.$refs.waybill.getTableData()
      // })
      this.page.total = this.tableData.length
      this.waybillTableVisible = false
    },
    comCancelHandel() {
      this.waybillTableVisible = false
    },

    deleteWaybill() {
      // var list = []
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

      // for (var i = 0; i < this.multiSelection.length; i++) {
      //   for (var j = 0; j < this.tableData.length; j++) {
      //     if (this.multiSelection[i].id !== this.tableData[j].id) {
      //       list.push(this.tableData[j])
      //     }
      //   }
      // }
      // this.tableData = list
      // this.tableData = []
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
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleEdit(row) {
      this.dialogVisible = true
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
