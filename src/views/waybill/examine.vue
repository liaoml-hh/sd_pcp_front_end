<template>
  <div style="padding: 10px">
    <el-table :data="tableData">
      <el-table-column
        label="序号"
        type="index"
        width="55"
      />
      <el-table-column label="运单号" prop="mailNo" />
      <el-table-column label="订单号" prop="orderNo" />
      <el-table-column label="发货时间" prop="sendGoodsTime" />
      <el-table-column label="下单时间" prop="orderTime" />
      <el-table-column label="二级承运商" />
      <el-table-column label="业务员" prop="operator" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="操作">
        <template slot-scope="s">
          <el-button type="text" @click="handleEdit(s.row,true)">审核</el-button>
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
  </div>
</template>

<script>
import detail from '@/views/waybill/detail'
export default {
  name: 'Examine',
  components: {
    detail
  },
  data() {
    return {
      tableData: [
        { mailNo: '910de403a6c348a8ac2e304cc675d5dd', orderNo: '833c91bef442457090b2acf0cc4cafdd', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' },
        { mailNo: '910de403a6c348a8ac2e304cc675d5dd', orderNo: '833c91bef442457090b2acf0cc4cafdd', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' },
        { mailNo: '910de403a6c348a8ac2e304cc675d5dd', orderNo: '833c91bef442457090b2acf0cc4cafdd', sendGoodsTime: '2020-10-01', orderTime: '2020-10-01', status: '待审核', operator: '张三' }
      ],
      dialogVisible: false,
      isApproval: false
    }
  },
  methods: {

    handleEdit(row, flag) {
      if (flag) this.isApproval = true
      else this.isApproval = false
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
