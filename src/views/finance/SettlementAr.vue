<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="mini" style="position:relative;top:20px;left:10px;">
      <el-form-item label="客户">
        <customerSelect @changeCustomerId="changeCustomerId" />
      </el-form-item>
      <el-form-item label="结算单号">
        <el-input v-model="searchForm.settleBillNo" />
      </el-form-item>
      <el-form-item label="结算时间">
        <myDatePicker @changeDateTime="changeDateTime" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="mini" style="margin:10px">
      <el-form-item label="">
        <el-button
          type="primary"
          icon="el-icon-tickets"
          @click="onBtnDealClick"
        >结算</el-button>
      </el-form-item>
      <!-- <el-form-item label="">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="onBtnPrintClick"
        >打印</el-button>
      </el-form-item> -->
    </el-form>
    <el-table
      ref="table"
      v-loading="queryLoading"
      :data="tableData"
      fit
      border
      highlight-current-row
      height="700"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" width="50" type="selection" reserve-selection />
      <el-table-column type="index" align="center" width="70px" label="序号" />
      <el-table-column label="结算单号" prop="settleBillNo" align="center" />
      <el-table-column label="客户" prop="customerVO.name" align="center" />
      <el-table-column label="结算方式" prop="setWay.name" align="center" />
      <el-table-column label="应收款" prop="ar" align="center" />
      <el-table-column label="实收款" prop="actualAr" align="center" />
      <el-table-column label="结算人" prop="settler" align="center" />
      <el-table-column label="结算时间" prop="settleTime" align="center" />
      <el-table-column label="结算备注" prop="remark" align="center" />
      <el-table-column label="未结款" align="center">
        <template slot-scope="s">
          {{ getRemainSettle(s.row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!-- <el-button :disabled="s.row.ar<=s.row.arSettle" type="primary" @click="handleSettle(s.row)">结算</el-button> -->
          <el-button type="text" size="mini" @click="editButton(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" style="margin-left:10px" @click="deleteButton(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div><!--分页-->
      <el-pagination
        :current-page="page.pageNum"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>

    <!-- ----------------------- dialog：dialog1 ------------------------------------------------------- -->
    <el-dialog
      v-dialogDrag
      top="5vh"
      title="结算信息"
      :visible.sync="SettleArDataVisible"
      :before-close="settlementArDataCancelHandel"
      :close-on-click-modal="false"
      destroy-on-close
      width="70%"
      center
    >
      <settlementArData ref="settlementArData" @settlementArDataCancelHandel="settlementArDataCancelHandel" />
    </el-dialog>

    <!-- ----------------------- dialog：dialog2 ------------------------------------------------------- -->

    <!-- -----------------------dialog：应收结算------------------------------------------------------- -->
    <el-dialog
      v-dialogDrag
      top="5vh"
      title="应收结算"
      :visible.sync="arSettleVisible"
      width="30%"
      center
    >
      <el-form v-model="settleForm" label-width="80px">
        <el-form-item label="总金额">
          <el-input v-model="settleForm.ar" disabled />
        </el-form-item>
        <el-form-item label="已结算">
          <el-input v-model="settleForm.arSettle" disabled />
        </el-form-item>
        <el-form-item label="未结算">
          <el-input v-model="settleForm.remainArSettle" disabled />
        </el-form-item>
        <el-form-item label="此次结算金额" label-width="120px">
          <el-input v-model="settleForm.arMoney" placeholder="请输入本次结算金额" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="arSettleVisible = false">返 回</el-button>
        <el-button type="primary" @click="realHandleSettle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageMixin } from '@/views/mixin/page'
import { settlementArApi } from '@/api/finance/settlementAr'

import myDatePicker from './components/myDatePicker'
import customerSelect from './components/customerSelect'
import settlementArData from './settlementDetail/settlementArData'
// import { indexOf } from 'mock/user'

export default {
  name: 'Settlement',
  components: {
    settlementArData,
    myDatePicker,
    customerSelect
  },
  mixins: [pageMixin],
  data() {
    return {
      // Flag: 0,//侧边栏控制
      searchForm: {
        startTime: this.formatTime(new Date(), true),
        endTime: new Date()
      }, // 查询参数
      queryLoading: false, // 查询进度条控制,
      searchParam: undefined,
      arSettleVisible: false,
      SettleArDataVisible: false,
      multiSelection: [],
      tableData: [],
      settlementDetail1: [],
      settleForm: {}
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    /**
     * 子组件选框发送customerId
     */
    changeDateTime(startTime, endTime) {
      this.searchForm = {}
      Object.assign(this.searchForm, { startTime, endTime })
    },
    /**
     * 子组件选框发送customerId
     */
    changeCustomerId(customerId) {
      this.searchForm.customerId = customerId
    },
    settlementArDataCancelHandel() {
      this.getTableData(this.searchForm)
      this.SettleArDataVisible = false
    },
    editButton(row) {
      // settlementArDetailDTOList
      this.SettleArDataVisible = true
      this.$nextTick(() => {
        this.$refs.settlementArData.getEditInfo(row)
      })
    },
    /**
     * 删除
     */
    deleteButton(row) {
      this.$confirm('此操作将永久删除该结算单，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        settlementArApi.delete({ id: row.id, version: row.version }).then(res => {
          if (res) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('未知错误')
          }
          this.getTableData(this.searchForm)
        })
      }).catch(() => {})
    },
    /**
     * 打印
     */
    onBtnPrintClick() {

    },

    onBtnDealClick() {
      this.settlementDetail1 = []
      this.SettleArDataVisible = true
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
    getRemainSettle(row) {
      const ret = row.ar - row.actualAr
      return ret.toFixed(2)
    },

    handleSearch() {
      this.queryLoading = false
      this.getTableData(this.searchForm)
    },
    handTabClick() {
      this.page.pageNum = 1
      this.searchParam = undefined
      this.getTableData()
    },
    /**
     * 获取表数据
     */
    getTableData() {
      const query = {}
      this.queryLoading = true
      Object.assign(query, this.page)
      if (this.searchForm) {
        Object.assign(query, this.searchForm)
      }
      if (query.startTime && query.endTime) {
        query.startTime = this.dayTime(query.startTime, 'start')
        query.endTime = this.dayTime(query.endTime, 'end')
      } else {
        query.startTime = ''
        query.endTime = ''
      }
      settlementArApi.commonQuery(query).then(res => {
        this.queryLoading = false
        this.page.total = parseInt(res.total)
        this.tableData = res.data
      }).catch(() => {
        this.queryLoading = false
      })
    },
    /**
     * 时间格式化查询
     * @param {需要格式化的时间} myTime
     * @param {起始时间的类型：start，end} type
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
    handleSelectionChange(val) {
      this.multiSelection = val
    },
    handleSettle(row) {
      this.settleForm = row
      this.settleForm.remainArSettle = row.ar - row.arSettle
      this.arSettleVisible = true
    },
    realHandleSettle() {
      if (!this.settleForm.arMoney || isNaN(this.settleForm.arMoney)) {
        this.$message.warning('请输入合法的结算金额')
        return
      }
      if (this.settleForm.arMoney > this.settleForm.remainArSettle) {
        this.$message.warning('此次结算金额不能大于未结算金额')
        return
      }
      settlementArApi.settle({ id: this.settleForm.id, arMoney: this.settleForm.arMoney }).then(res => {
        this.getTableData()
        this.$message.success('操作成功')
        this.arSettleVisible = false
      })
    }
  }
}
</script>

<style scoped>
.el-scrollbar__wrap {
    overflow-x: hidden!important;
}
</style>
