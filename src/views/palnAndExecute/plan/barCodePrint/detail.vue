<template>
  <!-- <div style="padding: 10px">
    <div>内容区 -->
  <!-- <el-table
    ref="table"
    v-loading="detailQueryLoading"
    element-loading-text="Loading"
    :cell-style="rowClass"
    :header-cell-style="headClass"
    height="500"
    :row-class-name="tableRowClassName"
    :data="orderTableDetail"
  > -->
  <el-table
    ref="table"
    v-loading="detailQueryLoading"
    element-loading-text="Loading"
    class="tableDetail"
    fit
    highlight-current-row
    border
    :height="orderTableDetail.length>=4?300:''"
    :row-style="{height:0+'px'}"
    :cell-style="{padding:5+'px','text-align': 'center'}"
    :header-cell-style="{color:'#606266', height:'6px', padding:'0px'}"
    :row-class-name="tableRowClassName"
    :data="orderTableDetail"
  >
    <el-table-column align="center" label="序号" type="index" width="50" />
    <!-- <el-table-column sortable align="center" prop="orderTableDetail.orderNo" label="订单号" width="257" /> -->
    <el-table-column align="center" prop="goods" label="货品" width="330">
      <template slot-scope="{row}">
        <span>
          {{ row.goods?row.goods:'无' }}
        </span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="num" label="数量" width="130">
      <template slot-scope="{row}">
        <span>
          {{ row.num?row.num:0 }}
        </span>
      </template>
    </el-table-column>
    <el-table-column sortable align="center" prop="cubuge" label="体积" width="80">
      <template slot-scope="{row}">
        <span>
          {{ row.cubuge?row.cubuge: 0 }}
        </span>
      </template>
    </el-table-column>
    <el-table-column sortable align="center" prop="weight" label="重量" width="80">
      <template slot-scope="{row}">
        <span>
          {{ row.weight?row.weight:0 }}
        </span>
      </template>
    </el-table-column>
  </el-table>
  <!-- </div> -->
  <!--分页-->
  <!-- <div>
      <el-pagination
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div> -->
  <!-- </div> -->
</template>

<script>
// import { WaybillApi } from '@/api/waybill/waybill'
// import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import { pageMixin } from '@/views/mixin/page'
export default {
  name: 'Index',
  components: {
  },
  mixins: [pageMixin],
  data() {
    return {
      multiSelection: [],
      orderTableDetail: [],
      customerList: [], // 客户下拉列表
      warehouseList: [], // 仓库下拉列表
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()], // 初始化查询时间
      waybillBtnVisible: true,
      detailQueryLoading: false,
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
    }
  },
  created() {
    // planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
    //   this.customerList = res.customerDTOS
    //   this.warehouseList = res.customerWarehouseVOS
    // }).catch(err => {
    //   this.$message.error(err)
    // })
    // this.getTableData(this.searchForm)
  },
  mounted() {
    // this.getTableData(this.searchForm)
  },
  methods: {
    // 监听分页页数变化
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData()
    },
    // 分页监听页码变化
    currentChange(val) {
      this.page.current = val
      this.getTableData()
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
    headClass() {
      return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
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
  .el-table>>>.aqua{
    background: hsl(180,100%,50%);
  }
  .el-table>>>.blackRed{
    background: rgb(238, 131, 123);
  }
  .el-table>>>.lightRed{
    background: red;
    color: black;
  }

  /* .el-table>>>td, .el-table>>>th{
    padding: 0;
  } */
  .el-table{
    /* max-width: 150vw; */
    width: 672px;
    margin: 0;
    /* margin-top: 20px; */
    font-size: 13px;
    /* transform:scale(0.9);
    -ms-transform:scale(0.9);
    -webkit-transform:scale(0.9)!important; */
    /* margin-left: -5vw;
    margin-top: -0vw; */
  }
</style>
<style>
.el-table__expanded-cell[class*=cell] {
    padding: 0px;
}
</style>
