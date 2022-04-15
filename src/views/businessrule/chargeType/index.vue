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
            <el-form-item label="名称">
              <el-input v-model="searchForm.name" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="searchForm.code" style="width:90%" clearable />
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium " @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div style="  margin-bottom:10px">
        <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button>

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

      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="chargetypelist"
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
          label="名称"
          min-width="90"
        />

        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注"
          min-width="120"
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
        <el-form ref="formName" :model="chargetypeVo" label-width="100px" :rules="rules">
          <el-row><el-col :span="12">
                    <el-form-item label="编号" prop="code">
                      <el-input v-model="chargetypeVo.code" placeholder="" :disabled="true" />
                    </el-form-item></el-col>
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input v-model="chargetypeVo.name" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row><el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="chargetypeVo.remark" placeholder="" @blur="testcode" />
            </el-form-item></el-col>

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
import { from } from '@chenfengyuan/vue-qrcode'
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryChargeType, addChargeType, removeByIdChargeType, batchRemoveChargeType, updateChargeType, batchUpdateChargeType, queryById } from '../../../api/chargetype/index'
import { commonQuerycode } from '../../../api/orderconfig/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      chargetypeVo: {
        code: '',
        name: '',
        remark: ''

      },
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      chargetypelist: [],
      chargetypeDTO: {},
      dialogType: '',
      dictionarytypelist: [],
      rules: {
        code: [
          {
            required: true, message: '请输入名称', trigger: 'blur'
          }
        ],
        name: [
          {
            required: true, message: '请输入名称', trigger: 'blur'
          }
        ]
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
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {},
  // 方法集合
  methods: {
    testcode() {

    },
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
      this.commonQuerycode()
    },
    commonQuerycode() {
      commonQuerycode({ id: '1408713586204868609' }).then(res => {
        this.chargetypeVo.code = res.prefix + res.currentSqno
      })
    },
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            if (this.dialogType === 'ADD') {
              const chargetypeDTO = this.chargetypeVo

              addChargeType(chargetypeDTO).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false

                this.searchFormclick()
              })
            } else if (this.dialogType === 'update') {
              const updatechargetypeDTO = this.chargetypeVo

              updateChargeType(updatechargetypeDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                }
              })
            }
          }
        })
    },
    rowCopy(row) {
      queryById({ id: row.id }).then(res => {
        this.chargetypeVo = res
        this.dialogType = 'ADD'
        this.commonQuerycode()
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
        removeByIdChargeType({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryChargeType(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.chargetypelist = response.data// 分页信息带回显示
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
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('确定要删除吗？', {
          center: true
        }).then(res => {
          if (res === 'confirm') {
            batchRemoveChargeType(this.$refs.muiltitable.selection).then(res => {
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

    selectionChangeHandle(row) {

    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.chargetypeVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    onDropdownCommand(methodName) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('没有选中任何数据')
      } else {
        this.$confirm('是否确定').then(res => {
          if (res === 'confirm') {
            this[methodName]()
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
      this.batchUpdateChargeTypeStatus(arry)
    },
    disableHandle() {
      const arry = this.$refs.muiltitable.selection
      arry.map(item => {
        item.status = 0
      })
      this.batchUpdateChargeTypeStatus(arry)
    },

    batchUpdateChargeTypeStatus(arry) {
      batchUpdateChargeType(arry).then(res => {
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
      Object.keys(this.chargetypeVo).map(key => {
        this.chargetypeVo[key] = ''
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
