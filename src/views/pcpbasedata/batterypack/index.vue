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
              <el-input
                v-model="searchForm.code"
                style="width:90%"
                clearable
              />
            </el-form-item>
            <el-form-item label="电池类型">
              <!-- <el-input v-model="searchForm.batteryType" style="width:90%" clearable size="mini" /> -->
              <el-select
                v-model="searchForm.batteryType"
                clearable
                placeholder="电池类型"
              >
                <el-option
                  v-for="(item,index) in dictionarytypelist"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
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
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >增加</el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="deletedisabled"
          @click="deleteSelect"
        >删除</el-button>
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
        :data="packlist"
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
          prop="batteryType"
          header-align="center"
          align="center"
          label="电池类型"
          min-width="90"
        />
        <el-table-column
          prop="packpageName"
          header-align="center"
          align="center"
          label="包名"
          min-width="90"
        />
        <!-- <el-table-column
          prop="params"
          header-align="center"
          align="center"
          label="参数"
          min-width="120"
        /> -->
        <el-table-column
          prop="batteryId"
          header-align="center"
          align="center"
          label="电池Id"
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
            <el-tag
              v-if="scope.row.status === 0"
              type="danger"
            >停用</el-tag>
            <el-tag
              v-else
              type="success"
            >启用</el-tag>
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
        <el-form ref="packageFromRef" :rules="myrules" :model="batteryPackageVO">
          <el-row>
            <el-col :span="12">
              <el-form-item label="编号" prop="code" label-width="100px">
                <el-input
                  v-model="batteryPackageVO.code"

                  placeholder=""
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电池类型" prop="batteryType" label-width="100px">
                <el-select
                  v-model="batteryPackageVO.batteryType"
                  clearable
                  style="width:100%"
                  placeholder=""
                >
                  <el-option
                    v-for="(item,index) in dictionarytypelist"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="包名" prop="packpageName" label-width="100px">
                <el-input
                  v-model="batteryPackageVO.packpageName"

                  placeholder=""
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数" label-width="100px">
                <el-input
                  v-model="batteryPackageVO.params"
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
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>

import {
  commonQueryBatterypackage,
  addBatterypackage,
  updateBatterypackage,
  batchUpdateBatterypackage,
  removeByIdBatterypackage,
  batchRemoveBatterypackage,
  queryById,
  checkNamekExist
} from '../../../api/batteryPack/index'
import { commonQueryDictionary } from '../../../api/dictionary/index'
import { commonQuerycode } from '@/api/orderconfig/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('包名不能为空'))
      } else {
        checkNamekExist({ packageName: value }).then(res => {
          if (res) return callback(new Error('包名重复'))
          else return callback()
        })
      }
    }
    var validateType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('类型不能为空'))
      } else callback()
    }

    // 这里存放数据
    return {
      batteryPackageVO: {
        code: '',
        batteryType: '',
        packpageName: ''
      },
      deletedisabled: true,
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      packlist: [],
      batteryPackageDTO: {},
      dialogType: '',
      dictionarytypelist: [],
      myrules: {

        code: [
          { validator: validateType, trigger: 'blur' },
          { required: true, message: '请选择编码', trigger: 'blur' }
        ],
        batteryType: [
          { validator: validateType, trigger: 'blur' },
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        packpageName: [
          { validator: validateName, trigger: 'blur' },
          { required: true, message: '请输入包名', trigger: 'blur' }
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
    this.initdialogdata()
  },

  methods: {
    onQuery() {
      this.searchFormclick()
    },
    testcode() {
      if (this.batteryPackageVO.code.length !== 0) {
        commonQueryBatterypackage({ code: this.batteryPackageVO.code }).then(res => {
          if (res.data.length !== 0) {
            this.$message.success('编号已存在')
          }
        })
      } else return
    },
    initdialogdata() {
      commonQueryDictionary({ pageSize: 1000, dictionaryTypeId: '1461525103069233152' }).then(res => {
        this.dictionarytypelist = res.data
      })
    },
    add() {
      commonQuerycode({ id: '1408713586204868609' }).then(res => {
        Object.keys(this.batteryPackageVO).map(key => {
          this.batteryPackageVO[key] = ''
        })
        const configNo = res.prefix + res.currentSqno
        this.batteryPackageVO.code = configNo
        this.dialogType = 'ADD'
        this.dialogVisible = true
      })
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      this.$refs.packageFromRef.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'ADD') {
            const batteryPackageDTO = this.batteryPackageVO
            addBatterypackage(batteryPackageDTO).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.batteryPackageVO = {}
                this.$refs.packageFromRef.resetFields()
              }
            })
          } else if (this.dialogType === 'update') {
            const updateauditdto = this.batteryPackageVO
            updateBatterypackage(updateauditdto).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.batteryPackageVO = {}
                this.$refs.packageFromRef.resetFields()
              }
            })
          }
        }
      })
    },

    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', {
        center: true,
        type: 'warning'
      }).then(res => {
        if (res === 'confirm') {
          removeByIdBatterypackage({ id: val.id }).then(response => {
            this.$message.success('操作成功')
            this.searchFormclick()
          })
        }
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryBatterypackage(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.packlist = response.data// 分页信息带回显示
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
        this.$confirm('是否确定', {
          center: true,
          type: 'warning'
        }).then(res => {
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
      batchUpdateBatterypackage(arry).then(res => {
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
      this.$refs.packageFrom.resetFields()
      Object.keys(this.batteryPackageVO).map(key => {
        this.batteryPackageVO[key] = ''
      })
    },
    selectionChangeHandle(e) {
      if (e.length !== 0) {
        this.deletedisabled = false
      } else this.deletedisabled = true
    },
    // 批量删除
    deleteSelect() {
      this.$confirm('确定要删除吗？', {
        center: true,
        type: 'warning'
      }).then(res => {
        if (res === 'confirm') {
          batchRemoveBatterypackage(this.$refs.muiltitable.selection).then(res => {
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
      if (this.$refs.muiltitable.selection.length > 1) {
        this.$message.error('不允许勾选多条记录')
      } else {
        queryById({ id: row.id }).then(res => {
          this.batteryPackageVO = res
          commonQuerycode({ id: '1408713586204868609' }).then(res => {
            const configNo = res.prefix + res.currentSqno
            this.batteryPackageVO.code = configNo
            this.dialogType = 'ADD'
            this.dialogVisible = true
          })
        }).catch(error => {
          console.log(error)
        })
      }
    },
    addOrUpdateHandle(row) {
      if (this.$refs.muiltitable.selection.length > 1) {
        this.$message.error('不允许勾选多条记录')
      } else {
        this.dialogType = 'update'
        queryById({ id: row.id }).then(res => {
          this.batteryPackageVO = res
          this.dialogVisible = true
        }).catch(error => {
          console.log(error)
        })
      }
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
