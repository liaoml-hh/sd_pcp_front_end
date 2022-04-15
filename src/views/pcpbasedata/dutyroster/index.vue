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
              <el-select v-model="searchForm.dutyTypeId" clearable placeholder="请选择">
                <el-option
                  v-for="item in dutyTypeList"
                  :key="item.id"
                  size="mini"
                  :label="item.dutyType"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="站点">
              <el-select v-model="searchForm.stationId" clearable placeholder="请选择">
                <el-option
                  v-for="item in stationList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left: 20px;" size="medium" @click="searchFormclick">查询</el-button>
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
        :data="dutyRosterlist"
        border
        style="width: 100%;"
        fix
      >
        <el-table-column
          header-align="center"
          type="selection"
          align="center"
          width="40"
        />
        <el-table-column
          header-align="center"
          type="index"
          align="center"
          label="序号"
          width="80"
        > <template slot-scope="scope">
          <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
        </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          width="120"
          label="编号"
          prop="dutyTypeId"
        /> -->
        <el-table-column
          align="center"
          width="120"
          label="站点名称"
          prop="stationVO.name"
        />
        <el-table-column
          align="center"
          width="120"
          label="站点地址"
          prop="stationVO.address"
        />
        <el-table-column
          label="姓名"
          width="120"
          align="center"
          prop="name"
        />
        <el-table-column
          label="电话"
          width="120"
          align="center"
          prop="tel"
        />
        <el-table-column
          label="开始时间"
          width="160"
          align="center"
          prop="startTime"
        />
        <el-table-column
          label="结束时间"
          width="160"
          align="center"
          prop="endTime"
        />
        <el-table-column
          label="操作区"
          width="220"
          align="center"
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
        width="50%"
        style="text-align: center;"
      >
        <el-form ref="forName" :model="dutyVo" :rules="dutyRosterRules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="站点名称" prop="stationId" label-width="100px">
                <el-select v-model="dutyVo.stationId" style="width: 100%;" clearable placeholder="请选择">
                  <el-option
                    v-for="item in stationList"
                    :key="item.id"
                    size="mini"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型" prop="dutyTypeId" label-width="100px">
                <el-select v-model="dutyVo.dutyTypeId" style="width:100%" clearable placeholder="请选择">
                  <el-option
                    v-for="item in dutyTypeList"
                    :key="item.id"
                    size="mini"
                    :label="item.dutyType"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name" label-width="100px">
                <el-input v-model="dutyVo.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="tel" label-width="100px">
                <el-input v-model.number="dutyVo.tel" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="值班时间" label-width="100px">
                <el-date-picker
                  v-model="pickerupDateList"
                  type="daterange"
                  style="width:100%"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('forName')">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { commonQueryDutyType, addDutyType, updateDutyType, removeByIdDutyType, batchremoveDutyType, batchupdateDutyType } from '../../../api/dutytype/index'
import { commonQueryDutyRoster, addDutyRoster, updateDutyRoster, removeByIdDutyRoster, batchremoveDutyRoster, batchupdateDutyRoster, queryById } from '../../../api/dutyroster/index'
import { commonQueryStation, addStation, updateStation, removeByIdStation, batchRemoveStation } from '../../../api/station/station'
import moment from 'moment'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      dutyRosterlist: [],
      queryLoading: false,
      searchForm: {
        dutyTypeId: '',
        pageNum: 1,
        pageSize: 10
      },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      dutyTypeList: [],
      dialogType: '',
      dialogVisible: false,
      tableKey: true,
      temp: '',
      stationList: [],
      dutyVo: {},
      dutyDTO: {},
      pickerupDateList: [new Date(), new Date()],
      dutyRosterRules: {
        stationId: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
        dutyTypeId: [{ required: true, message: '值班类型不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '电话不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initdata()
    this.searchFormclick()
  },
  methods: {
    initdata() {
      commonQueryDutyType({ pageSize: 10000 }).then(res => {
        this.dutyTypeList = res.data
      })
      commonQueryStation({ pageSize: 10000 }).then(res => {
        this.stationList = res.data
      })
    },
    searchFormclick() {
      this.queryLoading = true
      commonQueryDutyRoster(this.searchForm).then(response => {
        const { total, pageNum, pageSize } = response
        this.commonPage.total = parseInt(total)
        // this.dutyTypeOptions = response.data
        this.dutyRosterlist = response.data
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
      this.pickerupDateList.length = 0
      this.pickerupDateList.push(new Date(), new Date())
      this.dialogType = 'ADD'
      this.dialogVisible = true
      commonQueryStation({ pageSize: 10000 }).then(res => {
        this.stationList = res.data
      })
    },
    //  增加或编辑
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            const dutyDTO = this.dutyVo
            const startTime = this.pickerupDateList[0]
            const endTime = this.pickerupDateList[1]
            dutyDTO.startTime = moment(startTime).format('YYYY-MM-DD')
            dutyDTO.endTime = moment(endTime).format('YYYY-MM-DD')
            if (this.dialogType === 'ADD') {
              addDutyRoster(dutyDTO).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
              })
            } else if (this.dialogType === 'update') {
              updateDutyRoster(dutyDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                  this.dutyVo = {}
                }
              })
            }
          }
        })
    },
    // 批量删除
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length !== 0) {
        this.$confirm('确认要删除吗？').then(res => {
          if (res === 'confirm') {
            batchremoveDutyRoster(this.$refs.muiltitable.selection).then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.searchFormclick()
              }
            }).catch(() => {
              this.$message.error('删除失败')
            })
          }
        })
      } else this.$message.info('未选中记录')
    },
    // 复制
    rowCopy(row) {
      queryById({ id: row.id }).then(res => {
        const v1 = moment(res.startTime).format('YYYY-MM-DD')
        const v2 = moment(res.endTime).format('YYYY-MM-DD')
        this.pickerupDateList.length = 0
        this.pickerupDateList.push(v1, v2)
        this.dutyVo = res
        this.dialogType = 'ADD'
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 编辑
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        const v1 = moment(res.startTime).format('YYYY-MM-DD')
        const v2 = moment(res.endTime).format('YYYY-MM-DD')
        this.pickerupDateList.length = 0
        this.pickerupDateList.push(v1, v2)
        this.dutyVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdDutyRoster({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
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
