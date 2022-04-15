<template>
  <el-containter>
    <el-form style="margin-left:0.4%" :inline="true" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="searchForm.orderNo" size="mini" />
      </el-form-item>
      <el-form-item label="客户:">
        <el-select
          v-model="searchForm.ids"
          multiple
          filterable
          style="width:90%"
          clearable
          size="mini"
        >
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
      <el-form-item label="仓库:">
        <el-select
          v-model="searchForm.warehouseName"
          filterable
          clearable
          size="mini"
        >
          <el-option
            v-for="item in warehouseList"
            :key="item.name"
            size="mini"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运单状态">
        <el-select v-model="searchForm.status" size="mini" filterable clearable>
          <el-option
            v-for="item in statusList"
            :key="item.status"
            :label="item.label"
            :value="item.status"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单时间:">
        <el-date-picker
          v-model="timeList"
          style="width:70%"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime"
        />
      </el-form-item>

      <el-button type="primary" size="mini" @click="searchData()">查询</el-button>
    </el-form>
    <el-row style="margin-left:0.4%">
      <el-button type="primary" size="mini" @click="showPrintInfo">打印条码</el-button>
    </el-row>
    <div style="margin-left:0.4%"><!--内容区-->
      <el-table
        ref="table"
        v-loading="queryLoading"
        element-loading-text="Loading"
        :cell-style="rowClass"
        :header-cell-style="headClass"
        height="620"
        border
        fit
        style="width:100%;font-size:8px"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :row-class-name="tableRowClassName"
        :data="tableData"
        @expand-change="expandChange"
        @sort-change="changeTableSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" reserve-selection width="45" align="center" />
        <el-table-column label="序号" type="index" width="45" />
        <el-table-column class="orderTableDetail" align="center" prop="orderTableDetail" label="明细" type="expand" width="45">
          <template slot-scope>
            <div style="margin-left:89px">
              <detail ref="detail" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="源头单号" sortable prop="sourceOrderNo" width="80" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            <span :data-clipboard-text="row.sourceOrderNo" class="tag-read" @click="copyText"> {{ row.sourceOrderNo == null ? '空' : row.sourceOrderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" sortable prop="orderNo" width="90" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            <span style="color:#409EFF" :data-clipboard-text="row.orderNo" class="tag-read" @click="copyText"> {{ row.orderNo == null ? '空' : row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户" sortable prop="customer" width="70" show-overflow-tooltip align="center" />
        <el-table-column align="center" prop="entrustThing" label="委托事项" show-overflow-tooltip width="50">
          <template slot-scope="{ row }">
            <span>{{ row.entrustThing == 0 ? '无' :row.entrustThing == null ? '无' : row.entrustThing }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="extend" label="注意事项" show-overflow-tooltip width="50">
          <template slot-scope="{ row }">
            <span>{{ row.extend == 0 ? '无' :row.extend == null ? '无' : row.extend }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" show-overflow-tooltip sortable prop="placeBillwayTime" width="82" align="center" />
        <el-table-column label="状态" sortable prop="status" width="60" align="center">
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
        <el-table-column label="仓库" sortable show-overflow-tooltip prop="customerWarehouseDTO.name" width="70" align="center" />
        <!-- <el-table-column label="运单号" sortable prop="mailNo" width="120" align="center" /> -->
        <el-table-column label="货品" prop="goods" width="60" show-overflow-tooltip align="center" />
        <el-table-column label="货品类型" prop="goodsTypeShortName" width="70" show-overflow-tooltip align="center" />
        <el-table-column label="回单份数" prop="signDocumentNum" width="60" align="center">
          <template slot-scope="{row}">
            <span>
              {{ !row.signDocumentNum?0:row.signDocumentNum }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="箱数" sortable prop="quantity" width="50" align="center">
          <template slot-scope="{row}">
            <span>
              {{ !row.quantity?0: row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="体积" prop="cubage" width="60" align="center">
          <template slot-scope="{row}">
            <span>
              {{ !row.cubage?0: row.cubage }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight" width="60" align="center">
          <template slot-scope="{row}">
            <span>
              {{ !row.weight?0: row.weight }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="计价方式" width="70" prop="dictionaryDTO.value" show-overflow-tooltip align="center" />
        <el-table-column label="收货人" sortable prop="receiver" width="60" show-overflow-tooltip align="center" />
        <el-table-column label="收货人公司" sortable prop="receiverCompany" width="70" show-overflow-tooltip align="center" />
        <el-table-column label="提货方式" width="75" sortable prop="pickGoodsWayDICDTO.value" align="center" />
        <el-table-column label="目的县区" sortable show-overflow-tooltip prop="goalCounty" width="70" align="center" />
        <el-table-column label="目的地址" sortable show-overflow-tooltip prop="goalAddress" width="100" align="center" />
        <!-- ======================================================================== -->
        <el-table-column label="费用" prop="waybillCharges" width="50" align="center">
          <template slot-scope="{row}">
            <span>
              {{ row.waybillCharges?row.waybillCharges:0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="成本" prop="waybillCost" width="50" align="center">
          <template slot-scope="{row}">
            <span>
              {{ row.waybillCost?row.waybillCost:0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="应收" prop="free.Charge" width="50" align="center">
          <template slot-scope="{row}">
            <span v-if="!Object.keys(row.free).length">
              0
            </span>
            <span v-else>
              {{
                !row.free.Charge
                  ?'0':row.free.Charge
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="应付" prop="free.SendCost" width="70" align="center">
          <template slot-scope="{row}">
            <span v-if="!Object.keys(row.free).length">
              0
            </span>
            <span v-else>
              {{
                !row.free.SendCost
                  ?'0':row.free.SendCost
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-left:0.4%"><!--分页-->
      <el-pagination
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
    <!-- ======================dialog========================== -->
    <el-dialog
      v-dialogDrag
      title="打印条码"
      :visible.sync="dialogPrintVisible"
      width="60%"
      style="margin-top:-5%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <!-- <CNPrint /> -->
      <!-- <NBPrint /> -->
      <div style="height:600px;margin:auto;overflow:auto"><Print ref="print" /></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelPrint">取 消</el-button>
        <el-button type="primary" @click="confirmPrinting">确 定</el-button>
      </span>
    </el-dialog>
  </el-containter>
</template>

<script>
import { WaybillApi } from '@/api/waybill/waybill'
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import detail from './detail.vue'
import axios from 'axios'
import Clipboard from 'clipboard'
export default {
  components: {
    // CNPrint: () => import('@/components/Print/CNPrint')
    // NBPrint: () => import('@/components/Print/NBPrint')
    Print: () => import('@/components/Print/Print'),
    detail
  },
  data() {
    return {
      multiSelection: [],
      tableData: [],
      customerList: [], // 客户下拉列表
      warehouseList: [], // 仓库下拉列表
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()], // 初始化查询时间
      queryLoading: false,
      dialogPrintVisible: false,
      searchForm: {
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        status: 1
      },
      expands: [], // 展开行
      getRowKeys(row) { // 行id
        return row.id
      },
      page: { // 分页
        pageSize: 10,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      statusList: [ // 运单状态下拉列表
        { status: 1, label: '待制定' },
        { status: 21, label: '待提货' },
        { status: 31, label: '提货中' },
        { status: 41, label: '已提货' },
        { status: 51, label: '待配送' },
        { status: 61, label: '配送中' },
        { status: 71, label: '到达' },
        { status: 81, label: '配送签收' },
        { status: 91, label: '签收异常' }
      ]
    }
  },
  created() {
    planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
      this.customerList = res.customerDTOS
      this.warehouseList = res.customerWarehouseVOS
    }).catch(err => {
      this.$message.error(err)
    })
    this.getTableData(this.searchForm)
  },
  mounted() {
    this.getTableData(this.searchForm)
  },
  methods: {
    /**
     * 复制订单号或源头订单号
     */
    copyText() {
      var clipboard = new Clipboard('.tag-read')
      clipboard.on('success', e => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        //  释放内存
        e.clearSelection()
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持复制',
          type: 'success'
        })
        console.log('该浏览器不支持复制')
        // 释放内存
        e.clearSelection()
        clipboard.destroy()
      })
    },
    // 取消打印
    cancelPrint() {
      this.dialogPrintVisible = false
      this.getTableData(this.searchForm)
    },
    expandChange(row, expandedRows) {
      // 全屏遮罩加载显示
      this.expand_change_arr = row
      // this.detailQueryLoading = true
      //	每次只展开一个扩展列表
      if (expandedRows.length) {
        if (row) {
          this.expands = [row.id]
        }
      } else {
        this.expands = []
      }
      // this.handleRowClick(row)
      this.orderTableDetail = []
      this.$nextTick(() => {
        this.$refs.detail.detailQueryLoading = true
      })
      WaybillApi.getWaybillDetail(row.id).then(res => {
        if (res.data) {
          this.orderTableDetail = res.data
          this.$nextTick(() => {
            this.$refs.detail.orderTableDetail = res.data
          })
          this.$forceUpdate()
        }
        this.$refs.detail.detailQueryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.$refs.detail.detailQueryLoading = false
      })
    },
    // 展示打印条码
    showPrintInfo() {
      const tableData = []
      let count = 0
      this.queryLoading = true
      this.multiSelection.map((item, index) => {
        // const item = {}
        // Object.assign(item, itemD)
        this.getArea(item.goalProvince + item.goalCity + item.goalCounty + item.goalAddress).then(res => {
          item.goalProvince = res.province
          item.goalCity = res.city
          item.goalCounty = res.district
          var regP = new RegExp(res.province, 'g')
          item.goalAddress = item.goalAddress.replace(regP, '')
          var regC = new RegExp(res.city, 'g')
          item.goalAddress = item.goalAddress.replace(regC, '')
          var regD = new RegExp(res.district, 'g')
          item.goalAddress = item.goalAddress.replace(regD, '')
          var regE = new RegExp('[()]', 'g')
          item.goalAddress = item.goalAddress.replace(regE, '')
          var regN = new RegExp('null', 'g')
          item.goalAddress = item.goalAddress.replace(regN, '')
          this.getArea(item.startCity + item.startAddress).then(resSC => {
            item.startCity = resSC.city
            if (item.quantity) {
              for (let i = 1; i <= item.quantity; i++) {
                item.indexQ = i
                tableData.push(Object.assign({}, item))
              }
            } else {
              item.indexQ = 0
              item.quantity = 0
              tableData.push(item)
            }
            if (count !== this.multiSelection.length - 1) {
              count++
            } else {
              this.queryLoading = false
              this.dialogPrintVisible = true
              this.$nextTick(() => {
                new Promise((resolve, reject) => {
                  this.$refs.print.tableData = tableData
                  resolve()
                }).then(() => {
                  this.$refs.print.init()
                })
              })
              console.log(count)
            }
          }).catch(err => {
            this.queryLoading = false
            console.log(err)
          })
        }).catch(err => {
          this.queryLoading = false
          console.log(err)
        })
      })
    },
    // 确认打印
    confirmPrinting() {
      this.$refs.print.Printing()
    },
    getArea(address) {
      return new Promise((resolve, reject) => {
        axios.get('https://restapi.amap.com/v3/geocode/geo', {
          params: {
            key: '7379f3ce41be5f56ea05b43b504df9a5',
            address
          }
        }).then(function(response) {
          resolve(response.data.geocodes[0])
        }).catch(function(error) {
          reject(error)
        })
      })
    },
    // 监听表格排序变化
    changeTableSort(column) {
      // 获取排序后的数据
      this.tableData = this.$refs.table.tableData
    },
    // 监听分页页数变化
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData(this.searchForm, false)
    },
    // 分页监听页码变化
    currentChange(val) {
      this.page.current = val
      this.getTableData(this.searchForm, false)
    },
    /**
     * 监听查询时间的变化
     */
    changeTime() {
      if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
        this.searchForm.startTime = this.timeList[0]
        this.searchForm.endTime = this.timeList[1]
      } else {
        this.searchForm.startTime = null
        this.searchForm.endTime = null
      }
    },
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      if (parseInt(row.status) === 91) {
        return 'lightRed'
      } else if (parseInt(row.status) === 111) {
        return 'blackRed'
      }
    },
    handleClose() {
      this.dialogPrintVisible = false
    },
    // 查询客户
    searchData() {
      this.page.current = 1
      this.getTableData(this.searchForm)
    },
    // 表头样式设置
    headClass() {
      return 'text-align: center;font-size:6px'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    getTableData(param, isClear = true) {
      if (isClear) {
        this.$refs['table'].clearSelection()
      }
      this.queryLoading = true
      const query = {}
      var page = {}
      page = {
        pageNum: this.page.current,
        pageSize: this.page.pageSize
      }
      Object.assign(query, page)
      if (param) {
        Object.assign(query, param)
      }
      // query.passFlag = 1
      // query.masterFlag = 1
      // query.status = 1
      if (query.startTime && query.endTime) {
        query.startTime = this.dayTime(query.startTime, 'start')
        query.endTime = this.dayTime(query.endTime, 'end')
      } else {
        query.startTime = ''
        query.endTime = ''
      }
      WaybillApi.commonQuery(query).then(res => {
        if (res.total) {
          this.page.total = parseInt(res.total)
        } else {
          this.page.total = 0
        }
        res.data.map(item => {
          if (item.placeBillwayTime) {
            item.placeBillwayTime = this.formatTime(item.placeBillwayTime)
          }
          if (item.updatedTime) {
            item.updatedTime = this.formatTime(item.updatedTime)
          }
        })
        this.tableData = res.data
        this.queryLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.queryLoading = false
      })
    },
    /**
     * 时间格式化
     * @param time 传入所需格式化时间
     */
    formatTime(time) {
      if (!time) {
        return
      }
      time = new Date(time)
      time = time.getFullYear() + '-' +
            ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
            (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ' +
            (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
            (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
            (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      return time
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
    // 选择的数据
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
