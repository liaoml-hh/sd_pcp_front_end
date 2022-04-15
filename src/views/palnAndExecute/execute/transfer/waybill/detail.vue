<template>
  <div>

    <!-- <div style="padding: 10px">
    <div>内容区 -->
    <!-- <el-table
    ref="table"
    v-loading="queryLoading"
    element-loading-text="Loading"
    :cell-style="rowClass"
    :header-cell-style="headClass"
    height="500"
    :row-class-name="tableRowClassName"
    :data="tableData"
  > -->
    <el-table
      ref="table"
      v-loading="queryLoading"
      element-loading-text="Loading"
      class="tableDetail"
      fit
      highlight-current-row
      border
      :height="tableData.length>=4?220:''"
      :header-cell-style="{color:'#606266', height:'6px', padding:'0px'}"
      :row-class-name="tableRowClassName"
      :data="tableData"
    >
      <!-- <el-table-column v-show="waybillBtnVisible" label="全选" type="selection" reserve-selection width="45" /> -->
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      />
      <el-table-column
        label="源头单号"
        sortable
        prop="sourceOrderNo"
        width="140"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            :data-clipboard-text="row.sourceOrderNo"
            class="tag-read"
            @click="copyText"
          > {{ row.sourceOrderNo == null ? '空' : row.sourceOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单号"
        sortable
        prop="orderNo"
        width="149"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            style="color:#409EFF"
            :data-clipboard-text="row.orderNo"
            class="tag-read"
            @click="copyText"
          > {{ row.orderNo == null ? '空' : row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="客户"
        prop="customer"
        width="110"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="仓库地址"
        prop="warehouseAddress"
        width="110"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="状态"
        prop="status"
        width="70"
        show-overflow-tooltip
        align="center"
      >
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
      <el-table-column
        label="收货人"
        prop="receiver"
        width="70"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="收货人公司"
        prop="receiverCompany"
        width="90"
        show-overflow-tooltip
        align="center"
      />
      <!-- <el-table-column label="收货人地址" prop="receiverAddress" width="120" show-overflow-tooltip /> -->
      <!-- <el-table-column label="联系方式" prop="orderNo" width="120" show-overflow-tooltip /> -->
      <el-table-column
        label="下单时间"
        show-overflow-tooltip
        prop="placeBillwayTime"
        width="110"
        align="center"
      />
      <!-- <el-table-column label="起始城市" prop="startCity" width="120" /> -->
      <!-- <el-table-column label="目的城市" show-overflow-tooltip prop="goalCity" width="120" align="center" /> -->
      <el-table-column
        label="目的县区"
        show-overflow-tooltip
        prop="goalCounty"
        width="90"
        align="center"
      />
      <el-table-column
        label="目的地址"
        show-overflow-tooltip
        prop="goalAddress"
        width="100"
        align="center"
      />
      <!-- <el-table-column label="上游单号" prop="upstreamOrderNo" width="150" show-overflow-tooltip /> -->
      <el-table-column
        label="货品"
        prop="goods"
        width="80"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="货品类型"
        width="80"
        prop="goodsTypeShortName"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="箱数"
        width="60"
        prop="quantity"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="体积"
        width="60"
        prop="cubage"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="重量"
        width="60"
        prop="weight"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="计价方式"
        width="80"
        prop="dictionarycostway.value"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="回单份数"
        width="80"
        prop="signDocumentNum"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        label="操作"
        width="80"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="row">
          <el-button
            size="mini"
            type="danger"
            @click="updatewaybilltransfer(row)"
          >修改</el-button>
        </template>

      </el-table-column>
      <!-- <el-table-column label="机构" prop="organization.name" show-overflow-tooltip />
        <el-table-column label="公司" prop="company.name" show-overflow-tooltip /> -->
      <!-- <el-table-column label="更新人" prop="modifier" show-overflow-tooltip />
    <el-table-column label="更新时间" prop="updatedTime" width="100" /> -->
    </el-table>

    <!-- </div> -->
    <!--分页-->
    <!-- <div>
      <el-pagination
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div> -->
    <!-- </div> -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="editform">
        <el-form-item
          label="件数"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="editform.quantity"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="重量"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="editform.weight"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="体积"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="editform.cubage"
            autocomplete="off"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="comnitdata"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { WaybillApi } from '@/api/waybill/waybill'
// import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
import Clipboard from 'clipboard'
// import { version } from 'element-ui'
export default {
  name: 'Index',
  components: {
  },
  // props: ['queryLoading'],
  props: {
    queryLoading: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      multiSelection: [],
      tableData: [],
      customerList: [], // 客户下拉列表
      warehouseList: [], // 仓库下拉列表
      timeList: [new Date(new Date() - 24 * 60 * 60 * 1000), new Date()], // 初始化查询时间
      waybillBtnVisible: true,
      dialogVisible: false,
      itemDialogVisible: false,
      mergeVisible: false,
      approvalVisible: false,
      isApproval: false,
      searchForm: {
        startTime: new Date(new Date() - 24 * 60 * 60 * 1000),
        endTime: new Date()
      },
      editform: {
        id: '',
        version: '',
        weight: '',
        cubage: '',
        quantity: ''
      },
      page: { // 分页
        size: 20,
        current: 1,
        total: 0,
        sizes: [10, 20, 50, 100]
      },
      tabName: 'noPass',
      row: {}
    }
  },
  created() {
  },
  mounted() {
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
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
    // 监听分页页数变化
    sizeChange(val) {
      this.page.size = val
      this.getTableData()
    },
    // 分页监听页码变化
    currentChange(val) {
      this.page.current = val
      this.getTableData()
    },
    // 不同状态显示不同颜色
    tableRowClassName({ row, rowIndex }) {
      // if (parseInt(row.status) === 1) {
      //   return 'green'
      // } else if (parseInt(row.status) === 21) {
      //   return 'red'
      // } else if (parseInt(row.status) === 31) {
      //   return 'yellow'
      // } else if (parseInt(row.status) === 41) {
      //   return 'yellowgreen'
      // } else if (parseInt(row.status) === 51) {
      //   return 'burlywood'
      // } else if (parseInt(row.status) === 61) {
      //   return 'wheat'
      // } else if (parseInt(row.status) === 71) {
      //   return 'aqua'
      // } else if (parseInt(row.status) === 81) {
      //   return 'blue'
      // } else
      if (parseInt(row.status) === 91) {
        return 'lightRed'
      } else if (parseInt(row.status) === 111) {
        return 'blackRed'
      }
    },
    headClass() {
      return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
    },
    // 表格样式设置
    rowClass() {
      return 'text-align: center;'
    },
    updatewaybilltransfer(row) {
      this.editform.id = row.row.id
      this.editform.version = row.row.version
      this.editform.weight = row.row.weight
      this.editform.cubage = row.row.cubage
      this.editform.quantity = row.row.quantity
      this.dialogVisible = true

      // this.$emit('preupdatewaybilltransfer', this.editform)
    },
    comnitdata() {
      
      this.$emit('preupdatewaybilltransfer', this.editform)
    }
  }
}
</script>

<style scoped>
.el-table >>> .red {
  background: hsl(0, 83%, 93%);
}
.el-table >>> .green {
  background: hsl(138, 84%, 87%);
}
.el-table >>> .blue {
  background: hsl(184, 71%, 77%);
}
.el-table >>> .yellow {
  background: hsl(56, 100%, 84%);
}
.el-table >>> .pink {
  background: hsl(80, 61%, 50%);
}
.el-table >>> .burlywood {
  background: hsl(34, 57%, 70%);
}
.el-table >>> .wheat {
  background: hsl(39, 77%, 83%);
}
.el-table >>> .aqua {
  background: hsl(180, 100%, 50%);
}
.el-table >>> .blackRed {
  background: rgb(238, 131, 123);
}
.el-table >>> .lightRed {
  background: red;
  color: black;
}
.el-table {
  width: 100%;
  margin: 0;
  padding-left: 99px;
  font-size: 13px;
}
.el-table >>> .el-table__body,
.el-table >>> .el-table__footer,
.el-table >>> .el-table__header {
  border-left: 1px solid #ebeef5;
}
</style>
