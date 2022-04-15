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
            <el-form-item label="编号">
              <el-input v-model="searchForm.code" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="参数名称">
              <el-input v-model="searchForm.name" style="width:90%" clearable />
            </el-form-item>

            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="deletedisabled" @click="deleteSelect">删除</el-button>
        <el-dropdown
          split-button
          type="primary"
          style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px"
          @command="onDropdownCommand"
        >
          启停控制
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="enableHandle">自动</el-dropdown-item>
            <el-dropdown-item command="disableHandle">手动</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="excel">excel导出</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="excel">excel导入</el-button> -->
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="paramslist"
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
          prop="code"
          header-align="center"
          align="center"
          label="编号"
          min-width="90"
        />
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="参数名称"
          min-width="145"
          show-overflow-tooltip
        />
        <el-table-column
          prop="businessParamsTypeVO.typeName"
          header-align="center"
          align="center"
          label="参数类型"
          min-width="145"
          show-overflow-tooltip
        />
        <el-table-column
          prop="value"
          header-align="center"
          align="center"
          label="参数值"
          min-width="145"
          show-overflow-tooltip
        />
        <el-table-column
          prop="paramsDescription"
          header-align="center"
          align="center"
          label="描述"
          min-width="145"
          show-overflow-tooltip
        />

        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">手动</el-tag>
            <el-tag v-else type="success">自动</el-tag>
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
        <div style="margin-left:-40px">
          <el-form ref="businessParamsVORef" :model="businessParamsVO" :rules="businessParamsVORules" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="编号" prop="code">
                  <el-input v-model="businessParamsVO.code" placeholder="" @blur="testcode" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="参数名称" prop="name">
                  <el-input v-model="businessParamsVO.name" placeholder="" @blur="testcode" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="参数值" prop="value">
                  <el-input v-model="businessParamsVO.value" placeholder="" @blur="testcode" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="描述" prop="paramsDescription">
                  <el-input v-model="businessParamsVO.paramsDescription" placeholder="" @blur="testcode" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
// import { from } from '@chenfengyuan/vue-qrcode'
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

import {
  commonQueryparameter,
  addparameter,
  updateparameter,
  batchUpdateparameter,
  removeByIdparameter,
  batchRemoveparameter,
  queryById } from '../../../api/businessParams/index'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      businessParamsVO: {},
      deletedisabled: true,
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      paramslist: [],
      businessParamsDTO: {},
      dialogType: '',
      dictionarytypelist: [],
      businessParamsVORules: {
        code: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '不能为空', trigger: 'blur' }],
        paramsDescription: [{ required: true, message: '不能为空', trigger: 'blur' }]
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

  methods: {
    onQuery() {
      this.searchFormclick()
    },
    testcode() {
      if (this.batteryPackageVO.code.length !== 0) {
        commonQueryparameter({ code: this.batteryPackageVO.code }).then(res => {
          if (res.data.length !== 0) {
            this.$message.success('编号已存在')
          }
        })
      } else return
    },

    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      this.$refs.businessParamsVORef.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'ADD') {
            const businessParamsDTO = this.businessParamsVO
            addparameter(businessParamsDTO).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.businessParamsVO = {}
              }
            }).catch(error => {
              if (error?.response?.data?.head?.message.indexOf('Duplicate')) {
                this.$message.error('可能存在重复数据')
              }
            })
          } else if (this.dialogType === 'update') {
            const updatebusinessParamsDTO = this.businessParamsVO

            updateparameter(updatebusinessParamsDTO).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.businessParamsVO = {}
              }
            }).catch(error => {
              if (error?.response?.data?.head?.message.indexOf('Duplicate')) {
                this.$message.error('可能存在重复数据')
              }
            })
          }
        }
      })
    },

    initdialogdata() {

    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdparameter({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryparameter(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.paramslist = response.data// 分页信息带回显示
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
        this.$confirm('是否确定').then(res => {
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
      this.batchUpdateAuditStatus(arry)
    },
    disableHandle() {
      const arry = this.$refs.muiltitable.selection
      arry.map(item => {
        item.status = 0
      })
      this.batchUpdateAuditStatus(arry)
    },

    batchUpdateAuditStatus(arry) {
      batchUpdateparameter(arry).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.searchFormclick()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleClose() {
      this.$refs.businessParamsVORef.resetFields()
      this.dialogVisible = false
      this.businessParamsVO = {}
    },
    selectionChangeHandle(e) {
      if (e.length !== 0) {
        this.deletedisabled = false
      } else this.deletedisabled = true
    },
    // 批量删除
    deleteSelect() {
      this.$confirm('确定要删除吗？').then(res => {
        if (res === 'confirm') {
          batchRemoveparameter(this.$refs.muiltitable.selection).then(res => {
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
        this.businessParamsVO = res
        this.dialogVisible = true
        this.dialogType = 'ADD'
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.businessParamsVO = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
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
