<template>
  <!-- <div style="padding: 10px"> -->
  <!--<div>内容区-->
  <!-- <el-table
        ref="table"
        v-loading="queryLoading"
        element-loading-text="Loading"
        :cell-style="rowClass"
        :header-cell-style="headClass"
        height="500"
        :row-class-name="tableRowClassName"
        :data="tableData"
      > -->
  <el-table
    ref="table"
    v-loading="queryLoading"
    element-loading-text="Loading"
    fit
    highlight-current-row
    border
    :height="tableData.length>=4?192:''"
    :cell-style="rowClass"
    style="margin:0 0 0 39px;width:99%"
    :row-class-name="tableRowClassName"
    :header-cell-style="{color:'#606266', height:'2px', padding:'0px'}"
    :data="tableData"
  >
    <!-- <el-table-column v-show="waybillBtnVisible" label="全选" type="selection" reserve-selection width="45" align="center" /> -->
    <el-table-column label="序号" type="index" width="50" align="center" />
    <el-table-column label="源头单号" sortable prop="sourceOrderNo" width="110" show-overflow-tooltip align="center" />
    <el-table-column label="订单号" sortable prop="orderNo" width="100" show-overflow-tooltip align="center" />
    <el-table-column label="客户" prop="customer" width="126" show-overflow-tooltip align="center" />
    <el-table-column label="仓库地址" show-overflow-tooltip prop="warehouseAddress" width="110" align="center" />
    <el-table-column label="状态" prop="status" width="90" align="center">
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
    <el-table-column label="收货人" prop="receiver" width="80" show-overflow-tooltip align="center" />
    <el-table-column label="收货人公司" prop="receiverCompany" width="90" show-overflow-tooltip align="center" />
    <!-- <el-table-column label="收货人地址" prop="receiverAddress" width="120" show-overflow-tooltip /> -->
    <!-- <el-table-column label="联系方式" prop="orderNo" width="120" show-overflow-tooltip /> -->
    <el-table-column label="下单时间" prop="placeBillwayTime" show-overflow-tooltip width="100" align="center" />
    <!-- <el-table-column label="起始城市" show-overflow-tooltip prop="startCity" width="120" align="center" /> -->
    <el-table-column label="目的城市" show-overflow-tooltip prop="goalCity" width="80" align="center" />
    <el-table-column label="目的县区" show-overflow-tooltip prop="goalCounty" width="82" align="center" />
    <el-table-column label="目的地址" show-overflow-tooltip prop="goalAddress" width="92" align="center" />
    <!-- <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip /> -->
    <el-table-column label="货品" show-overflow-tooltip prop="goods" width="90" align="center" />
    <el-table-column label="货品类型" show-overflow-tooltip prop="goodsTypeShortName" width="70" align="center" />
    <el-table-column label="箱数" prop="quantity" width="70" align="center" />
    <el-table-column label="体积" prop="cubage" width="70" align="center" />
    <el-table-column label="重量" prop="weight" width="70" align="center" />
    <el-table-column label="计价方式" prop="dictionarycostway.value" width="100" align="center" />
    <el-table-column label="回单份数" show-overflow-tooltip prop="signDocumentNum" align="center" />
    <!-- <el-table-column label="机构" prop="organizationDTO.name" show-overflow-tooltip align="center" />
    <el-table-column label="公司" prop="companyDTO.name" show-overflow-tooltip align="center" />
    <el-table-column label="更新人" prop="modifier" show-overflow-tooltip />
    <el-table-column label="更新时间" prop="updatedTime" width="100" /> -->
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
      tableData: [],
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
      detailTableHeight: 64,
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
  },
  mounted() {
    this.queryLoading = true
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    // 监听分页页数变化
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm)
    },
    // 分页监听页码变化
    currentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm)
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
    // headClass() {
    //   return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
    // },
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
  /* .el-table__expanded-cell {
    padding: 0;
  } */
  /* .el-table>>>.cell{
    padding:1% 0!important;
  } */
  /* .el-table>>>td, .el-table>>>th {
    padding: 6px 0;
  } */
  .el-table{
    width: 100%;
    margin: 0;
    font-size: 12px;
  }
</style>
<style>
.el-table__expanded-cell[class*=cell] {
    padding: 0;
}
</style>
