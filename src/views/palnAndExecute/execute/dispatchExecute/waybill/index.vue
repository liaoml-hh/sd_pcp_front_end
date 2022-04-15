<template>
  <div style="padding: 10px">
    <div><!--内容区-->
      <el-table
        ref="table"
        v-loading="queryLoading"
        element-loading-text="Loading"
        :cell-style="rowClass"
        :header-cell-style="headClass"
        :data="tableData"
        :row-class-name="tableRowClassName"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-show="waybillBtnVisible" label="全选" type="selection" reserve-selection width="55" />
        <el-table-column label="序号" type="index" width="55" />
        <el-table-column label="客户" prop="customer" width="100" show-overflow-tooltip />
        <el-table-column label="订单号" prop="orderNo" width="120" show-overflow-tooltip />
        <el-table-column label="下单时间" prop="orderTime" width="100" />
        <el-table-column label="状态" prop="status" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>
              {{
                parseInt(row.status) === 21
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
        <el-table-column label="收货人" prop="receiver" width="120" />
        <el-table-column label="收货人公司" prop="receiverCompany" width="90" show-overflow-tooltip align="center" />
        <el-table-column label="目的地址" prop="goalAddress" width="120" />
        <el-table-column label="始发地" prop="startAddress" width="120" />
        <el-table-column label="仓库" prop="warehouseAddress" width="120" align="center" />
        <el-table-column label="货品" prop="goods" show-overflow-tooltip />
        <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip />
        <el-table-column label="箱数" prop="quantity" show-overflow-tooltip />
        <el-table-column label="体积" prop="cubage" show-overflow-tooltip />
        <el-table-column label="重量" prop="weight" show-overflow-tooltip />
        <el-table-column label="计价方式" prop="dictionaryDTO.value" show-overflow-tooltip />
        <el-table-column label="回单份数" prop="signDocumentNum" show-overflow-tooltip />
        <el-table-column label="机构" prop="organizationDTO.name" show-overflow-tooltip />
        <el-table-column label="公司" prop="companyDTO.name" show-overflow-tooltip />
        <!-- <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip /> -->
        <el-table-column label="更新人" prop="modifier" show-overflow-tooltip />
        <el-table-column label="更新时间" prop="updatedTime" width="100" />
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
      waybillBtnVisible: true,
      queryLoading: false,
      dialogVisible: false,
      itemDialogVisible: false,
      mergeVisible: false,
      approvalVisible: false,
      isApproval: false,
      searchForm: {},
      getRowKeys(row) { // 行id
        return row.id
      },
      row: {},
      approvalForm: { mailNo: '110de403a6c34', time: '2020-10-01', operator: '张三' },
      orderTypeOptions: [{ label: '订单类型1', value: 1 }, { label: '订单类型2', value: 2 }],
      orderChannelOptions: [{ label: '渠道1', value: 1 }, { label: '渠道2', value: 2 }],
      waybillDetailDisabled: true,
      page: { // 分页
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      itemTableData: [{ goods: 'iphon12', num: 3, cubage: 200, weight: 50 }, { goods: 'xiaomi', num: 2, cubage: 200, weight: 50 }, { goods: 'huawei', num: 1, cubage: 200, weight: 50 }]
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
    this.getTableData()
  },
  methods: {
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
    // 表头样式设置
    headClass() {
      return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
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
      if (query.startTime && query.endTime) {
        query.startTime = this.dayTime(query.startTime, 'start')
        query.endTime = this.dayTime(query.endTime, 'end')
      }
      WaybillApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        this.tableData = res.data
      })
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
    background: hsl(34,57%,70%);
  }
  .el-table>>>.wheat{
    background: hsl(39,77%,83%);
  }
  .el-table>>>.blackRed{
    background: rgb(247, 165, 140);
  }
  .el-table>>>.lightRed{
    background: red;
    color: black;
  }
</style>
