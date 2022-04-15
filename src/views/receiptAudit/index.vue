<template>
  <div style="margin-left: 10px">
    <!--查询框 -->
    <div>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row>
          <el-col :span="6">
            <el-form-item label="客户:">
              <el-select
                v-model="searchForm.customerId"
                filterable
                style="width:250px"
                clearable
                size="mini"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="司机:">
              <el-select v-model="searchForm.operator" style="width:250px" filterable clearable placeholder="请选择" size="mini">
                <el-option
                  v-for="item in driverList"
                  :key="item.id"

                  size="mini"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="订单号">
              <el-input v-model="searchForm.orderNo" style="width:90%" clearable size="mini" />
            </el-form-item>
            <el-form-item label="运单号" style="margin-left:-1%">
              <el-input v-model="searchForm.waybillNo" style="width:90%;" clearable size="mini" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" style="margin-left:6%">
              <el-select v-model="searchForm.receiptStauts" style="width:260px" clearable size="mini">
                <el-option label="待审核" value="1" />
                <el-option label="审核通过" value="103" />
                <el-option label="审核未通过" value="104" />
                <el-option label="发送失败" value="111" />
                <el-option label="已送达" value="110" />
              </el-select>
            </el-form-item>
            <el-form-item label="操作时间" style="margin-left:-1%">
              <el-date-picker
                v-model="timeList"
                type="daterange"
                range-separator="至"
                size="mini"
                style="width:260px"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeTime"
              />
            </el-form-item>
          </el-col>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-row>

      </el-form>
    </div>
    <!-- 功能区-->
    <div style="margin:0px">
      <el-button type="primary" size="mini" @click="handleBatchAudit">审核</el-button>
      <el-button type="primary" size="mini" @click="btnShowPicture">回单图片</el-button>
      <el-button type="primary" size="mini" @click="handlePictureUpload">图片上传<i class="el-icon-upload el-icon--right" /></el-button>
      <el-button type="primary" size="mini" @click="btnSendReceipt">发送回单</el-button>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="queryLoading"
      :data="tableData"
      tooltip-effect="dark"
      :row-class-name="checkDel"
      style="width: 100%"
      border
      fit
      height="580"
      element-loading-text="Loading"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="全选" type="selection" reserve-selection width="55" align="center" />
      <el-table-column label="序号" width="55" align="center" type="index" />
      <el-table-column prop="waybillNo" label="运单号" show-overflow-tooltip align="center" />
      <el-table-column label="订单号" sortable prop="orderNo" width="100" show-overflow-tooltip align="center">
              <template slot-scope="{ row }">
                <span style="color:#409EFF" :data-clipboard-text="row.orderNo" class="tag-read" @click="showDetail(row)"> {{ row.orderNo == null ? '空' : row.orderNo }}</span>
              </template>
      </el-table-column>
      <el-table-column sortable prop="waybillDTO.customer" label="客户" show-overflow-tooltip align="center" />
      <el-table-column prop="operator" label="司机" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.goods" label="货品" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.goodsTypeShortName" label="货品类型" show-overflow-tooltip align="center" />
      <el-table-column sortable prop="operateTime" label="操作时间" width="120" align="center" />
      <el-table-column prop="waybillDTO.quantity" label="箱数" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.cubage" label="体积(cm³)" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.weight" label="重量(g)" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.dictionarycostway.name" label="计价方式" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.sender" label="发货人" show-overflow-tooltip align="center" />
      <el-table-column prop="waybillDTO.receiver" label="收货人" show-overflow-tooltip align="center" />
      <el-table-column label="收货人公司" prop="waybillDTO.receiverCompany" width="95" show-overflow-tooltip align="center" />
      <el-table-column prop="receiptStauts" label="回单状态" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <div>
            {{
              parseInt(row.receiptStauts) === 1
                ?'待审核'
                :parseInt(row.receiptStauts) === 103
                  ?'通过'
                  :parseInt(row.receiptStauts) === 104
                    ?'审核不通过'
                    :parseInt(row.receiptStauts) === 111
                      ?'发送失败'
                      :parseInt(row.receiptStauts) === 110
                        ?'已送达':row.receiptStauts
            }}
            <img v-if="row.oosurl" src="../../assets/404_images/pickture.png" width="10" height="10">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleAudit(scope.row)">审核</el-button>
          <el-button type="text" size="mini" @click="onlyPictureUpload(scope.row)">上传回单</el-button>
          <el-button type="text" size="mini" @click="showDetail(scope.row)">查看</el-button>
        
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="float:left">
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
      append-to-body
      :close-on-click-modal="false"
      title="回单"
    >
      <receipt-detail :form-data="form" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePassApproval('showDialog')">审核通过</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag title="回单图片" :close-on-click-modal="false" :visible.sync="pictureVisible" width="1000px">
      <picture-viewer :image-info="imageInfo" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="pictureVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePassApproval('showImageInfoDialog')">审核通过</el-button>
      </span>
    </el-dialog>
    <el-dialog v-dialogDrag title="图片上传" top="6vh" style="width:120%" :close-on-click-modal="false" :visible.sync="pictureUploadVisible">
      <picture-upload :only-order-no="onlyOrderNo" :is-only="isOnly" :up-load-customer="customerData" @parentCancelHandel="parentCancelHandel" />
    </el-dialog>
    <el-dialog v-dialogDrag title="回单审核" :close-on-click-modal="false" :visible.sync="auditVisible">
      <el-form style="height:300px;margin-top:2%" :model="approvalForm" class="form-inline" label-width="120px">
        <el-row>
          <el-form-item label="审核结果:">
            <el-switch
              v-model="isAprovalPass"
              active-text="通过"
              inactive-text="未通过"
            />
          </el-form-item>
        </el-row>
        <el-form-item label="审核意见">
          <el-input v-model="approvalForm.text" type="textarea" style="width:90%;" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePassApproval('auditDialog')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { planAndExecuteApi } from '@/api/planAndExecute/receiptAudit'
import PictureViewer from '@/views/receiptAudit/picture-viewer'
import PictureUpload from '@/views/receiptAudit/picture-upload'
// import { receiptMockData } from '@/views/receiptAudit/mock-data'
import ReceiptUpload from '@/views/receiptAudit/receipt-upload'
import ReceiptDetail from '@/views/receiptAudit/receipt-detail'
import { getName } from '@/utils/auth'
// require('../../assets/404_images/pickture.png')
export default {
  name: 'WaybillTable',
  // eslint-disable-next-line vue/no-unused-components
  components: { ReceiptDetail, ReceiptUpload, PictureUpload, PictureViewer },
  data() {
    return {
      dialogVisible: false,
      pictureVisible: false,
      pictureUploadVisible: false,
      multiSelection: [],
      page: {
        pageSize: 10,
        current: 1,
        total: 3,
        sizes: [10, 20, 50, 100]
      },
      form: {},
      getRowKeys(row) { // 行id
        return row.id
      },
      tableData: [], // 表数据
      queryLoading: false, // 表加载
      auditVisible: false, // 审核dialog展示
      isAprovalPass: true, // 审核通过不通过开关
      customerList: [], // 客户下拉列表
      driverList: [], // 司机下拉列表
      approvalForm: { id: '', updatedTime: '', modifier: getName(), receiptStauts: '' },
      customerData: [], // 存放订单号和客户简称，后续原来做文件夹名称
      onlyOrderNo: '', // 单个回单存放订单号
      isOnly: false,
      // 查询默认时间
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()],
      searchForm: {
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date(),
        waybillNo: '',
        operator: '',
        receiptType: '',
        receiptStauts: ''
      },
      imageInfo: []
    }
  },

  created() {
    // 获取司机下拉框数据
    planAndExecuteApi.queryDriver().then(res => {
      this.driverList = res
    }).catch(err => {
      this.$$message.error(err)
      this.$$message.error('获取司机下拉框数据失败，请刷新')
    })
    // 客户数据
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
    btnShowPicture() {
      const parm = []
      if (this.isSelected()) {
        this.multiSelection.map(item => {
          parm.push(item.id)
        })

        planAndExecuteApi.commonQuery({ ids: parm, pageSize: parm.length }).then(res => {
          res.data.map(item => {
            if (item.oosurl) {
              item.oosurl = item.oosurl.split('&')
              item.oosurl = item.oosurl.map(imgSrc => {
                imgSrc = imgSrc + '?' + (new Date()).valueOf()
                return imgSrc
              })
            }
          })
          this.imageInfo = res.data
          this.pictureVisible = true
        })
      } else {
        this.showSelectedTips()
      }
    },
    // 单个上传回单图片
    onlyPictureUpload(data) {
      this.onlyOrderNo = ''
      this.onlyOrderNo = data.orderNo
      this.isOnly = true
      this.pictureUploadVisible = true
    },
    // 批量上传回单图片
    handlePictureUpload() {
      // if (!this.multiSelection.length) {
      //   this.$message.warning('至少选择一条数据上传图片')
      //   return
      // }
      // this.customerData = []
      // this.multiSelection.map(item => {
      //   this.customerData.push(item.waybillDTO)
      // })
      this.pictureUploadVisible = true
    },
    btnUploadPicture() {

    },

    // 批量审核
    handleBatchAudit() {
      if (!this.multiSelection.length) {
        this.$message.warning('请至少选择一条数据')
        return
      }
      let isAudit = false
      this.multiSelection.map(item => {
        if (parseInt(item.receiptStauts) === 103 || parseInt(item.receiptStauts) === 104) {
          isAudit = true
        }
      })
      if (isAudit) {
        this.$message.warning('数据中存在已审核数据，禁止重新审核')
        return
      }
      this.auditVisible = true
    },
    // 审核
    handleAudit(row) {
      this.multiSelection = []
      this.multiSelection.push(row)
      this.auditVisible = true
    },
    // 批量审核确定
    handlePassApproval(type = 'auditDialog') {
      const approvalList = []
      this.approvalForm.updatedTime = new Date().format('yyyy-MM-dd hh:mm:ss')
      if (type === 'auditDialog') {
        if (this.isAprovalPass) {
          this.approvalForm.receiptStauts = 103
        } else {
          this.approvalForm.receiptStauts = 104
        }
      } else if (type === 'showDialog') {
        this.approvalForm.receiptStauts = 103
        this.multiSelection = [this.form]
      } else if (type === 'showImageInfoDialog') {
        this.multiSelection = this.imageInfo
        this.approvalForm.receiptStauts = 103
      }

      let isAudit = false
      this.multiSelection.map(item => {
        if (parseInt(item.receiptStauts) === 103 || parseInt(item.receiptStauts) === 104) {
          isAudit = true
        }
        approvalList.push(Object.assign({}, this.approvalForm, { id: item.id, version: item.version }))
      })
      if (isAudit) {
        this.$message.warning('数据中存在已审核数据，禁止重新审核')
        return
      }
      planAndExecuteApi.update(approvalList).then(res => {
        console.log(res)
        if (!res) {
          this.$message.error('网络错误，请重试')
        }
        this.auditVisible = false
        this.dialogVisible = false
        this.pictureVisible = false
        this.getTableData(this.searchForm)
      }).catch(err => {
        this.$message.error(err)
        this.auditVisible = false
        this.dialogVisible = false
        this.pictureVisible = false
        this.getTableData(this.searchForm)
      })
    },
    btnSendReceipt() {
      if (this.isSelected()) {
        planAndExecuteApi.sendReceiptAudit(this.multiSelection).then(res => {
          if (res) {
            this.$message.success('发送成功')
          }
        })
      } else {
        this.showSelectedTips()
      }
    },
    changeTime() {
      if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
        this.searchForm.startTime = this.timeList[0]
        this.searchForm.endTime = this.timeList[1]
      } else {
        this.searchForm.startTime = null
        this.searchForm.endTime = null
      }
    },
    edit() {
      planAndExecuteApi.update(this.form).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.dialogVisible = false
        }
      })
    },

    showDetail(data) {
      var parm = {
        id: data.id
      }
      planAndExecuteApi.showReceiptAudit(parm).then(res => {
        if (res.oosurl) {
          res.oosurl = res.oosurl.split('&')
          res.oosurl = res.oosurl.map(imgSrc => {
            imgSrc = imgSrc + '?' + (new Date()).valueOf()
            return imgSrc
          })
        } else {
          res.oosurl = []
        }
        this.form = res
        console.log(this.form)
        this.dialogVisible = true
      })
      //
      // this.form = data
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
        res.data.map(item => {
          // operateTime
        })
        this.page.total = parseInt(res.total)
        // this.tableData = res.body.data
        this.tableData = res.data
        this.queryLoading = false
      }).catch(err => {
        this.queryLoading = false
        this.$message.error(err)
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
    parentCancelHandel() {
      this.pictureUploadVisible = false
      this.getTableData(this.searchForm)
    },
    search() {
      this.page.current = 1
      this.getTableData(this.searchForm)
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
    },
    isSelected() { // 判断是否有勾选数据
      return this.multiSelection && this.multiSelection.length > 0
    },
    showSelectedTips() {
      this.$message.warning('请先勾选数据')
    },
    /**
     * @description: 用于让这一行显示不同的颜色
     * @param {*} row
     * @param {*} column
     * @param {*} rowIndex
     * @param {*} columnIndex
     * @return {*}
     */
    checkDel({ row, column, rowIndex, columnIndex }) {
      // if (row.receiptStauts === 1) {
      //   return 'yellow'
      // } else if (row.receiptStauts === 111) {
      //   return 'blue'
      // } else if (row.receiptStauts === 103) {
      //   return 'red'
      // } else if (row.receiptStauts === 110) {
      //   return 'pink'
      // } else {
      //   return 'green'
      // }
    }
  }
}
</script>

<style scoped>
.customstep {
  padding-right: 110px;
}
.el-form-item {
    margin-bottom: 10px;
}
.el-table>>>.red{
    background: hsl(0, 83%, 93%);
  }
  .el-table>>>.green{
    background: hsl(138, 84%, 87%);
  }
  .el-table>>>.pink{
    background: hsl(332, 95%, 84%);
  }
  .el-table>>>.blue{
    background: hsl(184, 71%, 77%);
  }
  .el-table>>>.black{
    background: hsl(0, 0%, 82%);
  }
  .el-table>>>.yellow{
    background: hsl(56, 100%, 84%);
  }
  .el-table>>>th.gutter{
    display: table-cell !important;
  }
</style>
