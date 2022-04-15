<template>
  <el-container>
    <el-header style="height:100px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="onQuery"
          >
            <el-form-item label="工号">
              <el-input v-model="searchForm.userId" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="searchForm.userName" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="站点">
              <el-select v-model="searchForm.stationId" placeholder="" clearable>
                <el-option v-for="(item,index) in stationList" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium " @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button>
        <!-- <el-button type="primary" icon="el-icon-document" @click="copy()">复制</el-button> -->

        <!-- <el-dropdown
          split-button
          type="primary"
          style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px"
          @command="onDropdownCommand"
        >
          启停控制
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="enable_command">启用</el-dropdown-item>
            <el-dropdown-item command="disable_command">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->

      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="operatorList"
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
          prop="userId"
          header-align="center"
          align="center"
          label="工号"
          min-width="90"
        />
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="用户名"
          min-width="90"
        />
        <el-table-column
          prop="stationVO.name"
          header-align="center"
          align="center"
          label="站点"
          min-width="120"
        />
        <el-table-column
          prop="userRight"
          header-align="center"
          align="center"
          label="权限"
          min-width="90"
        >
          <template slot-scope="data">
            <el-tag v-for="(item ,index) in data.row.myRigthlist" :key="index">{{ item }}</el-tag>
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
            <el-button
              type="primary"
              size="mini"
              @click="rowCopy(scope.row)"
            >复制</el-button>
            <el-button
              size="mini"
              @click="addOrUpdateHandle(scope.row)"
            >编辑</el-button>
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
        width="50%"
        :before-close="handleClose"
      >
        <el-form ref="formName" :model="operatorVo" label-width="100px" :rules="operatorVoRules">

          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="userId">
                <el-input v-model="operatorVo.userId" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="operatorVo.userName" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="密码" prop="userPassword">
                <el-input v-model="operatorVo.userPassword" placeholder="" />
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="站点" prop="stationId">
                <el-select
                  v-model="operatorVo.stationId"
                  clearable
                  placeholder=""

                  style="width:100%"
                >
                  <el-option
                    v-for="(item,index) in stationList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="权限" prop="rightList">
                <el-select
                  v-model="operatorVo.rightList"

                  multiple
                  style="width:100%"
                >
                  <el-option
                    v-for="(item,index) in rightListdata"
                    :key="index"
                    :label="item.key"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('formName')">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>

import { commonQueryStation } from '@/api/station/station'
import {
  commonqueryStationOperator, addStationOperator,
  batchAddStationOperator, updateStationOperator,
  removeByIdStationOperator, batchRemoveStationOperator,
  batchUpdateStationOperator, queryByIdStationOperator } from '@/api/operator/index'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    var validateuserId = (rule, value, callback) => {
      commonqueryStationOperator({ userId: value }).then(res => {
        let length = res.data.length
        if (length !== 0) {
          for (let i = 0; i < length; i++) {
            if (res.data[i].userId === value) {
              callback(new Error('有重复工号'))
              break
            }
          }
          callback()
        } else {
          callback()
        }
      })
    }
    return {

      stationList: [],
      operatorList: [],
      operatorVo: {
        userId: '',
        userName: '',
        userPassword: '',
        stationId: '',
        rightList: []
      },
      rightListdata: [
        { key: 1001, value: '1001' },
        { key: 1002, value: '1002' },
        { key: 1003, value: '1003' },
        { key: 1004, value: '1004' },
        { key: 1005, value: '1005' },
        { key: 1006, value: '1006' },
        { key: 1007, value: '1007' },
        { key: 1008, value: '1008' },
        { key: 1009, value: '1009' },
        { key: 1010, value: '1010' },
        { key: 1011, value: '1011' },
        { key: 1012, value: '1012' }
      ],
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },

      dialogType: '',
      operatorVoRules: {
        userId: [{ required: true, message: '输入工号', trigger: 'blur' }, { validator: validateuserId, trigger: 'blur' }],
        userName: [{ required: true, message: '输入用户名', trigger: 'blur' }],
        userPassword: [{ required: true, message: '输入密码', trigger: 'blur' }],
        stationId: [{ required: true, message: '选择站点', trigger: 'blur' }],
        rightList: [{ required: true, message: '权限', trigger: 'blur' }]

      }
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
    this.initdialogdata()
  },
  // 方法集合
  methods: {
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    rowCopy(row) {
      this.dialogType = 'ADD'
      queryByIdStationOperator({ id: row.id }).then(res => {
        let { userId, userName, userPassword, userRight, stationId, id, version } = res

        this.operatorVo.userId = userId
        this.operatorVo.userName = userName
        this.operatorVo.userPassword = userPassword
        this.operatorVo.stationId = stationId
        this.operatorVo.id = id
        this.operatorVo.version = version
        this.operatorVo.rightList = JSON.parse(userRight)
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('确定要删除吗？', {
          center: true
        }).then(res => {
          if (res === 'confirm') {
            batchRemoveStationOperator(this.$refs.muiltitable.selection).then(res => {
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
      }
    },
    // 添加和编辑方法
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            if (this.dialogType === 'ADD') {
              const dto = this.operatorVo
              addStationOperator({ ...dto, userRight: JSON.stringify(this.operatorVo.rightList) }).then(res => {
                if (res) {
                  this.$message.success('操作成功')

                  this.searchFormclick()
                }
                this.dialogVisible = false
              }).catch(error => {
                this.$message.error('网络错误')
                console.log(error)
              })
            } else if (this.dialogType === 'update') {
              const dto = this.operatorVo
              updateStationOperator({ ...dto, userRight: JSON.stringify(this.operatorVo.rightList) }).then(res => {
                if (res) {
                  this.$message.success('操作成功')
                  this.searchFormclick()
                }
                this.dialogVisible = false
              })
            }
          }
        })
    },
    // 编辑方法
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryByIdStationOperator({ id: row.id }).then(res => {
        // this.operatorVo = res
        let { userId, userName, userPassword, userRight, stationId, id, version } = res
        this.operatorVo.stationId = stationId
        this.operatorVo.userId = userId
        this.operatorVo.userName = userName
        this.operatorVo.userPassword = userPassword
        this.operatorVo.id = id
        this.operatorVo.version = version
        this.operatorVo.rightList = JSON.parse(userRight)
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', {
        center: true
      }).then(res => {
        if (res === 'confirm') {
          removeByIdStationOperator({ id: val.id }).then(res => {
            if (res) {
              this.$message.success('操作成功')
              this.searchFormclick()
            }
          })
        }
      })
    },
    initdialogdata() {
      commonQueryStation({ pageSize: 1000 }).then(res => {
        this.stationList = res.data
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonqueryStationOperator(this.searchForm).then(res => {
        const { total, pageNum, pageSize } = res
        this.commonPage.total = parseInt(total)
        this.operatorList = []
        res.data.map(item => {
          item.myRigthlist = JSON.parse(item.userRight)
          this.operatorList.push(item)
        })

        // 分页信息带回显示
        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    onDropdownCommand(methodName) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('没有选中任何数据')
      } else {
        this.$confirm('是否确定').then(res => {
          if (res === 'confirm') {
            this[methodName]()
            //   this[methodName]() <===>this.xxxx() 二者相等
            // 意为传入方法名称(methodName)通过this.方法名()调用 如 methodName的值为disableHandle 则调用的方法为 this.disableHandle()方法
          }
        })
      }
    },

    handleClose() {
      this.dialogVisible = false
      Object.keys(this.operatorVo).map(key => {
        if (this.operatorVo[key] instanceof Array) {
          this.operatorVo.rightList.length = 0
        } else this.operatorVo[key] = ''
      })
      this.$refs.formName.validateField()
    },
    enableHandle() {
      // 获取表格的被选中的记录
      const arry = this.$refs.muiltitable.selection
      arry.map(item => {
        item.status = 1
      })
      this.batchUpdateAuditStatus(arry)
    },
    disableHandle() {
      const arry = this.$refs.muiltitable.selection
      arry.map(item => {
        item.status = 0
      })
      this.batchUpdateAuditStatus(arry)
    },
    selectionChangeHandle(e) {
      if (e.length !== 0) {
        this.deletedisabled = false
      } else this.deletedisabled = true
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.commonPage.pageSize = val
      this.searchFormclick()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.searchFormclick()
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
