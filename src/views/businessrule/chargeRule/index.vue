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
            <el-form-item label="区域">
              <el-input v-model="searchForm.areaName" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="计费类型">
              <el-select
                v-model="searchForm.chargeTypeId"
                clearable
                placeholder="收费类型"
              >
                <el-option
                  v-for="(item,index) in chargerulelist"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-input v-model="searchForm.mechineType" style="width:90%" clearable size="mini" /> -->
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div style="  margin-bottom:10px">
        <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect">删除</el-button>
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
        ref="mutiltable"
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
          width="60"
          type="index"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="code"
          header-align="center"
          align="center"
          label="编号"
          min-width="110"
        />
        <el-table-column
          sortable
          prop="chargeTypeVO.name"
          header-align="center"
          align="center"
          label="收费类型"
          min-width="120"
        />
        <el-table-column
          sortable
          prop="maxValue"
          header-align="center"
          align="center"
          label="最大值"
          min-width="90"
        />
        <el-table-column
          sortable
          prop="minValue"
          header-align="center"
          align="center"
          label="最小值"
          min-width="90"
        />
        <!-- <el-table-column
          prop="condition"
          header-align="center"
          align="center"
          label="条件"
          min-width="90"
        /> -->
        <el-table-column
          sortable
          prop="basic"
          header-align="center"
          align="center"
          label="基准(元)"
          min-width="100"
        />
        <el-table-column
          sortable
          prop="discount"
          header-align="center"
          align="center"
          label="折扣"
          min-width="80"
        />
        <el-table-column
          sortable
          prop="preferentialPrice"
          header-align="center"
          align="center"
          label="优惠电价(元)"
          min-width="140"
        />
        <el-table-column
          prop="areaName"
          header-align="center"
          align="center"
          label="区域名称"
          min-width="120"
        />
        <el-table-column
          prop="crestValue"
          header-align="center"
          align="center"
          label="峰段"
          min-width="120"
        />
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="开始时间"
          min-width="120"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.startTime|fromatTime(scope.row.startTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          header-align="center"
          align="center"
          label="结束时间"
          min-width="120"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.endTime|fromatTime(scope.row.endTime) }}</div>
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
        width="80%"
        :before-close="handleClose"
      >
        <div style="margin-left:-30px;">
          <el-form ref="formName" :model="mechineVo" label-width="100px" :rules="updataformrules">
            <el-row>

              <el-col :span="12">
                <el-form-item label="编码" prop="code">
                  <el-input v-model="mechineVo.code" placeholder="" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收费类型" prop="chargeTypeId">

                  <el-select
                    v-model="mechineVo.chargeTypeId"
                    clearable
                    style="width:100%"
                    placeholder="收费类型"
                  >
                    <el-option
                      v-for="(item,index) in chargerulelist"
                      :key="index"
                      size="medium"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="最大值" prop="maxValue">
                  <el-input v-model="mechineVo.maxValue" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最小值" prop="minValue">
                  <el-input v-model="mechineVo.minValue" placeholder="" />
                </el-form-item>

              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="12">
              <el-form-item label="条件">
                <el-input v-model="mechineVo.condition" style="width: 220px;margin-left:-25px;" placeholder="" />
              </el-form-item>
            </el-col> -->
              <el-col :span="12">
                <el-form-item label="折扣" prop="discount">
                  <el-input v-model="mechineVo.discount" value="1" />
                </el-form-item>

              </el-col>
              <el-col :span="12">
                <el-form-item label="优惠电价" prop="preferentialPrice">
                  <el-input v-model="mechineVo.preferentialPrice" value="0" />
                </el-form-item>

              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="基准" prop="basic">
                  <el-input v-model="mechineVo.basic" value="1" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="区域名称" prop="areaName">
                  <!-- <el-input v-model="mechineVo.areaName" /> -->
                  <el-select
                    v-model="mechineVo.areaName"
                    filterable
                    remote
                    placeholder="请输入关键词"
                    :remote-method="searchAreaName"
                    :loading="searchLoading"
                    style="width:100%"
                  >
                    <el-option v-for="item in areaNamelist" :key="item.id" :label="item.province +'  '+ item.city +'  '+ item.area" :value="item.province + item.city + item.area" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="峰段" prop="crestValue">
                  <el-input v-model="mechineVo.crestValue" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开始时间=结束时间" prop="crestValue" label-width="25%">
                  <el-time-picker
                    v-model="pickerTimeList"
                    style="width:100%"
                    is-range
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                  />
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click=" onBtnCancelClick">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('formName')">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryChargeType } from '@/api/chargetype/index'
import { commonQuerycode } from '@/api/orderconfig/index'
import { commonQueryArea } from '@/api/area/area'
import { commonQueryChargeRule, addChargeRule, removeByIdChargeRule, batchRemove, queryById, updateChargeRule, batchUpdate } from '@/api/chargerule/index'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  filters: {
    fromatTime(value) {
      value = new Date(value)
      return `${value.getHours() > 9 ? value.getHours() : '0' + value.getHours()}:${value.getMinutes() > 9 ? value.getMinutes() : '0' + value.getMinutes()}:${value.getSeconds() > 9 ? value.getSeconds() : '0' + value.getSeconds()}`
    }
  },
  data() {
    // 这里存放数据
    return {

      searchLoading: false,
      areaNamelist: [],
      tempAreaNameList: [],
      mechineVo: {
        code: '',
        chargeTypeId: '',
        maxValue: '',
        minValue: '',
        discount: 1,
        preferentialPrice: '',
        basic: 1,
        areaName: '',
        crestValue: '',
        startTime: '',
        endTime: ''
      },
      pickerTimeList: [],
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      machinelist: [],
      mechineDTO: {},
      dialogType: '',
      chargerulelist: [],
      updataformrules: {
        code: [
          { required: true, message: '请输入折扣', trigger: 'blur' }
        ],
        chargeTypeId: [
          { required: true, message: '请选中收费类型', trigger: 'blur' }
        ],
        maxValue: [
          { required: true, message: '请输入最大值', trigger: 'blur' },
          { message: '请输入正确格式 如:12.2', trigger: 'blur', pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/ }
        ],
        minValue: [
          { required: true, message: '请输入最小值', trigger: 'blur' },
          { message: '请输入正确格式 如:12.2', trigger: 'blur', pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/ }
        ],
        discount: [
          { required: true, message: '请输入折扣,没有折扣为1', trigger: 'blur' },
          { message: '请输入正确格式 如:12.2', trigger: 'blur', pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/ }
        ],

        preferentialPrice: [
          { required: true, message: '请输入优惠价格，不优惠为0', trigger: 'blur' },
          { message: '请输入正确格式 如:12.2', trigger: 'blur', pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/ }
        ],
        basic: [
          { required: true, message: '请输入基准', trigger: 'blur' },
          { message: '请输入正确格式 如:1.2', trigger: 'blur', pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/ }

        ],
        areaName: [
          { required: true, message: '请输入区域', trigger: 'blur' }
        ],
        crestValue: [
          { required: true, message: '请输入峰段', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请输入开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.commonQueryAreaList()
    this.searchFormclick()
    this.initdialogdata()
  },
  methods: {
    onQuery() {
      this.searchFormclick()
    },
    commonQuerycode() {
      commonQuerycode({ id: '1408713586204868609' }).then(res => {
        this.mechineVo.code = res.prefix + res.currentSqno
      })
    },
    add() {
      this.dialogType = 'ADD'
      this.pickerTimeList.length = 0
      this.pickerTimeList.push(...[new Date(), new Date()])
      this.commonQuerycode()
      this.$set(this.mechineVo, 'discount', 1)
      this.$set(this.mechineVo, 'preferentialPrice', 0)
      this.$set(this.mechineVo, 'basic', 1)
      this.dialogVisible = true
    },
    // 添加和编辑方法
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            const mechineDTO = this.mechineVo
            let startTime = this.pickerTimeList[0]
            let endTime = this.pickerTimeList[1]

            mechineDTO.startTime = `2021-01-01 ${startTime.getHours() > 9 ? startTime.getHours() : '0' + startTime.getHours()}:${startTime.getMinutes() > 9 ? startTime.getMinutes() : '0' + startTime.getMinutes()}:${startTime.getSeconds() > 9 ? startTime.getSeconds() : '0' + startTime.getSeconds()}`
            mechineDTO.endTime = `2021-01-01 ${endTime.getHours() > 9 ? endTime.getHours() : '0' + endTime.getHours()}:${endTime.getMinutes() > 9 ? endTime.getMinutes() : '0' + endTime.getMinutes()}:${endTime.getSeconds() > 9 ? endTime.getSeconds() : '0' + endTime.getSeconds()}`
            if (this.dialogType === 'ADD') {
              addChargeRule(mechineDTO).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
              })
            } else if (this.dialogType === 'update') {
              updateChargeRule(mechineDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                }
                this.searchFormclick()
              })
            }
          }
        })
    },
    onBtnCancelClick() {
      this.dialogVisible = false
      Object.keys(this.mechineVo).map(key => {
        this.mechineVo[key] = ''
      })
    },

    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', {
        center: true
      }).then(res => {
        removeByIdChargeRule({ id: val.id }).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.searchFormclick()
          } else this.searchFormclick()
        })
      })
    },
    initdialogdata() {
      commonQueryChargeType({ pageSize: 1000 }).then(res => {
        this.chargerulelist = res.data
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonQueryChargeRule(this.searchForm).then(response => {
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
    deleteSelect() {
      if (this.$refs.mutiltable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否批量删除', {
          center: true
        }).then(res => {
          if (res === 'confirm') {
            const datalist = []
            this.$refs.mutiltable.selection.map(item => {
              const { id, version } = item
              datalist.push({ id, version })
            })
            batchRemove(datalist).then(res => {
              if (res) {
                this.$message.success('删除成功')
              } else this.$message.warning('删除失败')
              this.searchFormclick()
            })
          }
        })
      }
    },
    selectionChangeHandle(e) {
      console.log('selectionChangeHandle')
    },
    addOrUpdateHandle(val) {
      if (this.$refs.mutiltable.selection.length > 1) {
        this.$message.error('不允许勾选多条记录')
      } else {
        queryById({ id: val.id }).then(res => {
          this.mechineVo = res
          this.pickerTimeList.length = 0
          this.pickerTimeList.push(...[new Date(res.startTime), new Date(res.endTime)])
          this.dialogType = 'update'
          this.dialogVisible = true
        })
      }
    },
    rowCopy(val) {
      if (this.$refs.mutiltable.selection.length > 1) {
        this.$message.error('不允许勾选多条记录')
      } else {
        queryById({ id: val.id }).then(res => {
          this.mechineVo = res
          this.pickerTimeList.length = 0
          this.pickerTimeList.push(...[new Date(res.startTime), new Date(res.endTime)])
          this.dialogType = 'ADD'
          this.commonQuerycode()
          this.dialogVisible = true
        })
      }
    },

    handleClose() {
      this.dialogVisible = false
      Object.keys(this.mechineVo).map(key => {
        this.mechineVo[key] = ''
      })
    },
    searchAreaName(key) {
      this.searchLoading = true
      this.areaNamelist = this.tempAreaNameList.filter(item => {
        return (item.province + item.city + item.area).toUpperCase().indexOf(key.toUpperCase()) > -1
      })

      this.searchLoading = false
    },
    commonQueryAreaList() {
      commonQueryArea({ pageSize: 1000 }).then(res => {
        this.tempAreaNameList = res.data
      })
    },
    onDropdownCommand(methodName) {
      if (this.$refs.mutiltable.selection.length === 0) {
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
      const arry = this.$refs.mutiltable.selection
      arry.map(item => {
        item.status = 1
      })
      this.batchUpdateAuditStatus(arry)
    },
    disableHandle() {
      const arry = this.$refs.mutiltable.selection
      arry.map(item => {
        item.status = 0
      })
      this.batchUpdateAuditStatus(arry)
    },
    batchUpdateAuditStatus(arry) {
      batchUpdate(arry).then(res => {
        if (res) {
          this.searchFormclick()
          this.$message.success('更新成功')
        }
      }).catch(error => {
        console.log(error)
        this.$message.error('更新失败')
      })
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
