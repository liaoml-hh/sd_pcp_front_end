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
            <el-form-item label="类型">
              <el-select v-model="searchForm.dutyType" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  size="mini"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left :20px;" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button>
      </div>
    </el-header>
    <el-main>
      <el-table
        ref="muiltitable"
        :data="dutyTypelist"
        style="width: 100%;"
        border
        fix
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="40"
        />
        <el-table-column
          type="index"
          label="序号"
          header-align="center"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="编号"
          prop="id"
          align="center"
          width="120"
        /> -->
        <el-table-column
          label="类型"
          prop="dutyType"
          align="center"
          width="120"
        />
        <el-table-column
          label="开始值班时间"
          prop="startTime"
          align="center"
          width="200"
        />
        <el-table-column
          label="结束值班时间"
          prop="endTime"
          align="center"
          width="200"
        />
        <el-table-column
          label="操作区"
          align="center"
          width="220"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="rowCopy(scope.row)">复制</el-button>
            <el-button size="mini" type="warning" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="float:left">
        <el-pagination
          :current-page.sync="commonPage.pageNum"
          :page-size="commonPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 15, 20, 30, 40, 50, 100]"
          :total="commonPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        :key="tableKey"
        v-dialogDrag
        :visible.sync="dialogVisible"
        title="添加信息"
        width="40%"
      >
        <el-form ref="formName" :model="dutyVo" :rules="rules">
          <el-row>
            <el-col :span="10">
              <el-form-item label="类型" prop="dutyType" label-width="100px">
                <el-select v-model="dutyVo.dutyType" style="width:100%" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    style="width:100%"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="值班时间" label-width="100px">
                <el-time-picker
                  v-model="pickerupTimeList"
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('formName')">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { commonQueryDutyType, addDutyType, updateDutyType, removeByIdDutyType, batchremoveDutyType, batchupdateDutyType, queryById } from '../../../api/dutytype/index'
const moment = require('moment')
export default {
  name: 'App',
  components: {},
  data() {
    return {
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      dutyTypelist: [],
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      dialogType: '',
      dialogVisible: false,
      tableKey: true,
      startTime: '',
      endTime: '',
      dutyVo: {},
      dutyDTO: {},
      options: [{
        value: '白班',
        label: '白班'
      }, {
        value: '晚班',
        label: '晚班'
      }],
      indexKey: null,
      pickerupTimeList: [new Date(), new Date()],
      rules: {
        dutyType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.searchFormclick()
  },
  methods: {
    searchFormclick() {
      this.queryLoading = true
      commonQueryDutyType(this.searchForm).then(response => {
        const { total, pageNum, pageSize } = response
        this.commonPage.total = parseInt(total)
        this.dutyTypelist = response.data
        this.queryLoading = false
      }).catch(() => {
        this.queryLoading = false
        this.$message.error('网络异常')
      })
    },
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.dutyVo = {}
      this.pickerupTimeList.length = 0
      this.pickerupTimeList.push(new Date(), new Date())
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    // 增加
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            const dutyDTO = this.dutyVo
            const startTime = this.pickerupTimeList[0]
            const endTime = this.pickerupTimeList[1]
            dutyDTO.startTime = moment(startTime).format('HH:mm:ss')
            dutyDTO.endTime = moment(endTime).format('HH:mm:ss')
            if (this.dialogType === 'ADD') {
              addDutyType(dutyDTO).then(response => {
                console.log(response, '添加数据')
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
              }).catch(() => {
                this.$message.error('可能存在重复数据,请检查')
              })
            } else if (this.dialogType === 'update') {
              const dutyDTO = this.dutyVo
              updateDutyType(dutyDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                  this.dutyVo = {}
                }
              }).catch(() => {
                this.$message.error('可能存在重复数据,请检查')
              })
            }
          }
        })
    },
    // 批量删除
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否批量删除', {
          center: true
        }).then(res => {
          if (res === 'confirm') {
            batchremoveDutyType(this.$refs.muiltitable.selection).then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.searchFormclick()
              }
            }).catch(() => {
              this.$message.error('删除失败')
            })
          }
        })
      }
    },
    // 编辑
    addOrUpdateHandle(row) {
      this.indexKey = null
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.dutyVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 删除
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdDutyType({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 复制
    rowCopy(row) {
      queryById({ id: row.id }).then(res => {
        const v1 = new Date('2021-11-11' + ' ' + res.startTime)
        const v2 = new Date('2021-11-11' + ' ' + res.endTime)
        this.pickerupTimeList.length = 0
        this.pickerupTimeList.push(v1, v2)
        this.dutyVo = res
        this.dialogType = 'ADD'
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
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
