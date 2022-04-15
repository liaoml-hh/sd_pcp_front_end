<template>
  <div style="padding: 10px">
    <el-form v-if="isCustomerVisible" v-show="waybillBtnVisible" :inline="true" class="demo-form-inline">
      <el-form-item label="客户:">
        <el-select
          v-model="searchForm.ids"
          filterable
          multiple
          disabled
          style="width:300px"
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
      <el-form-item label="仓库:">
        <el-select
          v-model="searchForm.warehouseName"
          filterable
          style="width:210px"
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
      <!-- <el-form-item label="收货地址">
        <el-input v-model="searchForm.goalAddress" clearable size="mini" />
      </el-form-item> -->
      <!-- <el-form-item label="订单号">
        <el-input v-model="searchForm.orderNo" clearable size="mini" @blur="searchData()" />
      </el-form-item> -->
      <el-form-item label="下单时间:">
        <el-date-picker
          v-model="timeList"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:220px"
          @change="changeTime"
        />
      </el-form-item>
      <el-button type="primary" @click="searchData()">查询</el-button>
    </el-form>
    <el-form v-else v-show="waybillBtnVisible" :inline="true" class="demo-form-inline">
      <el-form-item label="承运商:">
        <el-select
          v-if="isShow"
          v-model="searchForm.carrierId"
          filterable
          clearable
          size="mini"
          style="margin-right:10px"
          @change="getCarrierId"
        >
          <el-option
            v-for="item in carrierList"
            :key="item.id"
            size="mini"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-button type="primary" @click="searchData()">查询</el-button>
    </el-form>
    <div><!--内容区-->
      <el-table
        ref="table"
        v-loading="queryLoading"
        element-loading-text="Loading"
        :data="tableData"
        height="600"
        :row-class-name="tableRowClassName"
        :row-key="getRowKeys"
        @sort-change="changeTableSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-show="waybillBtnVisible" label="全选" type="selection" reserve-selection width="40" align="center" />
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="客户" prop="customer" width="100" show-overflow-tooltip align="center" />
        <el-table-column sortable label="订单号" prop="orderNo" width="130" show-overflow-tooltip align="center" />
        <el-table-column sortable label="下单时间" show-overflow-tooltip prop="createdTime" width="110" align="center" />
        <el-table-column label="收货人" prop="receiver" width="120" align="center" />
        <el-table-column label="收货人公司" show-overflow-tooltip prop="receiverCompany" width="120" align="center" />
        <el-table-column label="仓库" prop="warehouseAddress" width="120" align="center" />
        <el-table-column label="货品" prop="goods" show-overflow-tooltip align="center" />
        <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip align="center" />
        <el-table-column label="箱数" prop="quantity" show-overflow-tooltip align="center" />
        <el-table-column label="体积" prop="cubage" show-overflow-tooltip align="center" />
        <el-table-column label="重量" prop="weight" show-overflow-tooltip align="center" />
        <el-table-column label="计价方式" prop="dictionaryDTO.value" show-overflow-tooltip align="center" />
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
        <el-table-column label="承运商1" prop="carrierDTO1.name" width="70" show-overflow-tooltip />
        <el-table-column label="承运商2" prop="carrierDTO2.name" width="70" show-overflow-tooltip />
        <el-table-column label="状态" prop="status" show-overflow-tooltip align="center">
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
        <el-table-column sortable label="目的地址" show-overflow-tooltip prop="goalAddress" width="120" align="center" />
        <el-table-column label="始发地" show-overflow-tooltip prop="startAddress" width="120" align="center" />
        <el-table-column label="回单份数" prop="signDocumentNum" show-overflow-tooltip align="center" />
        <!-- <el-table-column label="机构" prop="organizationDTO.name" show-overflow-tooltip align="center" />
        <el-table-column label="公司" prop="companyDTO.name" show-overflow-tooltip align="center" />
        <el-table-column label="更新人" prop="modifier" show-overflow-tooltip align="center" />
        <el-table-column label="更新时间" prop="updatedTime" width="100" align="center" /> -->
      </el-table>
    </div>

    <div><!--分页-->
      <el-pagination
        v-show="waybillBtnVisible"
        v-loading="queryLoading"
        :current-page="page.pageNum"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <div style="height100px;width:100px" />
    <el-row>
      <el-button v-show="waybillBtnVisible" type="primary" style="float: right;margin-left:10px" @click="comAdd()">确 定</el-button>
      <el-button style="float: right" @click="waybillCancelHandel()">取 消</el-button>
    </el-row>
  </div>
</template>

<script>
import { WaybillApi } from '@/api/waybill/waybill'
import { BalanceArApi } from '@/api/finance/balanceAccountAr'
import { BalanceDueApi } from '@/api/finance/balanceAccountDue'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import { pageMixin } from '@/views/mixin/page'
export default {
  name: 'Index',
  components: {
  },
  mixins: [pageMixin],
  data() {
    return {
      waybillBtnVisible: true,
      queryLoading: false,
      multiSelection: [],
      tableData: [],
      isShow: true,
      isCustomerVisible: true,
      carrierList: [], // 承运商下拉列表
      carrierRealyList: [], // 用户实际选择的承运商
      customerList: [], // 客户下拉列表
      warehouseList: [], // 仓库下拉列表
      timeList: [this.formatTime(new Date(), true), new Date()], // 初始化查询时间
      searchForm: {
        startTime: this.formatTime(new Date(), true),
        endTime: new Date()
      },
      getRowKeys(row) { // 行id
        return row.id
      },
      page: { // 分页
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      waybillInfoType: 'Ar' // 判断是应收还是应付模块需要获取运单信息
    }
  },
  created() {
    /**
     * 获取客户或仓库数据
     */
    planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      this.customerList = res.customerDTOS
      // this.warehouseList = res.customerWarehouseVOS
    }).catch(err => {
      this.$message.error(err)
    })
    this.getTableData(this.searchForm)
  },
  mounted() {
    // this.getTableData(this.searchForm)
  },
  methods: {
    /**
     * 账单明细中获取运单详情
     */
    getWaybillInfo(row) {
      const ObjApi = {
        BalanceArApi,
        BalanceDueApi
      }
      ObjApi[`Balance${this.waybillInfoType}Api`].getBARInfo(row.id).then(res => {
        this.tableData = res[`balanceAccount${this.waybillInfoType}DetailDTOList`].map(item => {
          return item.waybill
        })
      })
    },
    /**
     * 获取对应客户的仓库
     */
    async getWarehouse(ids) {
      await planAndExecuteApi.queryCustomerAndWarehouse({ ids }).then(res => {
        //   this.customerList = res.customerDTOS
        this.warehouseList = res.customerWarehouseVOS
        if (this.warehouseList.length) {
          this.$set(this.searchForm, 'warehouseName', this.warehouseList[0].name)
        } else {
          this.$set(this.searchForm, 'warehouseName', '')
        }
      })
      this.getTableData(this.searchForm)
    },
    /**
     * 承运商id赋值，从父组件传入
     */
    getCarrierId(carrierId) {
      this.isShow = false
      this.isShow = true
      this.searchForm.carrierId = carrierId
    },
    // 监听表格排序变化
    changeTableSort(column) {
      console.log(column)
      console.log(this.$refs.table.tableData)
      // 获取排序后的数据
      this.tableData = this.$refs.table.tableData
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
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      if (parseInt(row.status) === 91) {
        return 'lightRed'
      } else if (parseInt(row.status) === 111) {
        return 'blackRed'
      }
    },
    // 查询客户
    searchData() {
      this.page.current = 1
      this.getTableData(this.searchForm)
    },
    /**
     * 获取承运商列表
     */
    async getCarrierList() {
      // 获取承运商列表
      await planAndExecuteApi.getCarrierList({ pageSize: 1000 }).then(res => {
        this.carrierList = res.data
      })
      const carrierList = []
      this.carrierRealyList.map(item => {
        this.carrierList.map(itemCL => {
          if (itemCL.id === item) {
            carrierList.push(itemCL)
          }
        })
      })
      this.carrierList = carrierList
      this.searchData()
    },
    /**
     * 取消增加
     */
    waybillCancelHandel() {
      this.$emit('waybillCancelHandel')
    },
    /**
     * 添加所选运单
     */
    comAdd() {
      let isSameCarrier = true
      this.multiSelection.map(item => {
        this.carrierList.map(itemC => {
          if (this.carrierList.length === 1) {
            if (item.carrier1 !== itemC.id) {
              isSameCarrier = false
            }
          } else {
            if (item.carrier1 !== itemC.id && item.carrier2 !== itemC.id) {
              isSameCarrier = false
            }
          }
        })
      })
      if (!isSameCarrier) {
        this.$message.warning('所选运单一二级承运商与主表所选承运商存在不同，请检查！')
        return
      }
      this.$emit('addWaybill', this.multiSelection)
      this.multiSelection = []
      this.$refs.table.clearSelection()
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
      query.incomeAuditStatus = 1
      query[`balance${this.waybillInfoType}Status`] = 0
      WaybillApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        // this.tableData = res.body.data
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
    handleSearch() {
      this.page.current = 1
      this.getTableData(this.searchForm)
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style scoped>
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
  .el-table>>>.pink{
    background: hsl(80,61%,50%);
  }
  .el-table>>>.burlywood{
    background: rgb(221, 222, 135);
  }
  .el-table>>>.wheat{
    background: hsl(39,77%,83%);
  }
  .el-table>>>.aqua{
    background: hsl(180,100%,50%);
  }
  .el-table>>>.blackRed{
    background: rgb(247, 118, 95);
  }
  .el-table>>>.lightRed{
    background: red;
    color: black;
  }
</style>
