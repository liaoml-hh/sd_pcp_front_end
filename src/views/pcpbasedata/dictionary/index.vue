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
            <el-form-item label="字典类型">
              <el-select v-model="searchForm.dictionaryTypeId" placeholder="" clearable>
                <el-option v-for="item in dictionarytypelist" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <!-- <el-input v-model="searchForm.dictionaryTypeId" style="width:90%" clearable size="mini" /> -->
            </el-form-item>
            <el-form-item label="字典名称">
              <el-input v-model="searchForm.name" style="width:90%" clearable />
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium " @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button>
        <!-- <el-button type="primary" icon="el-icon-document" @click="copy()">复制</el-button> -->

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
        :data="dictionarylist"
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
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="dictionaryTypeVO.name"
          header-align="center"
          align="center"
          label="字典类型"
          min-width="90"
        />
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="字典名称"
          min-width="90"
        />

        <el-table-column
          prop="value"
          header-align="center"
          align="center"
          label="值"
          min-width="90"
        />

        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注"
          min-width="120"
        >
          <template slot-scope="{row}">
            <span>
              {{ row.remark!==''?row.remark:'无' }}
            </span>
          </template>
        </el-table-column>
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
        <el-form ref="formName" :model="dictionaryVo" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="字典类型" label-width="100px" prop="dictionaryTypeId">
                <el-select
                  v-model="dictionaryVo.dictionaryTypeId"
                  clearable
                  placeholder="字典类型"
                  style="width:100%"
                >
                  <el-option
                    v-for="(item,index) in dictionarytypelist"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="字典名称" label-width="100px" prop="name">
                <el-input v-model="dictionaryVo.name" placeholder="" />
              </el-form-item>

            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label-width="100px" label="值">
                <el-input v-model="dictionaryVo.value" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="100px" label="备注">
                <el-input v-model="dictionaryVo.remark" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('formName')">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryDictionarytype } from '../../../api/dictionarytype/index'
import { commonQueryDictionary, addDictionary, updateDictionary, queryById, batchRemoveDictionary, removeByIdDictionary, batchUpdateDictionary } from '../../../api/dictionary/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      formLabelWidth: '70px',
      dictionaryVo: {},
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: {

        pageNum: 1, pageSize: 10
      },
      commonPage: { total: 0, pageCount: 0, pageSize: 10 },
      dictionarylist: [],
      dictionaryDTO: {},
      dialogType: '',
      rules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        dictionaryTypeId: [{ required: true, message: '请选择字典类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入字典名', trigger: 'blur' }]
      },
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
    this.initdialogdata()
  },

  methods: {
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    rowCopy(row) {
      queryById({ id: row.id }).then(res => {
        this.dictionaryVo = res
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
            batchRemoveDictionary(this.$refs.muiltitable.selection).then(res => {
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
              const dictionaryDTO = this.dictionaryVo
              addDictionary(dictionaryDTO).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.dictionaryVo = {}
              }).catch(error => {
                this.$message.error('网络错误')
                console.log(error)
              })
            } else if (this.dialogType === 'update') {
              const dictionaryDTO = this.dictionaryVo

              updateDictionary(dictionaryDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                  this.dictionaryVo = {}
                }
              })
            }
          }
        })
    },
    // 编辑方法
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.dictionaryVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdDictionary({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    initdialogdata() {
      commonQueryDictionarytype({ pageSize: 1000 }).then(res => {
        this.dictionarytypelist = res.data
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryDictionary(this.searchForm).then(response => {
        const { total, pageNum, pageSize } = response
        this.commonPage.total = parseInt(total) || 0
        this.dictionarylist = response.data
        this.queryLoading = false
      }).catch(() => {
        this.queryLoading = false
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
      batchUpdateDictionary(arry).then(res => {
        if (res) {
          this.searchFormclick()
          this.$message.success('更新成功')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('更新失败')
      })
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
