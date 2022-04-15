<template>
  <div>
    <!--查询框 -->
    <div style="margin-left:10px">
      <el-form :inline="true" size="mini" :model="searchForm" class="demo-form-inline">
        <el-form-item label="收款人">
          <el-input v-model="searchForm.payee" clearable />
        </el-form-item>
        <el-form-item label="收款时间">
          <el-date-picker
            v-model="timeList"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item label="付款人">
          <el-input v-model="searchForm.payer" clearable />
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="searchForm.waybillNo" clearable size="mini" />
        </el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-left:10px"
      border
      fit
      height="600"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="120">
        <template slot-scope="scope">{{ page.size * (page.current - 1) + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="waybillNo" label="运单号" show-overflow-tooltip />
      <el-table-column prop="payee" label="收款人" show-overflow-tooltip />
      <el-table-column prop="collectionTime" label="收款时间" show-overflow-tooltip />
      <el-table-column prop="collectionAccount" label="收款账户" show-overflow-tooltip />
      <el-table-column prop="payer" label="付款人" show-overflow-tooltip />
      <el-table-column prop="payAccount" label="付款账户" show-overflow-tooltip />
      <el-table-column prop="payWay" label="支付方式" show-overflow-tooltip />
      <el-table-column prop="cash" label="现金" show-overflow-tooltip />
      <el-table-column prop="etransfer" label="电子转账" show-overflow-tooltip />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showDetail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="float:left;margin-left:10px">
      <el-pagination
        :current-page="page.current"
        :page-sizes="page.sizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-dialogDrag top="5vh" :visible.sync="dialogVisible" width="70%" append-to-body title="代收款记录" align="center">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-row>
          <el-form-item label="运单号:">
            <el-input v-model="form.waybillNo" readonly size="mini" />
          </el-form-item>
          <el-form-item label="付款人:">
            <el-input v-model="form.payer" readonly size="mini" />
          </el-form-item>
          <el-form-item label="付款账户:">
            <el-input v-model="form.payAccount" readonly size="mini" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="收款人:">
            <el-input v-model="form.payee" readonly size="mini" />
          </el-form-item>
          <el-form-item label="收款时间:">
            <el-input v-model="form.collectionTime" readonly size="mini" />
          </el-form-item>
          <el-form-item label="收款账户:">
            <el-input v-model="form.collectionAccount" readonly size="mini" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="付款方式:">
            <el-input v-model="form.payWay" readonly size="mini" />
          </el-form-item>
          <el-form-item label="现金:">
            <el-input v-model="form.cash" readonly size="mini" />
          </el-form-item>
          <el-form-item label="电子转账:">
            <el-input v-model="form.etransfer" readonly size="mini" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付流水号:">
            <el-input v-model="form.paymentFlow" readonly size="mini" />
          </el-form-item>
          <el-form-item label="支付通道:">
            <el-input v-model="form.paymentChannel" readonly size="mini" />
          </el-form-item>
          <el-form-item label="支付金额:">
            <el-input v-model="form.paymentAmount" readonly size="mini" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="支付时间:">
            <el-input v-model="form.paymentTime" readonly size="mini" />
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="form.remark" readonly size="mini" />
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { planAndExecuteApi } from '@/api/planAndExecute/agencyFundPayment'
export default {
  name: 'WaybillTable',
  data() {
    return {
      dialogVisible: false,
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      getRowKeys(row) { // 行id
        return row.id
      },
      form: {},
      tableData: [],
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      searchForm: {
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        waybillNo: '',
        payee: '',
        payer: ''
      }
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
    this.search()
  },
  methods: {
    changeTime() {
      if (this.timeList != null && this.timeList != undefined && this.timeList.length == 2) {
        this.searchForm.startTime = this.timeList[0]
        this.searchForm.endTime = this.timeList[1]
      } else {
        this.searchForm.startTime = null
        this.searchForm.endTime = null
      }
    },
    showDetail(data) {
      var parm = {
        id: data
      }
      planAndExecuteApi.showAgencyFundPayment(parm).then(res => {
        this.form = res
        console.log(this.form)
      })
      this.dialogVisible = true
    },
    getTableData(param, isClear = true) {
      if (isClear) {
        this.$refs['multipleTable'].clearSelection()
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
      planAndExecuteApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        this.tableData = res.data
      })
    },
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
    search() {
      this.page.current = 1
      this.getTableData(this.searchForm)
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm, false)
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style>
.customstep {
  padding-right: 110px;
}
</style>
