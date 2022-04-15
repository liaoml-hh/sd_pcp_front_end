<template>
  <div>
    <el-table
      :key="tableKey"
      v-loading="detailQueryLoading"
      :data="orderTableDetail"
      element-loading-text="Loading"
      highlight-current-row
      border
      :height="orderTableDetail.length>=4?212:''"
      :header-cell-style="{color:'#606266', height:'6px', padding:'0px'}"
      style="width:700px;font-size:12px;margin-left:79px"
    >
      <!-- margin:-20px;padding:0;margin-left:-48px -->
      <el-table-column align="center" label="序号" type="index" width="40" />
      <!-- <el-table-column sortable align="center" prop="tableData.orderNo" label="订单号" width="257" /> -->
      <el-table-column align="center" prop="goods" label="货品" show-overflow-tooltip width="260">
        <template slot-scope="{row}">
          <span>
            {{ row.goods?row.goods:'无' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="num" label="数量" width="152">
        <template slot-scope="{row}">
          <span>
            {{ row.num?row.num:0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="cubuge" label="体积" width="120">
        <template slot-scope="{row}">
          <span>
            {{ row.cubuge?row.cubuge: 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column sortable align="center" prop="weight" label="重量" width="110">
        <template slot-scope="{row}">
          <span>
            {{ row.weight?row.weight:0 }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ItemDetail',
  props: ['orderTableDetail', 'detailQueryLoading'],
  data() {
    return {
      tableKey: true
    }
  }
}
</script>

<style scoped>

</style>
