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
            <el-form-item label="设备名称">
              <el-input v-model="searchForm.name" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="设备类型" prop="mechineType" label-width="90px">
              <!-- <el-input v-model="mechineVo.name" placeholder="" /> -->
              <el-select
                v-model="searchForm.mechineType"
                style="width:100%"
                clearable
                placeholder="设备类型"
              >
                <el-option
                  v-for="(item,index) in dictionarytypelist"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button>
        <el-dropdown
          split-button
          type="primary"
          style="margin-left: 5px; margin-right: 5px;"
          @command="onDropdownCommand"
        >
          启停控制
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="enable_command">启用</el-dropdown-item>
            <el-dropdown-item command="disable_command">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="machinelist"
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
          label="设备编号"
          min-width="90"
        />
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="设备名称"
          min-width="90"
        />
        <el-table-column
          prop="dictionaryTypeVO.name"
          header-align="center"
          align="center"
          label="设备类型"
          min-width="90"
        />

        <el-table-column
          prop="stationVO.address"
          header-align="center"
          align="center"
          label="所属站点"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="networkAddress"
          header-align="center"
          align="center"
          label="网络地址"
          show-overflow-tooltip
          min-width="120"
        />
        <el-table-column
          prop="sequenceNo"
          header-align="center"
          align="center"
          label="序列号"
          min-width="120"
        />
        <el-table-column
          prop="others"
          header-align="center"
          align="center"
          label="其他"
          min-width="120"
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
        :title="titleAction"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <el-form ref="machineRef" :model="mechineVo" :rules="rules">
          <el-row>
            <el-col span="12">
              <el-form-item label="设备编码" prop="code" label-width="90px">
                <el-input v-model="mechineVo.code" disabled placeholder="" />
              </el-form-item>

            </el-col>
            <el-col span="12">
              <el-form-item label="设备名称" label-width="120px" prop="dictionaryTypeId">
                <el-input v-model="mechineVo.name" placeholder="" />

              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col span="12">
              <el-form-item label="设备类型" prop="mechineType" label-width="90px">
                <!-- <el-input v-model="mechineVo.name" placeholder="" /> -->
                <el-select
                  v-model="mechineVo.mechineType"
                  style="width:100%"
                  clearable
                  placeholder="设备类型"
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
            <el-col span="12">

              <el-form-item label="站点" label-width="120px" prop="stationId">
                <el-select
                  v-model="mechineVo.stationId"
                  style="width:100%"
                  clearable
                  placeholder="站点"
                >
                  <el-option
                    v-for="(item) in stationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="12">
              <el-form-item label="网络地址" prop="name" label-width="90px">
                <el-input v-model="mechineVo.networkAddress" placeholder="" />
              </el-form-item>

            </el-col>
            <el-col span="12">

              <el-form-item label="序列号" label-width="120px" prop="sequenceNo">
                <el-input v-model="mechineVo.sequenceNo" placeholder="" />
                <!-- <el-select
                  v-model="mechineVo.sequenceNo"
                  style="width:100%"
                  clearable
                  placeholder="设备类型"
                >
                  <el-option
                    v-for="(item,index) in dictionarytypelist"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col span="12">
              <el-form-item label="其他" prop="others" label-width="90px">
                <el-input v-model="mechineVo.others" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item label="备注" label-width="120px" prop="remark">
                <el-input v-model="mechineVo.remark" placeholder="" />
                <!-- <el-select
                  v-model="mechineVo.dictionaryTypeId"
                  clearable
                  placeholder="设备类型"
                  style="width:100%"
                >
                  <el-option
                    v-for="(item,index) in dictionarytypelist"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('machineRef')">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { from } from '@chenfengyuan/vue-qrcode'
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQuerycode } from '@/api/orderconfig/index'
import { commonQueryDictionarytype } from '../../../api/dictionarytype/index'
import { commonQueryDictionary } from '../../../api/dictionary/index'
import { commonQueryStation } from '@/api/station/station'
import { commonQueryMachine, addMachine, updateMachine, batchRemoveMachine, removeByIdMachine, queryById, batchUpdateMachine } from '../../../api/machine/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      mechineVo: {
        code: '',
        name: '',
        mechineType: '',
        stationId: '',
        networkAddress: '',
        sequenceNo: '',
        others: '',
        remark: ''
      },
      stationList: [],
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      machinelist: [],
      mechineDTO: {},
      dialogType: '',
      titleAction: '',
      dictionarytypelist: [],

      rules: {
        code: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        dictionaryTypeId: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        mechineType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        stationId: [
          { required: true, message: '请选择站点', trigger: 'blur' }
        ],
        sequenceNo: [
          { required: true, message: '请输入设备序列号', trigger: 'blur' }
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

  // 方法集合
  methods: {
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.initStation()
      this.initcommonQuerycode()
      this.titleAction = '添加信息'
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    rowCopy(row) {
      if (this.$refs.muiltitable.selection.length > 1) {
        this.$message.error('不允许勾选多条记录')
      } else {
        this.initStation()
        queryById({ id: row.id }).then(res => {
          this.initcommonQuerycode()
          this.titleAction = '添加信息'
          this.dialogType = 'ADD'

          this.mechineVo = res
          this.dialogVisible = true
        }).catch(error => {
          console.log(error)
        })
      }
    },
    addOrUpdateHandle(row) {
      if (this.$refs.muiltitable.selection.length > 1) {
        this.$message.error('不允许勾选多条记录')
      } else {
        this.initStation()
        this.dialogType = 'update'
        queryById({ id: row.id }).then(res => {
          this.titleAction = '编辑信息'
          this.mechineVo = res
          this.dialogVisible = true
        }).catch(error => {
          console.log(error)
        })
      }
    },
    // 添加和编辑方法
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            if (this.dialogType === 'ADD') {
              const mechineDTO = this.mechineVo

              addMachine(mechineDTO).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.handleClose()
              })
            } else if (this.dialogType === 'update') {
              const mechineDTO = this.mechineVo

              updateMachine(mechineDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                  this.handleClose()
                }
              })
            }
          }
        })
    },
    initdialogdata() {
      commonQueryDictionarytype({ pageSize: 1000 }).then(res => {
        this.dictionarytypelist = res.data
      })
    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', {
        center: true
      }).then(res => {
        if (res === 'confirm') {
          removeByIdMachine({ id: val.id }).then(response => {
            if (response) {
              this.$message.success('操作成功')
            }
            this.searchFormclick()
          })
        }
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
            batchRemoveMachine(this.$refs.muiltitable.selection).then(res => {
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
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonQueryMachine(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.machinelist = response.data// 分页信息带回显示
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

    initcommonQuerycode() {
      commonQuerycode({ id: '1408713586204868609' }).then(res => {
        this.mechineVo.code = res.currentSqno
      }).catch(error => {
        console.log(error)
      })
    }, // 如果页面有keep-alive缓存功能，这个函数会触发
    handleClose() {
      this.dialogVisible = false
      this.$refs.machineRef.resetFields()
      Object.keys(this.mechineVo).map(key => { this.mechineVo[key] = '' })
    },
    initStation() {
      commonQueryStation({ pageSize: 1000 }).then(res => {
        this.stationList = res.data
      })
    },
    onDropdownCommand(command) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否确认操作', { center: true }).then(res => {
          if (res === 'confirm') {
            this[command]()
          }
        })
      }
    },
    enable_command() {
      this.doCommand(1)
    },
    disable_command() {
      this.doCommand(0)
    },
    doCommand(status) {
      let data = []
      this.$refs.muiltitable.selection.map(item => {
        const { id, version } = item
        data.push({ id, version, status })
      })
      batchUpdateMachine(data).then(res => {
        if (res) {
          this.$message.success('操作成功')
          this.searchFormclick()
        } else this.$message.success('操作失败')
      })
    },
    selectionChangeHandle() {

    }
  }
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
