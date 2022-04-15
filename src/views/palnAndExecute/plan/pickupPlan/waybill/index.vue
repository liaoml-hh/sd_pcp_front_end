<template>
  <div style="padding: 10px">
    <el-form v-show="waybillBtnVisible" :inline="true" class="demo-form-inline">
      <el-form-item label="客户:">
        <el-select
          v-model="searchForm.ids"
          multiple
          filterable
          style="width:300px"
          clearable
          size="mini"
          @change="getWarehouse"
        >
          <!-- assistantCode -->
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
          style="width:300px"
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
      <el-form-item label="下单时间:">
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
      <el-button type="primary" @click="searchData()">查询</el-button>
    </el-form>

    <div><!--内容区-->
      <el-table
        ref="table"
        v-loading="queryLoading"
        element-loading-text="Loading"
        :cell-style="rowClass"
        :header-cell-style="headClass"
        height="500"
        :row-class-name="tableRowClassName"
        :data="tableData"
        :row-key="getRowKeys"
        style="width:100%"
        @sort-change="changeTableSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-show="waybillBtnVisible" label="全选" type="selection" reserve-selection width="45" />
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="客户" prop="customer" width="90" show-overflow-tooltip />
        <el-table-column sortable label="订单号" prop="orderNo" width="140" align="center" />
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
        <el-table-column label="收货人" prop="receiver" width="100" show-overflow-tooltip />
        <el-table-column label="收货人公司" prop="receiverCompany" width="90" show-overflow-tooltip align="center" />
        <!-- <el-table-column label="收货人地址" prop="receiverAddress" width="120" show-overflow-tooltip /> -->
        <!-- <el-table-column label="联系方式" prop="orderNo" width="120" show-overflow-tooltip /> -->
        <el-table-column sortable label="下单时间" prop="placeBillwayTime" width="100" />
        <el-table-column label="起始城市" show-overflow-tooltip prop="startCity" width="120" />
        <el-table-column sortable label="目的城市" show-overflow-tooltip prop="goalCity" width="120" />
        <el-table-column label="目的县区" show-overflow-tooltip prop="goalCounty" width="120" align="center" />
        <!-- <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip /> -->
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
        <!-- <el-table-column label="机构" prop="organization.name" show-overflow-tooltip />
        <el-table-column label="公司" prop="company.name" show-overflow-tooltip /> -->
        <!-- <el-table-column label="更新人" prop="modifier" show-overflow-tooltip />
        <el-table-column label="更新时间" prop="updatedTime" width="100" /> -->
      </el-table>
      <el-button v-show="waybillBtnVisible" type="primary" style="float: right;margin:20px 30px 0 0" @click="comAdd()">确 定</el-button>
      <el-button v-show="waybillBtnVisible" type="primary" style="float: right;margin:20px 30px 0 0" @click="cancelHandel()">取消</el-button>

    </div>
    <div><!--分页-->
      <el-pagination
        v-show="waybillBtnVisible"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import { WaybillApi } from '@/api/waybill/waybill'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import { pageMixin } from '@/views/mixin/page'
export default {
  name: 'Index',
  components: {
  },
  mixins: [pageMixin],
  data() {
    return {
      multiSelection: [],
      tableData: [],
      getRowKeys(row) { // 行id
        return row.id
      },
      customerList: [], // 客户下拉列表
      warehouseList: [], // 仓库下拉列表
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()], // 初始化查询时间
      waybillBtnVisible: true,
      queryLoading: false,
      dialogVisible: false,
      itemDialogVisible: false,
      mergeVisible: false,
      approvalVisible: false,
      isApproval: false,
      searchForm: {
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date()
      },
      page: { // 分页
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      tabName: 'noPass',
      row: {}
      // approvalForm: { mailNo: '110de403a6c34', time: '2020-10-01', operator: '张三' },
      // orderTypeOptions: [{ label: '订单类型1', value: 1 }, { label: '订单类型2', value: 2 }],
      // orderChannelOptions: [{ label: '渠道1', value: 1 }, { label: '渠道2', value: 2 }],
      // waybillDetailDisabled: true,
      // itemTableData: [{ goods: 'iphon12', num: 3, cubage: 200, weight: 50 }, { goods: 'xiaomi', num: 2, cubage: 200, weight: 50 }, { goods: 'huawei', num: 1, cubage: 200, weight: 50 }]
    }
  },
  created() {
    planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      this.customerList = res.customerDTOS
      this.warehouseList = res.customerWarehouseVOS
    }).catch(err => {
      this.$message.error(err)
    })
    this.getTableData(this.searchForm)
  },
  mounted() {
    this.getTableData(this.searchForm)
  },
  methods: {
    /**
     * 获取对应客户的仓库
     */
    getWarehouse(ids) {
      planAndExecuteApi.queryCustomerAndWarehouse({ ids }).then(res => {
        //   this.customerList = res.customerDTOS
        this.warehouseList = res.customerWarehouseVOS
        if (this.warehouseList.length) {
          this.$set(this.searchForm, 'warehouseName', this.warehouseList[0].name)
        } else {
          this.$set(this.searchForm, 'warehouseName', '')
        }
      })
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
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      // if (parseInt(row.status) === 1) {
      //   return 'green'
      // } else if (parseInt(row.status) === 21) {
      //   return 'red'
      // } else if (parseInt(row.status) === 31) {
      //   return 'yellow'
      // } else if (parseInt(row.status) === 41) {
      //   return 'yellowgreen'
      // } else if (parseInt(row.status) === 51) {
      //   return 'burlywood'
      // } else if (parseInt(row.status) === 61) {
      //   return 'wheat'
      // } else if (parseInt(row.status) === 71) {
      //   return 'aqua'
      // } else if (parseInt(row.status) === 81) {
      //   return 'blue'
      // } else
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
    // 表头样式设置
    headClass() {
      return 'text-align: center;color:rgb(140,138,140)'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    comAdd() {
      this.$emit('addWaybill', this.multiSelection)
      this.multiSelection = []
      this.$refs.table.clearSelection()
    },
    cancelHandel() {
      console.log(this.$parent)
      this.$emit('comCancelHandel')
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
      // query.passFlag = 1
      query.masterFlag = 1
      query.status = 1
      if (query.startTime && query.endTime) {
        query.startTime = this.dayTime(query.startTime, 'start')
        query.endTime = this.dayTime(query.endTime, 'end')
      } else {
        query.startTime = ''
        query.endTime = ''
      }
      WaybillApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        res.data.map(item => {
          if (item.placeBillwayTime) {
            item.placeBillwayTime = this.formatTime(item.placeBillwayTime)
          }
          if (item.updatedTime) {
            item.updatedTime = this.formatTime(item.updatedTime)
          }
        })
        this.tableData = res.data
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
  .el-table>>>.pink{
    background: hsl(332, 95%, 84%);
  }
  .el-table>>>.blue{
    background: hsl(184, 71%, 77%);
  }
  .el-table>>>.redBlod{
    background: hsl(0, 100%, 50%);
    color:black
  }
  .el-table>>>.yellow{
    background: hsl(56, 100%, 84%);
  }
  .el-table>>>.blackRed{
    background: hsl(14, 94%, 79%);
  }
  .el-table{
    width: 98%;
  }
</style>
