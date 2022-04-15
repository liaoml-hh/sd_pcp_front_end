<template>
  <div style="padding: 10px">
    <div>
      <el-button type="primary" @click="handleMerge">合 单</el-button>
    </div>
    <el-table :data="tableData" :row-key="getRowKeys" @selection-change="handleSelectionChange">
      <el-table-column type="selection" reserve-selection width="55" />
      <el-table-column label="运单号" prop="mailNo" />
      <el-table-column label="订单号" prop="orderNo" />
      <el-table-column label="发货时间" prop="sendGoodsTime" />
      <el-table-column label="下单时间" prop="orderTime" />
      <el-table-column label="二级承运商" />
      <el-table-column label="业务员" prop="operator" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="操作">
        <template slot-scope="s">
          <el-button type="text" @click="handleEdit(s.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="1"
      :page-sizes="[1, 10, 20, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="5"
    />

    <el-dialog
      v-dialogDrag
      top="5vh"
      title="运单详情"
      :visible.sync="dialogVisible"
      width="90%"
      center
    >
      <detail />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
        <el-button v-if="!isApproval" type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button v-if="isApproval" type="primary" @click="dialogVisible = false">审核拒绝</el-button>
        <el-button v-if="isApproval" type="primary" @click="dialogVisible = false">审核通过</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      top="5vh"
      title="运单合并"
      :visible.sync="mergeVisible"
      width="90%"
      center
    >
      <merge-detail :table-data="multiSelection" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="mergeVisible = false">返 回</el-button>
        <el-button type="primary" @click="mergeVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import detail from '@/views/waybill/detail'
import mergeDetail from '@/views/waybill/mergeDetail'
export default {
  name: 'Merge',
  components: {
    detail,
    mergeDetail
  },
  data() {
    return {
      tableData: [
        { mailNo: '120de403a6c3412', orderNo: '113c91bef442411', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' },
        { mailNo: '340de403a6c3434', orderNo: '223c91bef442422', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' },
        { mailNo: '550de403a6c3455', orderNo: '333c91bef442433', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' },
        { mailNo: '660de403a6c3466', orderNo: '443c91bef442444', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' },
        { mailNo: '770de403a6c3477', orderNo: '553c91bef442455', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' }
      ],
      getRowKeys(row) { // 行id
        return row.id
      },
      dialogVisible: false,
      mergeVisible: false,
      isApproval: false,
      multiSelection: []
    }
  },
  methods: {
    handleEdit(row, flag) {
      if (flag) this.isApproval = true
      else this.isApproval = false
      this.dialogVisible = true
    },
    handleMerge() {
      if (!this.multiSelection || this.multiSelection.length < 2) {
        this.$message.info('勾选的运单数不得少于两条')
        return
      }
      this.mergeVisible = true
    },
    handleSelectionChange(val) {
      this.multiSelection = val
      console.log(this.multiSelection)
    }
  }
}
</script>

<style scoped>

</style>
