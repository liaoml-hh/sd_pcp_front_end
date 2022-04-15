<template>
  <el-container>
    <el-header style="height:40px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="onQuery"
          >
            <el-form-item label="商户订单号">
              <el-input
                v-model="searchForm.orderId"
                style="width:90%"
                clearable
              />
            </el-form-item>
            <el-form-item label="编号">
              <el-input
                v-model="searchForm.code"
                style="width:90%"
                clearable
              />
            </el-form-item>
            <!-- <el-form-item label="类型">
              <el-input v-model="searchForm.rechargeType" style="width:90%" clearable size="mini" />
            </el-form-item> -->
            <el-form-item label="充值金额">
              <el-input
                v-model="searchForm.price"
                style="width:90%"
                clearable
              />
            </el-form-item>
            <el-form-item label="用户">
              <el-input
                v-model="searchForm.userName"
                style="width:90%"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="业务时间"
              class="dateForm"
            >
              <el-date-picker
                v-model="businessTimeList"
                type="datetimerange"

                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-button
              v-loading="queryLoading"
              type="primary"
              size="medium"
              style="margin-top:3px;margin-left:20px"

              @click="searchFormclick"
            >查询</el-button>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-button type="primary" @click="exportRechargeData">导出</el-button>
          </el-col>
        </el-row>
      </div>

    </el-header>

    <el-main>
      <el-table
        ref="mutiltable"
        v-loading="queryLoading"
        :data="rechargelist"
        style="width: 100%;margin-top:60px"
        border
        fix
        @selection-change="selectionChangeHandle"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
          fixed="left"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="50"
          type="index"
        > <template slot-scope="scope">
          <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="商户订单号"
          min-width="40"
          sortable
          show-overflow-tooltip
        />
        <!-- <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="code"
          header-align="center"
          align="center"
          label="编号"
          min-width="70"
          sortable
          show-overflow-tooltip
        />
        <el-table-column
          prop="userVO.name"
          header-align="center"
          align="center"
          label="用户"
          sortable
          min-width="50"
        />
        <el-table-column
          prop="price"
          header-align="center"
          align="center"
          label="金额"
          min-width="40"
          sortable
        />

        <el-table-column
          prop="businessTime"
          header-align="center"
          align="center"
          label="业务时间"
          min-width="50"
          sortable
        />
        <el-table-column
          prop="businessTime"
          header-align="center"
          align="center"
          label="充值状态"
          sortable
          min-width="50"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.status===1" type="success">成功</el-tag>
            <el-tag v-else-if="row.status===0" type="info">失败</el-tag>
            <el-tag v-else type="warning">其他</el-tag>

          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="extend1"
          header-align="center"
          align="center"
          label="支付信息"
          min-width="50"
          show-overflow-tooltip
        /> -->
      </el-table>
      <div style="float:left;">
        <el-pagination
          :current-page.sync="commonPage.pageNum"
          :page-size="commonPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10,15, 20, 30, 40,50,100]"
          :total="commonPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- <el-dialog
        v-dialogDrag
        title="添加信息"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <el-form :inline="true" :model="rechargeVo">

          <el-form-item label="编号">
            <el-input v-model="rechargeVo.code" placeholder="" />
          </el-form-item>
          <el-form-item label="用户">
            <el-input v-model="rechargeVo.userVO.name" placeholder="" />
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="rechargeVo.price" placeholder="" />
          </el-form-item>

          <el-form-item label="积分">
            <el-input v-model="rechargeVo.integrate" placeholder="" />
          </el-form-item>

          <el-form-item label="类型">
            <el-input v-model="rechargeVo.rechargeType" placeholder="" />
          </el-form-item>

          <el-form-item label="折扣">
            <el-input v-model="rechargeVo.discount" placeholder="" />
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog> -->
    </el-main>
  </el-container>
</template>

<script>
import { from } from '@chenfengyuan/vue-qrcode'
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryRecharge, addRecharge, removeByIdRecharge } from '../../../api/recharge/index'
import moment from 'moment'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      rechargeVo: {},
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: {
        code: '',
        price: '',
        userId: '',
        userName: '',
        pageNum: 1,
        pageSize: 10
      },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      rechargelist: [],
      rechargeDTO: {},
      dialogType: '',
      businessTimeList: [new Date(Date.now() - 1000 * 60 * 60 * 24), new Date()]
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
  },

  // 方法集合
  methods: {
    onQuery() {
      this.searchFormclick()
    },

    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
      commonQueryRecharge().then(res => {
        this.rechargelist = res.data
      })
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const rechargeDTO = this.rechargeVo

        addRecharge(rechargeDTO).then(response => {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.searchFormclick()
        })
      }
    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        if (res === 'confirm') {
          removeByIdRecharge({ id: val.id }).then(response => {
            this.$message.success('操作成功')
            this.searchFormclick()
          })
        }
      }).catch(() => { })
    },
    // 发起查询
    searchFormclick() {
      this.searchForm.timeStart = ''
      this.searchForm.timeEnd = ''
      if (this.businessTimeList != null) {
        const startTime = this.dateTimeFormat(this.businessTimeList[0] || null)
        const endTime = this.dateTimeFormat(this.businessTimeList[1] || null)
        if (startTime !== null && endTime != null) {
          this.searchForm.timeStart = startTime
          this.searchForm.timeEnd = endTime
        }
      }

      this.queryLoading = true

      commonQueryRecharge(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageNum = parseInt(pageNum)
        // this.commonPage.pageSize = parseInt(pageSize)
        this.rechargelist = response.data// 分页信息带回显示
        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },

    exportRechargeData() {
      let dataList = this.$refs.mutiltable.selection
      if (dataList.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(res => {
          if (res === 'confirm') {
            this.doExportRechargeData(dataList)
          }
        })
      }
    },
    doExportRechargeData(dataList) {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../excel/Export2Excel') // 这里必须使用绝对路径，根据自己的命名和路径
        const tHeader = [
          '商户订单号',
          '单号',
          '用户',
          '电话',
          '充值金额',
          '充值时间'
        ] // 导出的表头名
        const dataKeyList = [
          'id',
          'code',
          'userVOName',
          'tel',
          'price',
          'businessTime'
        ] // 导出的表头字段名
        dataList.map(item => {
          item.tel = item.userVO.tel
          item.userVOName = item.userVO.name
        })
        // that.excelData为传入的数据
        const data = this.formatJson(dataKeyList, dataList)
        export_json_to_excel(tHeader, data, Date.now()) // 导出的表格名称，根据需要自己命名
        // tHeader为导出Excel表头名称，`xxxxxx`即为导出Excel名称
      })
    },
    formatJson(dataKeyList, dataList) {
      return dataList.map(data => dataKeyList.map(key => data[key]))
    },

    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.commonPage.pageSize = val
      this.searchFormclick()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.searchFormclick()
    },
    dateTimeFormat(date = '', pattern = 'YYYY-MM-DD HH:mm:ss') {
      try {
        return moment(date).format(pattern)
      } catch (e) {
        console.log(e)
        return null
      }
    },
    selectionChangeHandle() {

    },
    addOrUpdateHandle() {

    },
    handleClose() {

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
