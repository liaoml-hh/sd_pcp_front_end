<template>
  <el-container>
    <el-header style="height:50px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="onQuery"
          >
            <el-form-item label="编号">
              <el-input v-model="searchForm.stationCode" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="searchForm.stationName" style="width:90%" clearable />
            </el-form-item>
            <!-- <el-form-item label="服务商">
              <el-input v-model="searchForm.spn" style="width:90%" clearable size="mini" />
            </el-form-item> -->
            <el-button v-loading="queryLoading" type="primary" style="margin-top:2px;margin-left:20px" size="medium " @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button> -->
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        :data="mqttConfiglist"
        style="width: 100%;"
        border
        fix

        :expand-row-keys="expands"
        :row-key="getRowKeys"
        @expand-change="detailExpandHandle"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="40"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="40"
          type="index"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :key="Math.random()"
          type="expand"
          class="siteDescription"
          align="center"
          width="80"
          label="明细"
        >
          <template slot-scope>
            <div>
              <el-table
                style="width: 100%;margin-left:30px;"
                border
                :data="temp"
              >
                <el-table-column
                  label="序号"
                  align="center"
                  width="80"
                  type="index"
                />
                <el-table-column
                  prop="fieldName"
                  label="属性名称"
                  align="center"
                  width="240"
                >    <template slot-scope="scope">
                  <div v-show="indexKey!==scope.row.id">{{ scope.row.fieldName }}</div>
                  <input v-show="indexKey===scope.row.id" v-model="fieldName" style="font-size:130%;">
                </template>
                </el-table-column>

                <el-table-column
                  prop="name"
                  label="参数"
                  align="center"
                  width="240"
                >
                  <template slot-scope="scope">
                    <div v-show="indexKey!==scope.row.id">{{ scope.row.name }}</div>
                    <input v-show="indexKey===scope.row.id" v-model="name" style="font-size:130%;">
                  </template>
                </el-table-column>
                <el-table-column
                  prop="paramValue"
                  label="属性值"
                  align="center"
                  width="250"
                >
                  <template slot-scope="scope">
                    <div v-show="indexKey!==scope.row.id">{{ scope.row.paramValue }}</div>
                    <input v-show="indexKey===scope.row.id" v-model="paramValue" style="font-size:130%;">
                  </template>
                </el-table-column>
                <el-table-column label="操作区">
                  <template slot-scope="scope">
                    <el-button
                      v-show="indexKey===scope.row.id"
                      size="mini"
                      type="info"
                      @click="indexKey=null"
                    >
                      取消
                    </el-button>
                    <el-button
                      v-show="indexKey!==scope.row.id"
                      size="mini"
                      type="warning"
                      @click="showInput(scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      v-show="indexKey===scope.row.id"
                      size="mini"
                      type="primary"
                      @click="saveConfig(scope.row)"
                    >
                      保存
                    </el-button>

                  </template>
                </el-table-column>
              </el-table>
            </div>

          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="stationId"
          header-align="center"
          align="center"
          label="站点"
          min-width="80"
        /> -->
        <el-table-column
          prop="stationCode"
          header-align="center"
          align="center"
          label="换电站编号"
          min-width="80"
        />
        <!-- <el-table-column
          prop="stationModel"
          header-align="center"
          align="center"
          label="换电站类型"
          min-width="80"
        /> -->
        <el-table-column
          prop="stationName"
          header-align="center"
          align="center"
          label="换电站名称"
          min-width="80"
        />
        <!-- <el-table-column
          prop="spn"
          header-align="center"
          align="center"
          label="服务商名称"
          min-width="90"
        /> -->

        <!-- 操作区 -->

        <!--
        <el-table-column

          header-align="center"
          align="center"
          min-width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="rowCopy(scope.row)"
            >
              复制
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="addOrUpdateHandle(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteHandle(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      -->

      </el-table>
      <div style="float:left;">
        <el-pagination
          :current-page.sync="commonPage.pageNum"
          :page-size="commonPage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10,15, 20, 30, 40,50,100]"
          :total="commonPage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        :key="tableKey"
        v-dialogDrag
        title="添加信息"
        width="65%"
        :visible.sync="dialogVisible"
      >
        <el-form :inline="true" :model="mqttVo">

          <el-row>
            <!-- <el-col span="8" style="margin-left:12px">
              <el-form-item label="站点">
                <el-input v-model="mqttVo.stationId" placeholder="" />
              </el-form-item>
            </el-col> -->
            <el-col span="9" style="margin-left:-8px">
              <el-form-item label="换电站编号">
                <el-input v-model="mqttVo.stationCode" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!-- <el-col span="9" style="margin-left:-25px">
              <el-form-item label="换电站类型">
                <el-input v-model="mqttVo.stationModel" placeholder="" />
              </el-form-item>
            </el-col> -->
            <el-col span="9" style="margin-left:-5px">
              <el-form-item label="换电站名称">
                <el-input v-model="mqttVo.stationName" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <!-- <el-col span="9" style="margin-left:-25px">
              <el-form-item label="服务商名称">
                <el-input v-model="mqttVo.spn" placeholder="" />
              </el-form-item>
            </el-col> -->
          </el-row>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { commonQueryMqttconfig, addMqttconfig, updateMqttconfig, removeByIdMqttconfig, batchRemoveMqttconfig, batchUpdateMqttconfig, queryById } from '../../../api/mqttconfig/mqttconfig'
import { commonQueryMqttconfigdetail, addMqttconfigdetail, updateMqttconfigdetail, removeByIdMqttconfigdetail, batchRemoveMqttconfigdetail, batchUpdateMqttconfigdetail, testSendMqttconfig } from '../../../api/mqttconfigdetail/mqttconfigdetail'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      temp: [],
      indexKey: null,
      searchForm: { pageNum: 1, pageSize: 10 },
      mqttVo: {},
      tableKey: true,
      expands: [],
      dialogType: '',
      dialogVisible: false,
      mqttDTO: {},
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      queryLoading: false,
      mqttConfiglist: [],
      getRowKeys(row) { // 行id
        return row.id
      },
      fieldName: '',
      name: '',
      paramValue: ''
    }
  },
  mounted() {
    this.searchFormclick()
  },
  methods: {

    saveConfig(row) {
      this.$confirm('请谨慎操作！该数据会同步换电站').then(res => {
        if (res === 'confirm') {
          const { id, version, stationId, mqttConfigId } = row
          updateMqttconfigdetail({ mqttConfigId, id, version, stationId, name: this.name, fieldName: this.fieldName, paramValue: this.paramValue }).then(res => {
            if (res) {
              commonQueryMqttconfigdetail({ mqttConfigId: row.mqttConfigId, pageNum: 1, pageSize: 10000 }).then(res => {
                this.temp = res.data
              })
              this.$message.success('操作成功')
            }
          })
        }
      })
    },
    // 初始化输入框
    showInput(row) {
      this.fieldName = row.fieldName
      this.name = row.name
      this.paramValue = row.paramValue
      this.indexKey = row.id
    },

    onQuery() {
      this.searchFormclick()
    },
    detailExpandHandle(row, expandedRows) {
      this.indexKey = null
      // 全屏遮罩加载显示

      // this.detailQueryLoading = true
      //	每次只展开一个扩展列表
      if (expandedRows.length) {
        if (row) {
          commonQueryMqttconfigdetail({ mqttConfigId: row.id, pageNum: 1, pageSize: 10000 }).then(res => {
            // this.temp = JSON.stringify(res.data)
            this.temp = res.data
          })

          this.expands = [row.id]
        }
      } else {
        this.expands = []
      }
      this.$forceUpdate() // 强制刷新
    },
    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    rowCopy(row) {
      queryById({ id: row.id }).then(res => {
        this.mqttVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 编辑方法
    addOrUpdateHandle(row) {
      this.indexKey = null
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.mqttVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdMqttconfig({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    searchFormclick() {
      this.queryLoading = true

      commonQueryMqttconfig(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        this.mqttConfiglist = response.data// 分页信息带回显示
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
    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const mqttDTO = this.mqttVo
        addMqttconfig(mqttDTO).then(response => {
          console.log(response, '添加数据')
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.searchFormclick()
        })
      } else if (this.dialogType === 'update') {
        const mqttDTO = this.mqttVo

        updateMqttconfig(mqttDTO).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.searchFormclick()
            this.mqttVo = {}
          }
        })
      }
    },
    // 批量删除
    deleteSelect() {
      this.$confirm('确定要删除吗？').then(res => {
        if (res === 'confirm') {
          batchRemoveMqttconfig(this.$refs.muiltitable.selection).then(res => {
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
    testcode() {
      commonQueryMqttconfig({ stationCode: this.mqttVo.stationCode }).then(res => {
        if (res.data.length !== 0) {
          this.$message.warning('编号已存在')
        }
      })
    }
  }

}
</script>

<style>
  .el-header {
    background-color: #ffffff;

  }
  .el-main {
    background-color: #ffffff;
    text-align: center;
  }
  .siteDescription{
    padding-left: 130px;
  }

</style>
