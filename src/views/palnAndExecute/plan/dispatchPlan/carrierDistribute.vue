<template>
  <div style="height:700px">

    <el-tabs v-model="editableTabsValue" type="border-card" editable @edit="addCarrierData">
      <el-tab-pane v-for="(itemAll,indexAll) in allData" :key="indexAll" :name="indexAll.toString()" :label="`配送段${indexAll+1}`">
        <el-row>
          <el-form :ref="`dispatchForm${indexAll}`" :inline="true" label-width="80px" :model="itemAll.plan" :rules="rules" class="demo-form-inline">
            <!-- <el-form-item label="配送单号:">
          <el-input v-model="plan.dispatchBillNo" size="mini" />
        </el-form-item>
        <el-form-item label="配送批次:">
          <el-input v-model="plan.dispatchBatchNo" size="mini" />
        </el-form-item> -->
            <el-col :span="4">
              <el-form-item label="司机:" prop="driverId" :rules="rules.driverId" label-width="60px" style="width:101%">
                <el-select v-model="itemAll.plan.driverId" placeholder="请选择" size="mini" @change="changeDriver(itemAll.plan)">
                  <el-option
                    v-for="item in driverList"
                    :key="item.id"
                    size="mini"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="车辆:" prop="car" label-width="60px" style="width:101%">
                <el-select
                  v-model="itemAll.plan.car"
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
              <el-form-item label="始发地:" prop="startStation" style="width:105%">
                <el-input v-model="itemAll.plan.startStation" size="mini" />
              </el-form-item>
              <el-form-item label="到达地:" prop="goalStation" style="width:105%">
                <el-input v-model="itemAll.plan.goalStation" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="承运商:" label-width="100px" prop="carrierId">
                <el-select v-model="itemAll.plan.carrierId" clearable filterable placeholder="请选择" size="mini">
                  <el-option
                    v-for="item in carrierList"
                    :key="item.id"
                    size="mini"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="紧急程度:" label-width="100px" prop="urgentDegree">
                <el-select v-model="itemAll.plan.urgentDegree" placeholder="请选择" size="mini">
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
            <el-col :span="5">
              <el-form-item label="运输方式:" label-width="120px" style="width:102%" prop="dispatchType">
                <el-select v-model="itemAll.plan.transportWay" clearable placeholder="请选择" size="mini" @change="handleSelect">
                  <el-option
                    v-for="item in transportWayList"
                    :key="item.id"
                    size="mini"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="预约配送时间:" style="width:102%" label-width="120px" prop="preSendTime">
                <el-date-picker
                  v-model="itemAll.plan.preSendTime"
                  size="mini"
                  type="datetime"
                  style="width:180px"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="预约配送时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="调度员:" label-width="90px">
                <el-input v-model="itemAll.plan.dispatcher" disabled size="mini" style="width:180px" />
              </el-form-item>
              <el-form-item label="配送类型:" label-width="90px" prop="dispatchType">
                <el-select v-model="itemAll.plan.dispatchType" disabled clearable placeholder="请选择" size="mini" @change="handleSelect">
                  <el-option
                    v-for="item in dispatchTypeList"
                    :key="item.id"
                    size="mini"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="调度电话:">
                <el-input v-model="itemAll.plan.tel" disabled size="mini" style="width:165px" />
              </el-form-item> -->
            </el-col>
          </el-form>

        </el-row>
        <el-row :gutter="10">
          <div style="display: flex">
            <div style="padding-left: 5px;width: 100%">
              <el-input v-show="indexAll===0" v-model="orderValue" clearable size="mini" style="width:200px" placeholder="搜索订单号录入" @keyup.enter.native="getWaybillTableData()" @click="getWaybillTableData()" />
              <div style="float: right">
                <el-button type="primary" @click="chooseWaybill(itemAll.tableData)">增加</el-button>
                <el-button type="danger" @click="deleteWaybill(itemAll.tableData)">删除</el-button>
              </div>
              <el-table
                ref="table"
                v-loading="queryLoading"
                element-loading-text="Loading"
                height="400px"
                style="width:100%"
                :cell-style="rowClass"
                :header-cell-style="headClass"
                :data="itemAll.tableData"
                :row-key="getRowKeys"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" reserve-selection width="50" />
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column label="客户" prop="customer" width="90" show-overflow-tooltip />
                <el-table-column label="订单号" prop="orderNo" width="120" show-overflow-tooltip />
                <el-table-column label="下单时间" prop="createdTime" show-overflow-tooltip width="110" />
                <el-table-column label="状态" prop="status" width="80">
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
                <el-table-column label="收货人" prop="receiver" width="80" align="center" />
                <el-table-column label="收货人公司" prop="receiverCompany" width="90" show-overflow-tooltip align="center" />
                <el-table-column label="目的地" prop="goalAddress" show-overflow-tooltip width="120" align="center" />
                <el-table-column label="始发地" prop="startAddress" show-overflow-tooltip width="120" align="center" />
                <el-table-column label="仓库" prop="warehouseAddress" width="120" align="center" />
                <!-- <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip /> -->
                <el-table-column label="货品" prop="goods" show-overflow-tooltip />
                <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip />
                <el-table-column label="箱数" prop="quantity" width="70" />
                <el-table-column label="体积" prop="cubage" width="70" />
                <el-table-column label="重量" prop="weight" show-overflow-tooltip />
                <el-table-column label="计价方式" prop="dictionaryDTO.value" show-overflow-tooltip />
                <el-table-column label="回单份数" prop="signDocumentNum" show-overflow-tooltip />
                <!-- <el-table-column label="机构" prop="orgizationDTO.name" show-overflow-tooltip />
                <el-table-column label="公司" prop="companyDTO.name" show-overflow-tooltip />
                <el-table-column label="更新人" prop="modifier" show-overflow-tooltip />
                <el-table-column label="更新时间" prop="updatedTime" width="100" /> -->
              </el-table>
            </div>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-button type="primary" icon="el-icon-plus" circle size="mini" class="plusBtn" @click="addCarrierData" /> -->

    <el-row style="float:right;margin-top:1%;margin-right:10px">
      <el-button @click="parentCancelHandel()">取 消</el-button>
      <el-button type="primary" :loading="confirmBtnLoading" @click="confirm">确 定</el-button>
    </el-row>
    <el-dialog v-dialogDrag top="5vh" :before-close="waybillCancelHandel" :close-on-click-modal="false" :visible.sync="waybillTableVisible" width="90%" append-to-body>
      <waybill ref="waybill" @addWaybill="addWaybill" @waybillCancelHandel="waybillCancelHandel" />
    </el-dialog>
    <el-dialog v-dialogDrag top="5vh" :before-close="waybillCancelHandel" :close-on-click-modal="false" :visible.sync="carrierWaybillTableVisible" width="90%" append-to-body>
      <carrierWaybill ref="carrierWaybill" @addWaybill="addWaybill" @waybillCancelHandel="waybillCancelHandel" />
    </el-dialog>
  </div>
</template>

<script>
import waybill from './waybill/index.vue'
import carrierWaybill from './waybill/carrierWaybill.vue'
import { WaybillApi } from '@/api/waybill/waybill'
import { planAndExecuteApi } from '@/api/planAndExecute/dispatchPlan'
import { getName, getTel } from '@/utils/auth'
export default {

  name: 'PickUp',
  components: { waybill, carrierWaybill },
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
        // allactionCentreId: [
        //   { required: false, message: '请选择分拨点', trigger: 'blur' }
        // ],
        // dispatchArriveCompanyId: [
        //   { required: false, message: '请选择分公司', trigger: 'blur' }
        // ],
        carrierId: [
          { required: false, message: '请选择承运商', trigger: 'blur' }
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
      editableTabsValue: '0',
      // 司机，配送类型、分拨点、分公司、紧急程度下拉
      driverList: [],
      vehicleList: [], // 车辆下拉列表
      transportWayList: [], // 运输方式下拉框列表
      carrierList: [], // 承运商下拉框列表
      dispatchTypeList: [
        { id: '1', name: '直达' },
        { id: '2', name: '中转' }
      ],
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
      allData: [
        { plan: {
          id: '',
          dispatchBillNo: '',
          dispatchBatchNo: '',
          dispatchType: '2',
          startStation: '',
          goalStation: '',
          urgentDegree: '2',
          preSendTime: '',
          transportWay: '陆运方式',
          car: '',
          isMainPlan: true, // 标记主从计划
          driverId: '',
          driver: '',
          dispatcher: getName(),
          tel: getTel(),
          version: ''
        }, tableData: [] }
      ],
      multiSelection: [],
      dialogVisible: false,
      orderValue: '',
      waybillTableVisible: false,
      carrierWaybillTableVisible: false, // 二级承运商弹窗
      confirmBtnLoading: false, // 确认按钮加载
      deleteWaybillDTO: [], // 存放编辑时删除的数据
      dispatchPlanDetailDTOList: {} // 存放pickupPlanDetail数据
    }
  },

  created() {
    // 获取承运商列表
    planAndExecuteApi.getCarrierList({ pageSize: 1000 }).then(res => {
      this.carrierList = res.data
    })
    // 获取司机列表
    planAndExecuteApi.queryDriver().then(res => {
      // this.driverList = res.body
      this.driverList = res
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
    // 获取分公司下拉框数据
    planAndExecuteApi.allocationGetCompany().then(res => {
      this.dispatchArriveCompanyList = res.data
    })
    // 获取运输方式列表
    WaybillApi.getDictionaryWay(1340588501313388544n).then(res => {
      this.transportWayList = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
  },
  methods: {
    // 根据id获取相关计划数据
    init(id) {
      this.queryLoading = true
      planAndExecuteApi.showCarrierPlan(id).then(res => {
        let allData = [
          { plan: { id: '', dispatchBillNo: '', dispatchBatchNo: '', dispatchType: '2',
            startStation: '', goalStation: '', urgentDegree: '2', preSendTime: '',
            transportWay: '陆运方式', car: '', isMainPlan: true, // 标记主从计划
            driverId: '', driver: '', dispatcher: getName(), tel: getTel(), version: ''
          }, tableData: [] }
        ]
        allData = res.map(item => {
          let plan = plan = item.dispatchPlanDTO
          let tableData = tableData = item.waybillDTOList
          let dispatchPlanDetailDTOList = dispatchPlanDetailDTOList = item.dispatchPlanDetailDTOList
          return { plan, tableData, dispatchPlanDetailDTOList }
        })
        console.log(this.allData)
        this.allData = allData
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
      })
    },
    /**
     * 增加和删除Tab
     */
    addCarrierData(targetName, action) {
      targetName = parseInt(targetName)

      if (action === 'add') {
        // 判断是否是增加
        let isValid = true
        for (let i = 0; i < this.allData.length; i++) {
          console.log(i)
          console.log(this.$refs)
          this.$refs[`dispatchForm${i}`][0].validate((valid) => {
            isValid = valid
            console.log(valid)
          })
          if (!isValid) {
            this.confirmBtnLoading = false
            this.$message.warning('计划项目信息存在为空，无法增加')
            return
          }
        }
        // 判断是否选择了运单
        if (!this.allData[this.allData.length - 1].tableData.length) {
          this.$message.warning('请先选择运单')
          return
        }
        let carrierWaybillData = this.allData[0].tableData
        this.allData.map((item, index) => {
          if (index !== 0) {
            item.tableData.map(tbItem => {
              carrierWaybillData = carrierWaybillData.filter(da => {
                console.log(da !== tbItem)
                console.log(da)
                console.log(tbItem)
                return da !== tbItem
              })
            })
          }
        })
        // 判断一级承运商的运单是否已经全部分配完毕
        if (!carrierWaybillData.length) {
          this.$message.warning('运单已全部添加，无法增加配送段')
          return
        }
        // 增加配送段
        this.allData.push({ plan: {
          id: '',
          dispatchBillNo: '',
          dispatchBatchNo: '',
          dispatchType: '1',
          startStation: '',
          goalStation: '',
          transportWay: '陆运方式',
          urgentDegree: '2',
          preSendTime: '',
          car: '',
          driverId: '',
          driver: '',
          dispatcher: getName(),
          tel: getTel(),
          version: ''
        }, tableData: [] })
        this.editableTabsValue = (this.allData.length - 1).toString()
      } else {
        if (this.allData.length === 1) {
          this.$message.warning('只存在一个,无法删除')
          return
        }
        this.$confirm('此操作删除该配送段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 判断是否删除的是选中的tab，如果是就往上或下移一个
          if (parseInt(this.editableTabsValue) === targetName) {
            console.log(this.allData.length)
            this.editableTabsValue = this.allData[targetName + 1] ? targetName + 1 : targetName - 1
          } else if (parseInt(this.editableTabsValue) === this.allData.length - 1) {
            const editableTabsValue = this.allData.length - 2
            this.editableTabsValue = editableTabsValue.toString()
          }
          // 过滤掉删除的数据
          const newData = this.allData.filter((item, index) => {
            return index !== targetName
          })
          this.allData = newData
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
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
        this.rules.allactionCentreId.map(item => {
          item.required = true
        })
        this.rules.dispatchArriveCompanyId.map(item => {
          item.required = true
        })
      } else {
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
      this.carrierWaybillTableVisible = false
    },
    parentCancelHandel() {
      this.allData = [
        { plan: { id: '', dispatchBillNo: '', dispatchBatchNo: '', dispatchType: '2',
          startStation: '', goalStation: '', urgentDegree: '2', preSendTime: '',
          transportWay: '陆运方式', car: '', isMainPlan: true, // 标记主从计划
          driverId: '', driver: '', dispatcher: getName(),
          tel: getTel()
        }, tableData: [] }
      ]
      this.$emit('parentCancelHandel')
    },
    confirm() {
      let isValid = true
      // this.confirmBtnLoading = true
      console.log(this.$refs)

      for (let i = 0; i < this.allData.length; i++) {
        console.log(i)
        this.$refs[`dispatchForm${i}`][0].validate((valid) => {
          isValid = valid
          console.log(valid)
        })
        if (!isValid) {
          this.confirmBtnLoading = false
          this.$message.warning('计划项目信息存在为空，请确认')
          return
        }
      }
      // 判断是否存在配送单为空的tab
      const hasTableData = this.allData.every((item, index) => {
        return item.tableData.length !== 0
      })
      if (!hasTableData) {
        this.$message.warning('您还未增加配送单')
        this.confirmBtnLoading = false
        return
      }

      const parmList = []

      if (this.type === 'add') {
        this.allData.map(item => {
          const list = []
          let parm = {}
          const plan = item.plan
          plan.preSendTime = this.formatTime(plan.preSendTime)

          for (var i = 0; i < item.tableData.length; i++) {
            // 增加状态：10 删除状态：20
            list.push({
              waybillId: item.tableData[i].id,
              waybillNo: item.tableData[i].mailNo,
              version: item.tableData[i].version
            })
          }
          parm = {
            dispatchPlanDTO: plan,
            dispatchPlanDetailDTOList: list
          }
          parmList.push(parm)
        })
        planAndExecuteApi.addCarrierPlan(parmList).then(res => {
          this.$emit('close', 1)
          this.confirmBtnLoading = false
        }).catch(err => {
          this.$message.error(err)
          this.confirmBtnLoading = false
        })
      } else {
        this.allData.map(item => {
          const list = []
          let parm = {}
          const plan = item.plan
          plan.preSendTime = this.formatTime(plan.preSendTime)

          for (var i = 0; i < item.tableData.length; i++) {
            // 增加状态：10 删除状态：20
            list.push({
              waybillId: item.tableData[i].id,
              waybillNo: item.tableData[i].mailNo,
              version: item.tableData[i].version
            })
          }
          parm = {
            dispatchPlanDTO: plan,
            dispatchPlanDetailDTOList: list
          }
          parmList.push(parm)
        })

        planAndExecuteApi.carrierUpdatePlan(parmList).then(res => {
          if (!res) {
            this.$message.warning('编辑失败，请重试')
          }
          this.$emit('close', 1)
          this.confirmBtnLoading = false
        }).catch(err => {
          this.$message.error(err)
          this.confirmBtnLoading = false
        })
      }
    },
    changeDriver(plan) {
      for (var i = 0; i < this.driverList.length; i++) {
        if (this.driverList[i].id === plan.driverId) {
          plan.driver = this.driverList[i].name
          break
        }
      }
    },
    /**
     * 一级承运商增加waybill数据
     */
    addWaybill(val) {
      val.map(item => {
        if (JSON.stringify(this.tableData).indexOf(JSON.stringify(Object.assign(item, { status: 41 }))) === -1) {
          this.tableData.push(item)
        }
      })
      this.page.total = this.tableData.length
      this.waybillTableVisible = false
      this.carrierWaybillTableVisible = false
    },
    /**
     * 删除内容
     */
    deleteWaybill() {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      const orderNoList = this.multiSelection.map(item => {
        return item.orderNo
      })
      if (parseInt(this.editableTabsValue) === 0) {
        this.allData.map(ALLD => {
          ALLD.tableData.map(TD => {
            this.multiSelection.map(ord => {
              if (TD.orderNo === ord.orderNo) {
                ALLD.tableData.remove(TD)
              }
            })
          })
        })
      } else {
        this.multiSelection.map(itemDelete => {
          this.allData[this.editableTabsValue].tableData.remove(itemDelete)
        })
      }
      // if (this.type === 'add') {
      //   if (parseInt(this.editableTabsValue) === 0) {
      //     this.allData.map(item => {
      //       this.multiSelection.map(itemDelete => {
      //         item.tableData.remove(itemDelete)
      //       })
      //     })
      //   } else {
      //     this.multiSelection.map(itemDelete => {
      //       this.allData[this.editableTabsValue].tableData.remove(itemDelete)
      //     })
      //   }
      // } else {
      //   // this.deleteWaybillDTO = this.multiSelection
      //   this.multiSelection.map(itemDelete => {
      //     // 判断是否是增加，是增加的就无需再发给后端
      //     if (itemDelete.status === 10) {
      //       this.tableData.remove(itemDelete)
      //       return
      //     }
      //     this.deleteWaybillDTO.push(Object.assign(itemDelete, { status: 20 }))
      //     this.tableData.remove(itemDelete)
      //   })
      // }
      // this.multiSelection.map(itemDelete => {
      //   this.tableData.remove(itemDelete)
      // })
      this.multiSelection = []
      this.$refs.table.map(item => {
        item.clearSelection()
      })
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
        }
        let hasTableData = false // 判断是否有订单添加
        this.allData[0].tableData.map(item => {
          if (item.orderNo === res.data[0].orderNo) {
            this.$message.error('该运单已添加')
            hasTableData = true
            this.queryLoading = false
          }
        })
        if (hasTableData) {
          return
        }
        this.allData[0].tableData.push(res.data[0])
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
      })
    },
    /**
     * 选择运单
     */
    chooseWaybill(tableData) {
      // 对此tab中的tableData进行关联
      this.tableData = tableData

      if (this.editableTabsValue === '0') {
        this.waybillTableVisible = true
        this.$nextTick(function() {
          this.$refs.waybill.getTableData(this.$refs.waybill.searchForm)
        })
      } else {
        let carrierWaybillData = this.allData[0].tableData
        this.allData.map((item, index) => {
          if (index !== 0) {
            item.tableData.map(tbItem => {
              carrierWaybillData = carrierWaybillData.filter(da => {
                console.log(da.orderNo !== tbItem.orderNo)
                console.log(da.orderNo)
                console.log(tbItem.orderNo)
                return da.orderNo !== tbItem.orderNo
              })
            })
          }
        })
        this.carrierWaybillTableVisible = true
        this.$nextTick(() => {
          this.$refs.carrierWaybill.tableData = carrierWaybillData
        })
      }
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style scope>
   .el-form>>>.el-form-item__content{
    margin:0
  }
  .plusBtn{
    position: absolute;
    top:88px;
    right: 40px;
  }
  .el-tabs__new-tab{
    margin-right:10px;
  }
</style>
