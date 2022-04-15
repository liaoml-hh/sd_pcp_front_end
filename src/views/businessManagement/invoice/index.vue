<template>

  <el-container>
    <el-header style="height:120px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="onQuery"
          >
            <el-form-item label="用户">
              <el-select v-model="searchForm.userId" clearable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="纳税人识别号">
              <el-input v-model="searchForm.invoiceNum" style="width:90%" clearable />
            </el-form-item>

            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium " @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div style="  margin-bottom:10px">
        <el-button type="primary" @click="send()">发送</el-button>
        <el-button type="danger" @click="dropdown()">下载</el-button>

      </div>
    </el-header>

    <el-main>
      <el-table
        v-loading="queryLoading"
        :data="invoicelist"
        style="width: 100%;"
        border
        fix
        @selection-change="selectionChangeHandle"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="80"
          type="index"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="invoiceNo"
          header-align="center"
          align="center"
          label="发票号码"
          min-width="120"
        >
          <template slot-scope="{row}">
            <span>{{ row.invoiceNo||'暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userVO.name"
          header-align="center"
          align="center"
          label="用户"
          min-width="90"
        />
        <!-- <el-table-column
          prop="context"
          header-align="center"
          align="center"
          label="内容"
          min-width="90"
        /> -->
        <el-table-column
          prop="invoiceName"
          header-align="center"
          align="center"
          label="发票抬头"
          min-width="140"
        />
        <el-table-column
          prop="invoiceNum"
          header-align="center"
          align="center"
          label="纳税人识别号"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          prop="invoicePrice"
          header-align="center"
          align="center"
          label="发票价格"
          min-width="120"
        />
        <el-table-column
          prop="invoiceType"
          header-align="center"
          align="center"
          label="发票类型"
          min-width="120"
        />

        <el-table-column
          prop="invoiceCode"
          header-align="center"
          align="center"
          label="发票代码"
          min-width="120"
        >
          <template slot-scope="{row}">
            <span>{{ row.invoiceCode||'暂无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          header-align="center"
          align="center"
          label="邮箱"
          min-width="120"
        />
        <el-table-column
          prop="applyTime"
          header-align="center"
          align="center"
          label="申请时间"
          min-width="155"
        />
        <el-table-column
          prop="businessTime"
          header-align="center"
          align="center"
          label="业务时间"
          min-width="155"
        >
          <template slot-scope="{row}">
            <span>{{ row.businessTime||'暂无' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="审核状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else type="danger">待审核</el-tag>
          </template>
        </el-table-column>

        <el-table-column

          header-align="center"
          align="center"
          width="350"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.status===2"
              type="primary"
              size="mini"
              plain
              @click="audit(scope.row)"
            >审核</el-button>
            <el-button
              :disabled="scope.row.status===2"
              size="mini"
              type="warning"
              plain
              @click="addOrUpdateHandle(scope.row)"
            >编辑</el-button>
            <el-button
              :disabled="scope.row.status!==2"
              type="success"
              size="mini"
              plain
              @click="eamilsend(scope.row)"
            >邮件发送</el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              :disabled="scope.row.status!==2"
            >
              <el-link
                :underline="false"
                :href="scope.row.pdfUrl"
                :disabled="scope.row.status!==2"
                @click="gotoOption(scope.row)"
              >下载</el-link>
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <div style="float:left;">
        <el-pagination
          :v-model="commonPage"
          :page-count="commonPage.pageCount"
          :page-size="commonPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="commonPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        v-dialogDrag
        title="添加信息"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <el-form :inline="true" label-width="100px" :model="invoiceVo">
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号码">
                <el-input v-model="invoiceVo.invoiceNo" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="用户">
                <el-input v-model="invoiceVo.creator" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票抬头">
                <el-input v-model="invoiceVo.invoiceName " placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纳税人识别号">
                <el-input v-model="invoiceVo.invoiceNum" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票价格">
                <el-input v-model="invoiceVo.invoicePrice" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票类型">
                <el-input v-model="invoiceVo.invoiceType" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱">
                <el-input v-model="invoiceVo.email" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票代码">
                <el-input v-model="invoiceVo.invoiceCode" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请时间">
                <el-input v-model="invoiceVo.applyTime" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务时间">
                <el-input v-model="invoiceVo.businessTime" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { from } from '@chenfengyuan/vue-qrcode'
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryUser } from '../../../api/user/index'
import { commonQueryInvoice, addInvoice, updateInvoice, openinvoice, removeByIdInvoice, queryBiId, eamilsend } from '../../../api/invoice/index'
import { queryById } from '@/api/area/area'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      userList: {},
      invoiceVo: {},
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      invoicelist: [],
      invoiceDTO: {},
      dialogType: '',
      disabled: false,

      dictionarytypelist: []
    }
  },
  // 计算属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.searchFormclick()
    this.initData()
  },
  methods: {
    initData() {
      commonQueryUser({ pageSize: 10000 }).then(res => {
        this.userList = res.data
      })
    },
    onQuery() {
      this.searchFormclick()
    },

    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const invoiceDTO = this.invoiceVo
        addInvoice(invoiceDTO).then(response => {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.searchFormclick()
        })
      } else if (this.dialogType === 'update') {
        const invoiceDTO = this.invoiceVo
        updateInvoice(invoiceDTO).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.searchFormclick()
            this.invoiceVo = {}
          }
        })
      }
    },

    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryBiId({ id: row.id }).then(res => {
        this.invoiceVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 邮件发送
    eamilsend(val) {
      if (val.status === 0) {
        this.$message.error('审核还未通过，不能发送')
      } else if (val.status === 2) {
        eamilsend(val).then(res => {
          if (res) {
            this.$message.success('发送成功')
          }
          this.searchFormclick()
        }).catch(error => {
          this.$$message.error('发送失败')
          console.log(error)
        })
        this.searchFormclick()
      }
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonQueryInvoice(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.invoicelist = response.data// 分页信息带回显示
        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.commonPage.pageSize = val
      this.searchFormclick()
    },
    audit(item) {
      this.$confirm('是否确定审核', { center: true }).then(res => {
        if (res === 'confirm') {
          item.createdTime = null
          item.updatedTime = null
          this.loading = true
          openinvoice(item).then(res => {
            if (res) {
              this.loading = false
              this.$message.success('已提交发票公司开票,请稍等')
              this.searchFormclick()
            }
          }).catch(error => {
            this.loading = false
            this.$message.error('审核失败')
            console.log(error)
            this.searchFormclick()
          })
        } else return
      })
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.searchFormclick()
    },
    selectionChangeHandle() {

    },

    handleClose() {

    },
    rowDblclick() {
      console.log(arguments)
      debugger
    }
  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>

    .el-header {
    background-color: #ffffff;

  }
  .el-main {
    background-color: #ffffff;
    text-align: center;

  }

</style>
