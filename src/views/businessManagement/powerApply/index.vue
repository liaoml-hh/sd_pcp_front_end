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
            <el-form-item label="申请编号">
              <el-input
                v-model="searchForm.applyNo"
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
            <el-form-item label="车牌">
              <el-input
                v-model="searchForm.carNo"
                style="width:90%"
                clearable
              />
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select
                v-model="searchForm.status"

                clearable
                style="width:100%"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in statuslist"
                  :key="item.id"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>

            <el-button
              v-loading="queryLoading"
              type="primary"
              style="margin-top:3px;margin-left:20px"
              size="medium"
              @click="searchFormclick"
            >查询</el-button>
          </el-form>
        </el-row>
        <el-row>
          <!-- <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button> -->
          <el-button type="primary" icon="el-icon-delete" @click="batchAuditPass">批量审核</el-button>
        </el-row>
      </div>

    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="applylist"
        style="width: 100%;"
        border
        fix

        @selection-change="selectionChangeHandle"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="40"
          :selectable="isSelectable"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="40"
          type="index"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyNo"
          header-align="center"
          align="center"
          label="申请编号"
          min-width="125"
        />
        <el-table-column
          prop="userVO.name"
          header-align="center"
          align="center"
          label="用户"
          min-width="90"
        />
        <el-table-column
          prop="userVO.acount"
          header-align="center"
          align="center"
          label="手机号"
          min-width="120"
        />

        <el-table-column
          prop="stationVO.name"
          header-align="center"
          align="center"
          label="名称"
          min-width="90"
          show-overflow-tooltip=""
        />
        <el-table-column
          prop="stationVO.address"
          header-align="center"
          align="center"
          label="站点"
          min-width="110"
          show-overflow-tooltip=""
        />
        <el-table-column
          prop="stationVO.longitude"
          header-align="center"
          align="center"
          label="经度"
          min-width="100"
        />
        <el-table-column
          prop="stationVO.latitude"
          header-align="center"
          align="center"
          label="纬度"
          min-width="100"
        />

        <el-table-column
          prop="carNo"
          header-align="center"
          align="center"
          label="车牌号"
          min-width="90"
        />
        <el-table-column
          prop="applyTime"
          header-align="center"
          align="center"
          label="申请时间"
          min-width="155"
        />
        <el-table-column
          prop="createdTime"
          header-align="center"
          align="center"
          label="创建时间"
          min-width="155"
        />
        <el-table-column
          prop="cardId"
          header-align="center"
          align="center"
          label="审核人"
          min-width="90"
        />
        <el-table-column
          prop="auditResult"
          header-align="center"
          align="auditResult"
          label="审核结论"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="审核状态"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.status===-3?"已失效"
              :scope.row.status===-2?"已取消"
                :scope.row.status===-1?"未通过"
                  :scope.row.status===0?'待审核'
                    :scope.row.status===1?"审核通过"
                      :scope.row.status===2?'已发送'
                        :scope.row.status===3?'发送成功'
                          :scope.row.status===4?'已进站'
                            :scope.row.status===5?'车辆到位'
                              :scope.row.status===6?'充换电中'
                                :scope.row.status===7?'换电完成'
                                  :scope.row.status===8?'支付成功'
                                    :scope.row.status===9?'已出站'
                                      :scope.row.status===10?'站点申请订单完成'
                                        :scope.row.status===11?'站点申请订单取消':'同意站点申请' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          width="300"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              :disabled="scope.row.status!=0"
              @click="handleAudit(scope.row)"
            >审核</el-button>
            <!-- <el-button
              size="mini"
              @click="addOrUpdateHandle(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteHandle(scope.row)"
            >删除</el-button> -->
            <el-button
              v-show="scope.row.status===10||scope.row.status===11"
              type="primary"
              size="mini"
              @click="agreeToSiteApplication(scope.row)"
            >同意站点申请</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="float:left;">

        <el-pagination
          :current-page="commonPage.pageNum"
          :page-sizes="[10,20,100, 200, 300, 400]"
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
        <el-form :model="applyVo">
          <el-row>
            <el-col>
              <el-form-item label="申请编号">
                <el-input
                  v-model="applyVo.applyNo"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="站点">
                <el-input
                  v-model="applyVo.stationId"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="车牌号">
                <el-input
                  v-model="applyVo.carNo"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="车牌ID">
                <el-input
                  v-model="applyVo.carId"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="onBtnSaveClick"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryApply, addApply, updateApply, updataeAuditpass, batchAuditPass, removeByIdApply, agreeToSiteApplication } from '../../../api/apply/apply'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      applyVo: {},
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { pageNum: 1, pageSize: 10, total: 10, pageCount: 1 },
      applylist: [],
      applyDTO: {},
      dialogType: '',
      multiSelection: [],
      statuslist: [
        { id: 1, value: -3, label: '已失效' },
        { id: 2, value: -2, label: '已取消' },
        { id: 3, value: -1, label: '未通过' },
        { id: 4, value: 0, label: '待审核' },
        { id: 5, value: 1, label: '审核通过' },
        { id: 6, value: 2, label: '已发送' },
        { id: 7, value: 3, label: '发送成功' },
        { id: 8, value: 4, label: '已进站' },
        { id: 9, value: 5, label: '车辆到位' },
        { id: 10, value: 6, label: '换电中' },
        { id: 11, value: 7, label: '换电完成' },
        { id: 12, value: 8, label: '支付成功' },
        { id: 12, value: 9, label: '已出站' },
        { id: 12, value: 8, label: '站点申请订单完成' },
        { id: 12, value: 8, label: '站点申请订单取消' }
      ]
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
    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    statusFormat(row, column) {
      if (row.status === 1) {
        return '审核通过'
      } else {
        return '待审核'
      }
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const applyDTO = this.applyVo
        addApply(applyDTO).then(response => {
          this.$message.success('操作成功')
          this.dialogVisible = false
        })
      }
    },
    // 控制审核和待审核
    handleAudit(row) {
      this.$confirm('是否确定审核', { center: true }).then(res => {
        if (res === 'confirm') {
          const powerauditlist = []
          powerauditlist.push({ id: row.id })
          this.queryLoading = true
          updataeAuditpass(powerauditlist).then(res => {
            if (res) {
              this.$message.success('系统审核中,请耐心等待')
              this.queryLoading = false
              this.searchFormclick()
            }
          }).finally(() => {
            this.searchFormclick()
          })
        } else return
      })
    },
    onQuery() {
      this.searchFormclick()
    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdApply({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    batchAuditPass() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否确定审核', { center: true }).then(res => {
          if (res === 'confirm') {
            const powerauditlist = []
            this.$refs.muiltitable.selection.map(item => {
              powerauditlist.push({ id: item.id })
            })
            this.queryLoading = true
            updataeAuditpass(powerauditlist).then(res => {
              if (res) {
                this.$message.success('系统审核中,请耐心等待')
                this.queryLoading = false
                this.searchFormclick()
              }
            })
          } else return
        })
      }
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonQueryApply(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        this.commonPage.pageNum = pageNum
        // this.commonPage.pageSize = pageSize
        console.log(this.commonPage)

        this.applylist = response.data// 分页信息带回显示
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
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.searchFormclick()
    },
    isSelectable(row, index) {
      if (row.status > 1) {
        return false
      } else return true
    },

    agreeToSiteApplication(val) {
      this.$confirm('是否同意', { center: true }).then(res => {
        if (res === 'confirm') {
          const obj = JSON.parse(JSON.stringify(val))
          obj.userDTO = obj.userVO
          obj.stationDTO = obj.stationVO
          obj.auditResult = '1'
          obj.status = 12
          agreeToSiteApplication(obj)
        }
      })
    },
    selectionChangeHandle() {

    },
    addOrUpdateHandle() {

    },
    handleClose() {

    }

  }
}
</script>
<style scoped>
.el-header {
  background-color: #ffffff;
}
.el-main {
  margin-top: 50px;
  background-color: #ffffff;
  text-align: center;
}
</style>
