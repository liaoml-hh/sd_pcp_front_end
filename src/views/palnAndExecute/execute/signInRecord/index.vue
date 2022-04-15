<template>
  <div>
    <!--查询框 -->
    <div style="margin-left:10px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item label="客户">
            <el-select v-model="searchForm.customer" filterable clearable size="mini">
              <!-- assistantCode -->
              <el-option
                v-for="item in customerList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="司机">
            <el-select v-model="searchForm.driverId" placeholder="请选择" size="mini">
              <el-option
                v-for="item in driverList"
                :key="item.id"
                size="mini"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="签收人" style="margin-left:4%">
            <el-input v-model="searchForm.signer" clearable size="mini" />
          </el-form-item>
          <el-form-item label="签收状态">
            <el-select v-model="searchForm.signStatus" clearable size="mini">
              <el-option
                v-for="item in signStatusList"
                :key="item.status"
                :value="item.status"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="订单号" label-width="90px">
            <el-input v-model="searchForm.orderNo" clearable size="mini" />
          </el-form-item>
          <el-form-item label="源头单号" label-width="90px">
            <el-input v-model="searchForm.sourceOrderNo" clearable size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签收时间" label-width="100px">
            <el-date-picker
              v-model="timeList"
              size="mini"
              style="width:220px"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeTime"
            />
          </el-form-item>
          <el-form-item label="下单时间" label-width="100px">
            <el-date-picker
              v-model="creTimeList"
              style="width:220px"
              size="mini"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="creChangeTime"
            />
          </el-form-item>
        </el-col>

        <el-col :span="1" style="margin-top:4%">
          <el-button type="primary" size="mini" @click="search()">查询</el-button>
        </el-col>

      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="queryLoading"
      :data="tableData"
      :row-class-name="tableRowClassName"
      tooltip-effect="dark"
      style="width: 100%;margin-left:10px"
      border
      fit
      height="600"
      :row-style="{height:0+'px'}"
      :cell-style="{padding:5+'px'}"
      :header-cell-style="{color:'#606266', height:'6px', padding:'0px'}"
      element-loading-text="Loading"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" width="120" align="center" type="index" />
      <el-table-column prop="waybillDTO.customer" label="客户" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.mailNo" label="运单号" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.sourceOrderNo" label="源头单号" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.orderNo" label="订单号" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.createdTime" label="下单时间" width="100" align="center" />
      <el-table-column prop="driver" label="司机" width="70" align="center" />
      <el-table-column prop="waybillDTO.goods" label="货品" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.goodsTypeShortName" label="货品类型" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.quantity" label="箱数" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.cubage" label="体积" show-overflow-tooltip align="center" />
      <el-table-column prop="signer" label="签收人" show-overflow-tooltip align="center" />
      <el-table-column prop="signStatus" label="签收状态" width="80" align="center">
        <template slot-scope="{row}">
          <span>
            {{
              parseInt(row.signStatus) === 1
                ? '正常签收'
                :parseInt(row.signStatus) === 0
                  ? '异常签收'
                  :parseInt(row.signStatus) === 2
                    ? '部分签收':row.signStatus
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="signTime" label="签收时间" width="100" align="center" />
      <el-table-column prop="signerId" label="签收人身份证" width="120" align="center" />
      <el-table-column prop="controll" label="物控确认" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <span>
            {{
              parseInt(row.controll) === 1
                ? '是'
                :parseInt(row.controll) === 0
                  ? '否':row.controll
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="agencyFund" label="代收款" show-overflow-tooltip align="center" />
      <el-table-column prop="agencyWay" label="收款方式" show-overflow-tooltip align="center" />
      <el-table-column label="操作" width="120" align="center">
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
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      v-dialogDrag
      top="5vh"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
      title="签收记录"
    >
      <el-form v-loading="dialogQueryLoading" element-loading-text="Loading" label-width="90px" :inline="true" :model="form" class="demo-form-inline">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户:" label-width="120px">
              <el-input v-model="form.waybillDTO.customer" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运单号:">
              <el-input v-model="form.waybillDTO.mailNo" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单号:">
              <el-input v-model="form.waybillDTO.orderNo" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单时间:" label-width="120px">
              <el-input v-model="form.waybillDTO.createdTime" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="司机:">
              <el-input v-model="form.driver" readonly size="mini" style="width:176px" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货品:">
              <el-input v-model="form.waybillDTO.goods" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货品类型:" label-width="120px">
              <el-input v-model="form.waybillDTO.goodsTypeShortName" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="箱数:">
              <el-input v-model="form.waybillDTO.quantity" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体积:">
              <el-input v-model="form.waybillDTO.cubage" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="重量:" label-width="120px">
              <el-input v-model="form.waybillDTO.weight" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签收人:">
              <el-input v-model="form.signer" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签收状态:">
              <el-input v-model="form.signStatus" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签收人身份证:" label-width="120px">
              <el-input v-model="form.signerId" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签收时间:">
              <el-input v-model="form.signTime" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代收款:">
              <el-input v-model="form.agencyFund" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收款方式:" label-width="120px">
              <el-input v-model="form.agencyWay" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物控确认:">
              <el-input v-model="form.controll" readonly size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注:">
              <el-input v-model="form.remark" readonly size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left:10%">
          <el-form-item v-for="(imgUrl,index) in form.idUrl" :key="index" label="签收照片:">
            <viewer ref="viewer1" :images="imgUrl">
              <img :src="imgUrl" width="90" height="90">
            </viewer>
          </el-form-item>
        </el-row>
        <el-row v-if="!form.idUrl.length" style="margin-left:10%">
          <el-form-item label="签收照片:">
            暂无照片
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">通过</el-button>
        <el-button type="primary" @click="dialogVisible = false">退回</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { planAndExecuteApi } from '@/api/planAndExecute/sign'
export default {
  name: 'WaybillTable',
  data() {
    return {
      signStatusList: [
        { status: 1, name: '正常签收' },
        { status: 2, name: '部分签收' },
        { status: 0, name: '异常签收' }
      ],
      dialogVisible: false,
      dialogQueryLoading: false, // 弹窗加载
      page: {
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      form: {
        idUrl: [],
        waybillDTO: {}
      },
      getRowKeys(row) { // 行id
        return row.id
      },
      tableData: [],
      driverList: [],
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      creTimeList: [],
      searchForm: {
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        crestartTime: '',
        creendTime: '',
        signer: '',
        driverId: '',
        signStatus: ''
      },
      queryLoading: false, // 表格查询加载
      customerList: [] // 客户下拉列表
    }
  },

  created() {
    // 司机列表
    planAndExecuteApi.queryDriver().then(res => {
      this.driverList = res
    })
    // 客户仓库列表
    planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      this.customerList = res.customerDTOS
      // this.warehouseList = res.customerWarehouseVOS
    }).catch(err => {
      this.$message.error(err)
    })
    this.getTableData(this.searchForm)
  },
  mounted() {
    this.search()
  },
  methods: {
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      if (parseInt(row.signStatus) === 2) {
        return 'red'
      } else if (parseInt(row.signStatus) === 0) {
        return 'lightRed'
      }
    },
    /**
     * 签收时间监听
     */
    changeTime() {
      if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
        this.searchForm.startTime = this.timeList[0]
        this.searchForm.endTime = this.timeList[1]
      } else {
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
      }
    },
    /**
     * 下单时间监听
     */
    creChangeTime() {
      if (this.creTimeList != null && this.creTimeList !== undefined && this.creTimeList.length === 2) {
        this.searchForm.crestartTime = this.creTimeList[0]
        this.searchForm.creendTime = this.creTimeList[1]
      } else {
        this.searchForm.crestartTime = ''
        this.searchForm.creendTime = ''
      }
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
      }
      if (query.crestartTime && query.creendTime) {
        query.crestartTime = this.dayTime(query.crestartTime, 'start')
        query.creendTime = this.dayTime(query.creendTime, 'end')
      }
      planAndExecuteApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        res.data.map(item => {
          item.signTime = this.FormatTime(item.signTime)
          item.waybillDTO.createdTime = this.FormatTime(item.waybillDTO.createdTime)
        })
        this.tableData = res.data
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
      })
    },
    /**
     * 时间格式化查询
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
    // 格式化时间
    FormatTime(time) {
      if (!time) {
        return
      }
      time = new Date(time)
      time = time.getFullYear() + '-' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
            time.getDate() + ' ' +
            (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
            (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
    },
    search() {
      this.page.current = 1
      this.getTableData(this.searchForm)
    },
    showDetail(data) {
      this.dialogQueryLoading = true
      var parm = {
        id: data
      }
      planAndExecuteApi.showSign(parm).then(res => {
        res.signTime = this.FormatTime(res.signTime)
        res.waybillDTO.createdTime = this.FormatTime(res.waybillDTO.createdTime)
        if (res.idUrl) {
          res.idUrl = res.idUrl.split('&')
          res.idUrl = res.idUrl.map(imgSrc => {
            imgSrc = imgSrc + '?' + (new Date()).valueOf()
            return imgSrc
          })
        } else {
          res.idUrl = []
        }
        console.log(res.idUrl)
        if (res.signStatus) {
          res.signStatus = parseInt(res.signStatus) === 1
            ? '正常签收'
            : parseInt(res.signStatus) === 0
              ? '异常签收'
              : parseInt(res.signStatus) === 2
                ? '部分签收' : res.signStatus
        }
        if (res.controll) {
          res.controll = parseInt(res.controll) === 1
            ? '是'
            : parseInt(res.controll) === 0
              ? '否' : res.controll
        }
        this.form = res
        this.dialogQueryLoading = false
        console.log(this.form)
      }).catch(err => {
        this.$message.error(err)
        this.dialogQueryLoading = false
      })
      this.dialogVisible = true
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    currentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm, false)
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style scoped>
/* .customstep {
  pshowDetailing-right: 110px;
} */
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
    background: rgb(253, 27, 27);
    color: black;
  }
</style>
