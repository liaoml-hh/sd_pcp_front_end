<template>
  <div style="padding: 10px">
    <div><!--内容区-->
      <el-table
        ref="table"
        v-loading="queryLoading"
        element-loading-text="Loading"
        :data="tableData"
        height="600"
        :row-key="getRowKeys"
        @sort-change="changeTableSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-show="waybillBtnVisible" label="全选" type="selection" reserve-selection width="40" align="center" />
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="客户" prop="customer" width="100" show-overflow-tooltip align="center" />
        <el-table-column sortable label="订单号" prop="orderNo" width="130" show-overflow-tooltip align="center" />
        <el-table-column sortable label="下单时间" prop="createdTime" width="100" align="center" />
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
        <el-table-column label="收货人" prop="receiver" width="120" align="center" />
        <el-table-column label="收货人公司" prop="receiverCompany" width="90" show-overflow-tooltip align="center" />
        <el-table-column sortable label="目的地址" prop="goalAddress" show-overflow-tooltip align="center" />
        <el-table-column label="始发地" prop="startAddress" show-overflow-tooltip align="center" />
        <el-table-column label="仓库" prop="warehouseAddress" width="120" align="center" />
        <el-table-column label="货品" prop="goods" show-overflow-tooltip align="center" />
        <el-table-column label="货品类型" prop="goodsTypeShortName" show-overflow-tooltip align="center" />
        <el-table-column label="箱数" prop="quantity" show-overflow-tooltip align="center" />
        <el-table-column label="体积" prop="cubage" show-overflow-tooltip align="center" />
        <el-table-column label="重量" prop="weight" show-overflow-tooltip align="center" />
        <el-table-column label="计价方式" prop="dictionaryDTO.value" show-overflow-tooltip align="center" />
        <el-table-column label="回单份数" prop="signDocumentNum" show-overflow-tooltip align="center" />
      </el-table>
    </div>
    <div style="height100px;width:100px" />
    <el-row v-show="waybillBtnVisible">
      <el-button type="primary" style="float: right;margin-left:10px" @click="comAdd()">确 定</el-button>
      <el-button style="float: right" @click="waybillCancelHandel()">取 消</el-button>
    </el-row>
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
  data() {
    return {
      waybillBtnVisible: true,
      queryLoading: false,
      multiSelection: [],
      tableData: [],
      getRowKeys(row) { // 行id
        return row.id
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 监听表格排序变化
    changeTableSort(column) {
      console.log(column)
      console.log(this.$refs.table.tableData)
      // 获取排序后的数据
      this.tableData = this.$refs.table.tableData
    },
    waybillCancelHandel() {
      this.$emit('waybillCancelHandel')
    },
    comAdd() {
      this.$emit('addWaybill', this.multiSelection)
      this.multiSelection = []
      this.$refs.table.clearSelection()
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
