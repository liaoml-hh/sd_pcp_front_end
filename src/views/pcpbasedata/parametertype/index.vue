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
              <el-input v-model="searchForm.typeName" style="width:90%" clearable />
            </el-form-item>

            <el-button v-loading="queryLoading" type="primary" style="margin-top:2px;margin-left:20px" @click="searchFormclick">查询</el-button>
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
            <el-dropdown-item command="enableHandle">启用</el-dropdown-item>
            <el-dropdown-item command="disableHandle">停用</el-dropdown-item>
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
        :data="paramstypelist"
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
          prop="typeName"
          header-align="center"
          align="center"
          label="参数名称"
          min-width="145"
          show-overflow-tooltip
        />
        <el-table-column
          prop="typeValue"
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
          <el-form ref="formName" :model="businessParamsTypeVO" label-width="100px" :rules="rules">
            <el-row><el-col :span="12"><el-form-item label="编号" prop="code">
                      <el-input v-model="businessParamsTypeVO.code" placeholder="" />
                    </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="参数类型" prop="typeName">
                  <el-input v-model="businessParamsTypeVO.typeName" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row><el-col :span="12"><el-form-item label="参数值" prop="typeValue">
                      <el-input v-model="businessParamsTypeVO.typeValue" placeholder="" />
                    </el-form-item></el-col>
              <el-col :span="12">
                <el-form-item label="描述">
                  <el-input v-model="businessParamsTypeVO.paramsDescription" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('formName')">确 定</el-button>
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
  commonQueryparametertype,
  addparametertype,
  updateparametertype,
  batchUpdateparametertype,
  removeByIdparametertype,
  batchRemoveparametertype,
  queryById } from '../../../api/businessParamstype/index'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      businessParamsTypeVO: {},
      deletedisabled: true,
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      paramstypelist: [],
      businessParamsTypeDTO: {},
      dialogType: '',
      dictionarytypelist: [],
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        typeName: [{ required: true, message: '请输入参数类型', trigger: 'blur' }],
        typeValue: [{ required: true, message: '请输入参数值', trigger: 'blur' }]
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
    testcode() {
      if (this.batteryPackageVO.code.length !== 0) {
        commonQueryparametertype({ code: this.batteryPackageVO.code }).then(res => {
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
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            if (this.dialogType === 'ADD') {
              const businessParamsTypeDTO = this.businessParamsTypeVO
              addparametertype(businessParamsTypeDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                  this.businessParamsTypeVO = {}
                }
              }).catch(error => {
                if (error?.response?.data?.head?.message.indexOf('Duplicate')) {
                  this.$message.error('可能存在重复数据')
                }
              })
            } else if (this.dialogType === 'update') {
              const updatebusinessParamsTypeDTO = this.businessParamsTypeVO
              updateparametertype(updatebusinessParamsTypeDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                  this.businessParamsTypeVO = {}
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
        removeByIdparametertype({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryparametertype(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.paramstypelist = response.data// 分页信息带回显示
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
      batchUpdateparametertype(arry).then(res => {
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
      this.businessParamsTypeVO = {}
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
          batchRemoveparametertype(this.$refs.muiltitable.selection).then(res => {
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
        this.businessParamsTypeVO = res
        this.dialogType = 'ADD'
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.businessParamsTypeVO = res
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
