<template>
  <div>
    <el-row :gutter="10">
      <div style="display: flex">
        <div style="padding-left: 5px;width: 100%">
          <div style="float: left">
            <el-button type="primary" @click.native="chooseWaybill()">增加</el-button>
            <el-button type="danger" @click.native="deleteWaybill()">删除</el-button>
          </div>
          <div style="float: right">
            <el-col :span="24">
              <el-date-picker
                v-model="arriveTime"
                type="datetime"
                size="mini"
                style="margin-left:5px;width:34%"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择到达日期时间"
                @change="changeArriveTime"
              />
              <el-date-picker
                v-model="signTime"
                type="datetime"
                size="mini"
                style="margin-left:5px;width:34%"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择签收日期时间"
                @change="changeArriveTime"
              />
              <el-button style="margin-left:5px" type="danger" size="mini" @click.native="batchEditChange()">批量修改</el-button>
            </el-col>
          </div>
          <el-table
            ref="table"
            v-loading="queryLoading"
            :cell-style="rowClass"
            :header-cell-style="headClass"
            element-loading-text="Loading"
            :data="tableData"
            :row-key="getRowKeys"
            @cell-dblclick="editCurrRow"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" reserve-selection width="42" />
            <el-table-column label="序号" type="index" width="46" align="center" />
            <el-table-column label="源头单号" sortable prop="sourceOrderNo" width="120" show-overflow-tooltip align="center">
              <template slot-scope="{ row }">
                <span :data-clipboard-text="row.sourceOrderNo" class="tag-read" @click="copyText"> {{ row.sourceOrderNo == null ? '空' : row.sourceOrderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单号" sortable prop="orderNo" width="90" show-overflow-tooltip align="center">
              <template slot-scope="{ row }">
                <span :data-clipboard-text="row.orderNo" class="tag-read" @click="copyText"> {{ row.orderNo == null ? '空' : row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="运单号" prop="mailNo" width="120" align="center" />
            <el-table-column label="客户" prop="customer" width="100" show-overflow-tooltip align="center" />
            <el-table-column label="货品" prop="goods" width="68" show-overflow-tooltip align="center" />
            <el-table-column label="货品类型" prop="goodsTypeShortName" width="68" show-overflow-tooltip align="center" />
            <el-table-column label="运单类型" prop="waybillTypeDICDTO.value" width="70" align="center" />
            <el-table-column label="状态" prop="status" width="60" align="center">
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
            <el-table-column label="总费用" prop="free.Charge" width="60" show-overflow-tooltip align="center" />
            <el-table-column label="总成本" prop="free.SendCost" width="60" show-overflow-tooltip align="center" />
            <!-- ======================================================================== -->
            <el-table-column label="仓库" prop="customerWarehouseDTO.name" width="80" show-overflow-tooltip align="center" />
            <el-table-column label="提货方式" prop="deliveryWayDTO.name" width="70" show-overflow-tooltip align="center" />
            <el-table-column label="司机" prop="dispatchPlanDTO.driver" width="60" show-overflow-tooltip align="center" />
            <el-table-column label="订单类型" prop="orderTypeDICDTO.value" show-overflow-tooltip align="center" />
            <el-table-column label="下单渠道" prop="channelDICDTO.value" show-overflow-tooltip align="center" />
            <el-table-column label="物控" prop="controll" show-overflow-tooltip align="center">
              <template slot-scope="{ row }">
                <span> {{
                  parseInt(row.controll) == 0
                    ? '否'
                    : parseInt(row.controll) == 1
                      ? '是' : row.controll
                }} </span>
              </template>
            </el-table-column>
            <!-- ======================================================================== -->
            <el-table-column label="下单时间" prop="placeBillwayTime" width="100" align="center" />
            <el-table-column label="收货人" prop="receiver" width="95" show-overflow-tooltip align="center" />
            <el-table-column label="收货人公司" prop="receiverCompany" width="95" show-overflow-tooltip align="center" />
            <el-table-column label="目的地省份" prop="goalProvince" width="115" show-overflow-tooltip align="center" />
            <el-table-column label="目的地城市" show-overflow-tooltip prop="goalCity" width="115" align="center" />
            <el-table-column label="目的县区" show-overflow-tooltip prop="goalCounty" width="115" align="center" />
            <el-table-column label="目的地地址" show-overflow-tooltip prop="goalAddress" width="150" align="center" />
            <el-table-column label="箱数" prop="quantity" show-overflow-tooltip align="center" />
            <el-table-column label="体积(m³)" prop="cubage" show-overflow-tooltip align="center" />
            <el-table-column label="重量(kg)" prop="weight" show-overflow-tooltip align="center" />
            <el-table-column label="计价方式" prop="dictionaryDTO.value" show-overflow-tooltip align="center" />
            <el-table-column label="回单份数" prop="signDocumentNum" show-overflow-tooltip align="center" />
            <!-- <el-table-column label="机构" prop="organizationDTO.name" show-overflow-tooltip align="center" />
            <el-table-column label="公司" prop="companyDTO.name" show-overflow-tooltip align="center" />
            <el-table-column label="更新人" prop="modifier" show-overflow-tooltip align="center" />
            <el-table-column label="更新时间" prop="updatedTime" width="100" align="center" />
            <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip align="center" /> -->
            <el-table-column label="到达时间" prop="arriveTime" width="250" style="padding:0" fixed="right" align="center">
              <template slot-scope="scope">
                <span v-show="!showTimeVisiable">{{
                  formatTime(scope.row.arriveTime,true)
                }}</span>
                <el-date-picker
                  v-show="showTimeVisiable"
                  v-model="scope.row.arriveTime"
                  type="datetime"
                  size="mini"
                  style="width:72%"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择到达日期时间"
                  @change="changeArriveTime"
                />
              </template>
            </el-table-column>
            <el-table-column label="签收时间" prop="signTime" width="250" style="padding:0" fixed="right" align="center">
              <template slot-scope="scope">
                <span v-show="!showTimeVisiable">{{
                  formatTime(scope.row.signTime,true)
                }}</span>
                <el-date-picker
                  v-show="showTimeVisiable"
                  v-model="scope.row.signTime"
                  type="datetime"
                  size="mini"
                  style="width:72%"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择签收日期时间"
                  @change="changeSignTime"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-row>
    <el-row style="margin-left:80%;margin-top:1%">
      <el-button @click="parentCancelHandel()">取 消</el-button>
      <el-button type="primary" :loading="confirmBtnLoading" @click="confirm">确 定</el-button>
    </el-row>
    <el-dialog v-dialogDrag top="5vh" :visible.sync="waybillTableVisible" width="90%" append-to-body>
      <sign-waybill ref="signWaybill" @addWaybill="addWaybill" @comCancelHandel="comCancelHandel" />
    </el-dialog>
  </div>
</template>

<script>
import signWaybill from '@/views/waybill/sign-waybill'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import { WaybillApi } from '@/api/waybill/waybill'
import Clipboard from 'clipboard'
// import { version } from 'element-ui'
import { getName, getTel } from '@/utils/auth'
export default {
  name: 'SignDetail',
  components: { signWaybill },
  props: ['tableData'],
  data() {
    return {
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      getRowKeys(row) { // 行id
        return row.id
      },
      showTimeVisiable: false, // 控制显隐
      editIndex: -1, // 当前编辑行index
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
      // tableData: [],
      multiSelection: [],
      dialogVisible: false,
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
      arriveTime: '',
      signTime: '',
      waybillTableVisible: false,
      confirmBtnLoading: false, // 确认按钮加载
      deleteWaybillDTO: [], // 存放编辑时删除的数据
      pickupPlanDetailDTOList: {}, // 存放pickupPlanDetail数据
      arriveAndSignTime: {
        arriveTime: '',
        signTime: ''
      }
    }
  },
  // mounted() {

  // },
  mounted() {
    this.initData(this.tableData)
  },
  methods: {
    initData(list) {
      this.tableData = []
      const result = JSON.parse(JSON.stringify(list))
      result.forEach(item => {
        console.log(item)
        const cellObj = {}
        for (var key in item) {
          cellObj[key] = item[key]
        }
        this.tableData.push(cellObj)
      })
    },
    /**
     * 批量修改签收和到达日期时间
     */
    batchEditChange() {
      this.tableData.map(item => {
        if (this.arriveTime) {
          item.arriveTime = this.arriveTime
        }
        if (this.signTime) {
          item.signTime = this.signTime
        }
      })
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
    /**
     * 监听到达时间变化
     */
    changeArriveTime(arriveTime) {
      if (new Date(arriveTime) > new Date(this.arriveAndSignTime.signTime)) {
        this.$message.warning('到达时间不能晚于签收时间')
      }
    },
    /**
     * 监听到达时间变化
     */
    changeSignTime(signTime) {
      if (new Date(signTime) < new Date(this.arriveAndSignTime.arriveTime)) {
        this.$message.warning('签收时间不能早于到达时间')
      }
    },
    editCurrRow(row) {
      this.arriveAndSignTime = {
        arriveTime: row.arriveTime,
        signTime: row.signTime
      }
      this.showTimeVisiable = !this.showTimeVisiable
    },
    /**
     * 时间格式化
     * @param time 传入所需格式化时间
     */
    formatTime(time, isMM = false) {
      if (!time) {
        return
      }
      time = new Date(time)
      let timeMM = time.getFullYear() + '-' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
            (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ' +
            (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())
      if (!isMM) {
        timeMM = timeMM + ':' + (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      }

      return timeMM
    },
    parentCancelHandel() {
      this.tableData = []
      this.$emit('parentCancelHandel')
    },
    confirm() {
      this.confirmBtnLoading = true
      let hasTime = false // 判断到达以及签收时间是否存在
      let hasExceptTime = false // 判断到达以及签收时间范围是否不符合规范
      const exceptTimeList = []
      const allWaybillDTOList = []
      this.tableData.map(item => {
        // 判断到达或者签收时间是否为空
        if (!item.arriveTime || !item.signTime) {
          hasTime = true
        }
        if (new Date(item.signTime) < new Date(item.arriveTime)) {
          hasExceptTime = true
          exceptTimeList.push(item.mailNo)
        }
        // 当到达以及签收时间存在，且到达以及签收时间范围符合正常规则即执行
        if (!hasTime && !hasExceptTime) {
          // 格式化时间
          item.arriveTime = this.formatTime(item.arriveTime, true)
          item.signTime = this.formatTime(item.signTime, true)
          // 封装成所需要传给后端的格式
          allWaybillDTOList.push({
            waybillDTO: item,
            arriveTime: item.arriveTime,
            signTime: item.signTime,
            modifier: getName()
          })
        }
      })
      if (hasTime) {
        this.$message.warning('请选择到达时间以及签收时间')
        return
      }
      if (hasExceptTime) {
        this.$message.warning(`运单号为${exceptTimeList.join(',')}的到达时间不能晚于签收时间`)
        return
      }

      WaybillApi.dispatchSign(allWaybillDTOList).then(res => {
        if (res) {
          this.$message.success('签收成功')
          this.confirmBtnLoading = false
          this.$emit('close', 1)
        } else {
          this.$message.success('网络错误')
          this.confirmBtnLoading = false
          this.$emit('close', 1)
        }
      }).catch(err => {
        this.$message.success(err)
      })
    },
    addWaybill(val) {
      // eslint-disable-next-line no-extend-native
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val)
        if (index > -1) {
          this.splice(index, 1)
        }
      }
      val.map(item => {
        this.tableData.map(itemTable => {
          if (itemTable.mailNo === item.mailNo) {
            val.remove(item)
          }
        })
      })
      val.map(item => {
        this.tableData.push(item)
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
        this.$refs.signWaybill.getTableData(this.$refs.signWaybill.searchForm)
      })
      this.waybillTableVisible = true
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style scoped>
  .editCell:hover{
    cursor:pointer;
  }
</style>
