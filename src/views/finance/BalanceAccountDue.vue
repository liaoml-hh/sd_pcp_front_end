<template>
  <div style="margin-left:10px">
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="承运商">
        <!-- <el-input v-model="searchForm.customer" style="width:88%" /> -->
        <customerSelect ref="carrierSelect" :is-customer="false" @changeCarrierId="changeCarrierId" />
      </el-form-item>
      <el-form-item label="对账单号">
        <el-input v-model="searchForm.balanceAccountDueNo" />
      </el-form-item>
      <el-form-item label="对账时间">
        <myDatePicker @changeDateTime="changeDateTime" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-left:10px" @click="checkButton">对账</el-button>
    <!-- <el-button type="primary" size="mini" style="margin-left:10px" icon="el-icon-printer" @click="printButton">打印</el-button> -->
    <el-table
      ref="table"
      v-loading="queryAccountDataLoading"
      :data="tableData"
      border
      height="700"
      :row-key="getRowKeys"
      fit
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" reserve-selection width="50px" align="center" />
      <el-table-column type="index" width="50px" label="序号" align="center" />
      <el-table-column label="承运商" prop="carrierVO.name" width="220" align="center" />
      <el-table-column label="对账单号" prop="balanceAccountDueNo" width="220" align="center" />
      <el-table-column label="支付方式" prop="dictionaryVO.name" align="center" />
      <el-table-column label="付款期限" prop="paytimeLimit" align="center" />
      <el-table-column label="对账开始时间" prop="balanceStart" show-overflow-tooltip align="center" />
      <el-table-column label="对账结束时间" prop="balanceEnd" show-overflow-tooltip align="center" />
      <el-table-column label="对账时间" prop="checkTime" show-overflow-tooltip align="center" />
      <el-table-column label="订单数" prop="orderQuantity" align="center" />
      <el-table-column label="应付总额" prop="amount" align="center">
        <template slot-scope="scope">
          <div>
            <a style="color:blue" @click="showDetial(scope.row)">{{ scope.row.amount }}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结算备注" prop="remark" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="mini" @click="editButton(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" style="margin-left:10px" @click="deleteButton(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <!--分页-->
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
    <el-dialog v-dialogDrag :before-close="closePickupDialog" title="数据对账" top="3vh" :visible.sync="checkVisible" width="80%">
      <balanceAccountDueData ref="balanceAccountDueData" @parentCancelHandel="parentCancelHandel" />
    </el-dialog>
    <el-dialog title="添加明细" :visible.sync="addDetailVisible" width="90%">
      <el-form :inline="true" :model="searchForm" size="mini">
        <el-form-item label="客户">
          <el-select v-model="value" filterable clearable placeholder="请选择">
            <el-option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
              :label="customer.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发车日期">
          <el-date-picker
            v-model="searchForm.time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="queryWayBillData"
          >查询</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-table
        ref="wayBillDataTable"
        v-loading="queryWayBillDataLoading"
        :data="wayBillData"
        @selection-change="tableSelectionChange"
      >
        <el-table-column type="selection" reserve-selection width="50px" />
        <el-table-column type="index" width="50px" label="序号" />
        <el-table-column label="订单号" prop="orderId" sortable />
        <el-table-column
          label="运单号"
          prop="wayBillId"
          show-overflow-tooltip
        />
        <el-table-column
          label="下单时间"
          prop="orderTime"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="收支审核"
          prop="budgetReview"
          show-overflow-tooltip
          :formatter="budgetReviewFormatter"
        />
        <el-table-column label="状态" prop="status" show-overflow-tooltip />
        <el-table-column label="客户" prop="customer" />
        <el-table-column label="仓库" prop="wareHouse" sortable />
        <el-table-column label="货品" prop="good" />
        <el-table-column label="数量" prop="number" />
        <el-table-column label="重量" prop="weight" />
        <el-table-column label="体积" prop="volume" />
        <el-table-column label="计费方式" prop="payWay" />
        <el-table-column label="总费用" prop="amount" />
        <el-table-column label="发货人" prop="shipper" />
        <el-table-column label="收货人" prop="consignee" />
        <el-table-column label="收货人公司" prop="receiverCompany" />

        <el-table-column
          label="保险"
          prop="isInsurance"
          :formatter="isInsuranceFormatter"
        />
        <el-table-column label="代收款" prop="receivables" />
        <el-table-column label="应收款" prop="payMoney" />
        <el-table-column label="委托事项" prop="mark" />
      </el-table>
      <div>
        <!--分页-->
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
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="selected.length == 0"
          @click="AddDetailOkButton"
        >保存</el-button>
        <el-button @click="AddDetailCancelButton">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag :append-to-body="true" title="运单详情" top="5vh" :visible.sync="addWaybillInfoVisible" width="80%">
      <addWaybillInfo ref="addWaybillInfo" @waybillCancelHandel="waybillCancelHandel" />
    </el-dialog>
  </div>
</template>

<script>
import { BalanceDueApi } from '@/api/finance/balanceAccountDue'

import customerSelect from './components/customerSelect'
import myDatePicker from './components/myDatePicker'
import balanceAccountDueData from './detail/balanceAccountDueData'
import addWaybillInfo from './detail/addWaybillInfo'
import { pageMixin } from '@/views/mixin/page'

export default {
  name: 'BusinessBill',
  components: {
    customerSelect,
    myDatePicker,
    addWaybillInfo,
    balanceAccountDueData
  },
  mixins: [pageMixin],
  data() {
    return {
      searchParam: undefined,
      searchForm: {
        balanceStart: this.formatTime(new Date(), true),
        balanceEnd: new Date()
      },
      multiSelection: [],
      balanceAccountData: {},
      balanceAccountDetailData: {},
      // 查询图标控制true
      queryAccountDataLoading: false,
      queryWayBillDataLoading: false,
      // 选中已审核的运单
      selected: [],
      getRowKeys(row) { // 行id
        return row.id
      },
      // 模拟数据
      // 对账数据对象
      constBalanceAccountDue: {},
      // 客户
      customers: [
        {
          id: '001',
          name: '莱昂纳多',
          jobs: '演员'
        },
        {
          id: '002',
          name: '小明',
          jobs: '演员'
        },
        {
          id: '003',
          name: '古天乐',
          jobs: '演员'
        }
      ],
      // 支付方式
      payMethods: [
        {
          id: '01',
          code: '现金'
        },
        {
          id: '02',
          code: '微信'
        },
        {
          id: '03',
          code: '支付宝'
        },
        {
          id: '04',
          code: '刷卡'
        }
      ],
      // 待对账数据
      tableData: [],
      // 已审核运单
      wayBillData: [
        {
          orderId: '001',
          wayBillId: '10001',
          orderTime: '2021-10-10',
          budgetReview: '1',
          status: '签收',
          customer: '张三',
          wareHouse: '上海***仓',
          good: '眼镜',
          number: '2',
          weight: '500g',
          volume: '200cm2',
          payWay: '微信',
          amount: '555',
          shipper: '王五',
          consignee: '张三',
          isInsurance: '1',
          receivables: '555',
          payMoney: '666',
          mark: '无'
        },
        {
          orderId: '002',
          wayBillId: '10002',
          orderTime: '2021-10-10',
          budgetReview: '1',
          status: '签收',
          customer: '李华',
          wareHouse: '北京***仓',
          good: '水龙头',
          number: '3',
          weight: '3kg',
          volume: '700cm2',
          payWay: '微信',
          amount: '100',
          shipper: '王五',
          consignee: '李华',
          isInsurance: '2',
          receivables: '100',
          payMoney: '666',
          mark: '生锈的水龙头'
        },
        {
          orderId: '003',
          wayBillId: '10003',
          orderTime: '2021-10-10',
          budgetReview: '1',
          status: '未签收',
          customer: '赵四',
          wareHouse: '福州***仓',
          good: '垃圾袋',
          number: '5',
          weight: '200g',
          volume: '100cm2',
          payWay: '支付宝',
          amount: '20',
          shipper: '王五',
          consignee: '赵四',
          isInsurance: '2',
          receivables: '20',
          payMoney: '666',
          mark: '黑色'
        },
        {
          orderId: '004',
          wayBillId: '10004',
          orderTime: '2021-10-10',
          budgetReview: '2',
          status: '签收',
          customer: '张三',
          wareHouse: '河北***仓',
          good: '眼镜',
          number: '2',
          weight: '500g',
          volume: '200cm2',
          payWay: '微信',
          amount: '555',
          shipper: '王五',
          consignee: '张三',
          isInsurance: '1',
          receivables: '555',
          payMoney: '666',
          mark: '无'
        },
        {
          orderId: '005',
          wayBillId: '10005',
          orderTime: '2021-10-10',
          budgetReview: '2',
          status: '签收',
          customer: '张三',
          wareHouse: '南昌***仓',
          good: '眼镜',
          number: '2',
          weight: '500g',
          volume: '200cm2',
          payWay: '微信',
          amount: '555',
          shipper: '王五',
          consignee: '张三',
          isInsurance: '1',
          receivables: '555',
          payMoney: '666',
          mark: '无'
        },
        {
          orderId: '006',
          wayBillId: '10006',
          orderTime: '2021-10-10',
          budgetReview: '1',
          status: '签收',
          customer: '张三',
          wareHouse: '天津***仓',
          good: '眼镜',
          number: '2',
          weight: '500g',
          volume: '200cm2',
          payWay: '微信',
          amount: '555',
          shipper: '王五',
          consignee: '张三',
          isInsurance: '2',
          receivables: '555',
          payMoney: '666',
          mark: '无'
        }
      ],
      // 对账对话框显示标志
      checkVisible: false,
      // 添加明细对话框显示标志
      addDetailVisible: false,
      // 展示明细对话框显示标志
      addWaybillInfoVisible: false,
      value: '',
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        customerId: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        payMethod: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        payTime: [
          { required: true, message: '请输入天数', trigger: 'blur' },
          {
            type: 'number',
            message: '请输入数字格式',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          }
        ],
        amount: [
          { required: true, message: '请输入付款总额', trigger: 'blur' },
          {
            type: 'number',
            message: '请输入数字格式',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          },
          {
            pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: '请输入合法的金额数字，最多两位小数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {},
  mounted() {
    this.getTableData(this.searchForm)
  },
  methods: {
    /**
     * 子组件选框发送customerId
     */
    changeCustomerId(customerId) {
      this.searchForm.customerId = customerId
    },
    /**
     * 子组件选框发送carrierId
     */
    changeCarrierId(carrierId) {
      this.searchForm.carrierId = carrierId
    },
    /**
     * 子组件选框发送customerId
     */
    changeDateTime(startTime, endTime) {
      this.searchForm.balanceStart = startTime
      this.searchForm.balanceEnd = endTime
    },
    /**
     *  已审核运单多选框
     *  params ： val 选中行
     *
     */
    tableSelectionChange(val) {
      this.selected = val
    },
    /**
     *  展示明细dialog
     *  params ： val 选中行
     *
     */
    showDetial(row) {
      this.addWaybillInfoVisible = true
      this.$nextTick(() => {
        this.$refs.addWaybillInfo.waybillInfoType = 'Due'
        this.$refs.addWaybillInfo.getWaybillInfo(row)
        this.$refs.addWaybillInfo.waybillBtnVisible = false
      })
    },
    /**
     * 点击 X 关闭对话框的回调
     */
    closePickupDialog() {
      this.checkVisible = false
    },
    /**
     * 取消制定对账
     */
    parentCancelHandel() {
      this.checkVisible = false
      this.getTableData(this.searchForm)
    },
    /**
     *  收支审核显示格式  1 ：是，2：否
     *  params ： row：当前行数据
     *
     */
    budgetReviewFormatter(row, column) {
      if (row.budgetReview === '1') {
        return '是'
      } else {
        return '否'
      }
    },
    /**
     *  保险显示格式  1 ：是，2：否
     *  params ： row：当前行数据
     *
     */
    isInsuranceFormatter(row, column) {
      if (row.isInsurance === '1') {
        return '是'
      } else {
        return '否'
      }
    },
    /**
     *  查询待对账记录button
     *  params ：
     */
    handleSearch() {
      const p = Object.assign({}, this.searchForm)
      this.page.pageNum = 1
      this.getTableData(p)
    },
    getTableData(param, isClear = true) {
      if (isClear) {
        this.$refs['table'].clearSelection()
      }
      // this.$refs['approvalTable'].clearSelection()
      this.queryLoading = true
      const query = {}
      var page = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize
      }
      Object.assign(query, page)
      if (param) {
        Object.assign(query, param)
      }
      if (query.balanceStart && query.balanceEnd) {
        query.balanceStart = this.dayTime(query.balanceStart, 'start')
        query.balanceEnd = this.dayTime(query.balanceEnd, 'end')
      } else {
        query.balanceStart = ''
        query.balanceEnd = ''
      }
      // AuditApi查询改为waybill查询结果都一样
      query.passFlag = 1
      BalanceDueApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        if (res.data) {
          res.data.map(item => {
            item.orderQuantity = item.balanceAccountDueDetailDTOList.length
          })
        }
        this.tableData = res.data
        this.queryLoading = false
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
    queryWayBillData() {
      this.queryWayBillDataLoading = true
      // 执行查询api
      setTimeout(() => {
        // 代码
        this.queryWayBillDataLoading = false
      }, 2000)
    },
    /**
     *  table的多选框
     *  params ：val 已选行
     */
    handleSelectionChange(val) {
      this.multiSelection = val
    },
    /**
     *  打印按钮
     *  params ：
     */
    printButton() {},
    /**
     *  编辑按钮
     *  params ：
     */
    editButton(row) {
      this.checkVisible = true
      this.$nextTick(() => {
        this.$refs.balanceAccountDueData.getEditData(row)
      })
    },
    /**
     *  删除按钮
     */
    deleteButton(row) {
      this.$confirm('此操作将永久删除该账单，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        BalanceDueApi.delete({ id: row.id, version: row.version }).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.getTableData(this.searchForm)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
     *  对账按钮
     *  params ：
     */
    checkButton() {
      this.checkVisible = true
      this.$nextTick(() => {
        this.$refs.balanceAccountDueData.init()
      })
    },
    /**
     * 对账表单保存按钮
     * params ：
     */
    checkOkButton() {
      this.$refs['balanceAccountData'].validate(valid => {
        if (valid) {
          this.$confirm('确定添加记录吗').then(result => {
            this.checkVisible = false
            this.selected = []
            this.$message.success('保存成功')
          })
        }
      })
    },
    CheckCancelButton() {
      this.checkVisible = false
      this.selected = []
    },

    /**
     * 添加详细表单-保存按钮
     * params ：
     */
    AddDetailOkButton() {
      const rows = this.$refs.wayBillDataTable.selection
      if (rows.length >= 1) {
        // 执行插入操作
        this.balanceAccountData.balanceAccountDetailData = rows
        this.addDetailVisible = false
        this.checkVisible = true
        this.$message.success('保存成功')
      }
    },
    /**
     * 添加详细表单-取消按钮
     * params ：
     */
    AddDetailCancelButton() {
      this.addDetailVisible = false
      this.checkVisible = true
    },
    // 取消隐藏事件
    waybillCancelHandel() {
      this.addWaybillInfoVisible = false
    }
  }
}
</script>

<style scoped>
.customWidth {
  width: 200%;
}
</style>
