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
            <el-col :span="8">
              <el-form-item label="车牌号">
                <el-input v-model="searchForm.carNo" style="width:90%" clearable />
              </el-form-item>
              <el-form-item>
                <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button>
          <el-button type="danger" icon="el-icon-delete" :disabled="deletedisabled" @click="deleteSelect">删除</el-button>
        </el-row>
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="userblacklistlist"
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
          fixed="left"
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
          prop="userVO.acount"
          header-align="center"
          align="center"
          label="账户"
          min-width="90"
        />
        <el-table-column
          prop="userVO.name"
          header-align="center"
          align="center"
          label="用户"
          min-width="90"
        />
        <el-table-column
          prop="carNo"
          header-align="center"
          align="center"
          label="车牌号"
          min-width="90"
        />
        <el-table-column
          prop="stationVO.name"
          header-align="center"
          align="center"
          label="站点名称"
          min-width="90"
        />
        <el-table-column
          prop="applyTime"
          header-align="center"
          align="center"
          label="申请时间"
          min-width="120"
        />
        <el-table-column
          prop="estimatePrice"
          header-align="center"
          align="center"
          label="预估价格"
          min-width="120"
        />
        <!-- <el-table-column
          prop="result"
          header-align="center"
          align="center"
          label="结果"
          min-width="120"
        /> -->

        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">停用</el-tag>
            <el-tag v-else type="success">启用</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="250"
          label="操作"
        >
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
              size="mini"
              @click="rowCopy(scope.row)"
            >复制</el-button>
            <el-button
              size="mini"
              @click="addOrUpdateHandle(scope.row)"
            >编辑</el-button> -->
            <el-button
              type="danger"
              size="mini"
              @click="deleteHandle(scope.row)"
            >删除</el-button>
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
        width="90%"
        :before-close="handleClose"
      >

        <div>
          <el-header style="height:40px">
            <div>
              <el-row>
                <el-form
                  :inline="true"
                  :model="dialogSearchForm"
                >
                  <el-form-item label="申请编号">
                    <el-input
                      v-model="dialogSearchForm.applyNo"
                      style="width:90%"
                      clearable
                      size="mini"
                    />
                  </el-form-item>
                  <el-form-item label="用户">
                    <el-input
                      v-model="dialogSearchForm.userName"
                      style="width:90%"
                      clearable
                      size="mini"
                    />
                  </el-form-item>
                  <el-form-item label="车牌">
                    <el-input
                      v-model="dialogSearchForm.carNo"
                      style="width:90%"
                      clearable
                      size="mini"
                    />
                  </el-form-item>

                  <!-- <el-form-item label="审核状态">
                    <el-select
                      v-model="dialogSearchForm.status"
                      size="mini"
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
                  </el-form-item> -->

                  <el-button
                    v-loading="queryLoading"
                    type="primary"
                    style="margin-top:6px;"
                    size="mini"
                    @click="dialogSearchFormclick"
                  >查询</el-button>
                </el-form>
              </el-row>
              <el-row>
                <el-col :span="4"> <!-- <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button> -->
                  <el-button type="primary" icon="el-icon-delete" @click="batchAddClick">批量添加</el-button></el-col>
              </el-row>
            </div>

          </el-header>

          <el-table
            ref="dialogmuiltitable"
            v-loading="dialogqueryLoading"
            :data="applylist"
            style="width: 100%;margin-top:70px"
            border
            fix
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
            />
            <!-- <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column> -->
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
            <!-- <el-table-column
              prop="cardId"
              header-align="center"
              align="center"
              label="审核人"
              min-width="90"
            /> -->

            <!-- <el-table-column
          prop="chargeInfo"
          header-align="center"
          align="center"
          label="审核状态"
          min-width="120"
        /> -->
            <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="审核状态"
              width="100"
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
                                  :scope.row.status===6?'充电完成'
                                    :scope.row.status===7?'支付成功'
                                      :scope.row.status===8?'已出战'
                                        :scope.row.status }}</span>
              </template>
            </el-table-column>

            <el-table-column
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"

                  @click="dialogAddUserBlackList(scope.row)"
                >添加黑名单</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="float:left;">

            <el-pagination
              :current-page="dialogcommonPage.pageNum"
              :page-sizes="[10,20,100, 200, 300, 400]"
              :page-size="dialogcommonPage.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="dialogcommonPage.total"
              @size-change="dialogHandleSizeChange"
              @current-change="dialogHandleCurrentChange"
            />
          </div>

        </div>

        <!-- <el-form :model="userblacklistVo">
          <el-row><el-col :span="12"><el-form-item label="车ID">
                    <el-input v-model="userblacklistVo.carId" style="width: 220px;margin-left:-25px;" placeholder="" @blur="testcode" />
                  </el-form-item></el-col>
            <el-col :span="12">
              <el-form-item label="车牌号">
                <el-input v-model="userblacklistVo.carNo" style="width: 220px;margin-left:-25px;" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请时间">
                <el-input v-model="userblacklistVo.applyTime" style="width: 220px;margin-left:-37px;" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预估价格">
                <el-input v-model="userblacklistVo.estimatePrice" style="width: 220px;margin-left:-25px;" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
 -->

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <!-- <el-button type="primary" @click="onBtnSaveClick">确 定</el-button> -->
          <el-button type="primary" @click="handleClose">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import {
  commonQueryUserBlackList,
  addUserBlackList,
  updateUserBlackList,
  batchUpdateUserBlackList,
  removeByIdUserBlackList,
  batchRemoveUserBlackList,
  batchAddUserBlackList,
  queryById } from '../../../api/userblacklist/index'
import { commonQueryApply } from '@/api/apply/apply'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      userblacklistVo: {},
      deletedisabled: true,
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      dialogqueryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      userblacklistlist: [],
      userblacklistDTO: {},
      dialogType: '',
      dictionarytypelist: [],
      dialogcommonPage: {
        pageNum: '',
        pageSize: '',
        total: ''
      },
      applylist: [],
      dialogSearchForm: {}
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
    onQuery() { this.searchFormclick() },
    testcode() {
      if (this.userblacklistVo.carId.length !== 0) {
        commonQueryUserBlackList({ carId: this.userblacklistVo.carId }).then(res => {
          if (res.data.length !== 0) {
            this.$message.success('用户ID已存在')
          }
        })
      } else return
    },
    add() {
      this.dialogqueryLoading = true
      commonQueryApply({ pageSize: 100 }).then(res => {
        this.dialogqueryLoading = false
        this.applylist = res.data
      })
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    batchAddClick() {
      if (this.$refs.dialogmuiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否操作？', { center: true }).then(res => {
          if (res === 'confirm') {
            this.doAddUserBlackList(this.$refs.dialogmuiltitable.selection)
          }
        })
      }
    },
    dialogAddUserBlackList(varl) {
      if (varl) {
        this.$confirm('添加用户至黑名单,请谨慎操作', {
          center: true
        }).then(res => {
          if (res === 'confirm') {
            const dataList = []
            dataList.push(varl)
            this.doAddUserBlackList(dataList)
          }
        })
      } else this.$message.info('没有该资源')
    },
    doAddUserBlackList(dataList) {
      batchAddUserBlackList(dataList).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.dialogSearchFormclick()
        } else this.$message.warning('操作失败')
      }).catch(error => {
        console.log(error)
      })
    },
    // 发起查询
    dialogSearchFormclick() {
      this.dialogqueryLoading = true

      commonQueryApply(this.dialogSearchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.dialogcommonPage.total = parseInt(total)
        this.dialogcommonPage.pageNum = pageNum
        // this.commonPage.pageSize = pageSize

        this.applylist = response.data// 分页信息带回显示

        this.dialogqueryLoading = false // 关闭查询
      }).catch(() => {
        this.dialogqueryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    dialogHandleSizeChange(val) {
      this.dialogSearchForm.pageSize = val
      this.dialogcommonPage.pageNum = 1
      this.dialogSearchForm.pageNum = 1
      this.searchFormclick()
    },
    dialogHandleCurrentChange(val) {
      this.dialogSearchForm.pageNum = val
      this.dialogSearchFormclick()
    },

    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const userblacklistDTO = this.userblacklistVo
        delete userblacklistDTO.createdTime
        delete userblacklistDTO.updatedTime
        addUserBlackList(userblacklistDTO).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.searchFormclick()
            this.userblacklistVo = {}
          }
        })
      } else if (this.dialogType === 'update') {
        const updateuserblacklistdto = this.userblacklistVo
        updateUserBlackList(updateuserblacklistdto).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.searchFormclick()
            this.userblacklistVo = {}
          }
        })
      }
    },

    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', { center: true }).then(res => {
        removeByIdUserBlackList({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryUserBlackList(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.userblacklistlist = response.data// 分页信息带回显示
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
    onDropdownCommand(methodName) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('没有选中任何数据')
      } else {
        this.$confirm('是否确定?', { center: true }).then(res => {
          if (res === 'confirm') {
            this[methodName]()
            //   this[methodName]() <===>this.xxxx() 二者相等
            // 意为传入方法名称(methodName)通过this.方法名()调用 如 methodName的值为disableHandle 则调用的方法为 this.disableHandle()方法
          }
        })
      }
    },

    enableHandle() {
      // 获取表格的被选中的记录
      const arry = this.$refs.muiltitable.selection
      arry.map(item => {
        item.status = 1
      })
      this.batchUpdateuserblacklistStatus(arry)
    },
    disableHandle() {
      const arry = this.$refs.muiltitable.selection
      arry.map(item => {
        item.status = 0
      })
      this.batchUpdateuserblacklistStatus(arry)
    },

    batchUpdateuserblacklistStatus(arry) {
      batchUpdateUserBlackList(arry).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.searchFormclick()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleClose() {
      this.dialogVisible = false
      this.searchFormclick()
    },
    selectionChangeHandle(e) {
      if (e.length !== 0) {
        this.deletedisabled = false
      } else this.deletedisabled = true
    },
    // 批量删除
    deleteSelect() {
      this.$confirm('确定要删除吗？', { center: true }).then(res => {
        if (res === 'confirm') {
          batchRemoveUserBlackList(this.$refs.muiltitable.selection).then(res => {
            if (res) {
              this.$message.success('删除成功')
              this.searchFormclick()
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('删除失败')
          })
        }
      })
    },
    rowCopy(row) {
      queryById({ id: row.id }).then(res => {
        this.userblacklistVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.userblacklistVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    isSelectable() {

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
