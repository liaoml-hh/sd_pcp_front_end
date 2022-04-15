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
            <el-form-item label="名称">
              <el-input v-model="searchForm.name" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="区域">
              <!-- <el-input v-model="searchForm.areaId" style="width:90%" clearable size="mini" /> -->
              <el-select v-model="searchForm.areaId" style="width:185px" placeholder="请选择">
                <el-option
                  v-for="item in arealist"
                  :key="item.id"
                  size="mini"
                  :label="item.province+item.city+item.area"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              label="营业时间"
              class="dateForm"
            >
              <el-date-picker
                v-model="placeTimeList"
                type="daterange"
                size="mini"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="placeChangeTime"
              />
            </el-form-item> -->
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div style="width:100%;">
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
            <el-dropdown-item command="1">启用</el-dropdown-item>
            <el-dropdown-item command="0">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" icon="el-icon-document" @click="exportFile">导出</el-button>
        <el-upload
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          style="display:inline-block;margin-left:20px"
          :auto-upload="false"
          list-type=".xlsx"
          limit="1"
          :on-change="handleChange"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="importFile">上传到服务器</el-button>
        </el-upload>
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="stationlist"
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
          fixed="left"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="40"
          type="index"
        >  <template slot-scope="scope">
          <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
        </template>
        </el-table-column>

        <el-table-column :key="Math.random()" label="明细" type="expand" width="60">
          <template slot-scope>
            <div>
              <el-table
                :data="temp"
                highlight-current-row
                border
                :header-cell-style="{color:'#606266', height:'6px', padding:'0px'}"
                style="width:700px;font-size:12px;margin-left:79px"
              >
                <el-table-column align="center" label="序号" type="index" width="40" :temp="temp" />
                <el-table-column
                  prop="name"
                  header-align="center"
                  align="center"
                  label="设备名称"
                  min-width="90"
                />
              </el-table>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="code"
          header-align="center"
          align="center"
          label="编码"
          min-width="90"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="区域"
          min-width="90"
          show-overflow-tooltip
        >
          <template slot-scope="{row}">
            <span>{{ row.areaVO.province }}{{ row.areaVO.city }}{{ row.areaVO.area }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="名称"
          min-width="90"
        />

        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="地址"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column
          prop="longitude"
          header-align="center"
          align="center"
          label="经度"
          min-width="120"
        />
        <el-table-column
          prop="latitude"
          header-align="center"
          align="center"
          label="纬度"
          min-width="120"
        />
        <el-table-column
          prop="contacts"
          header-align="center"
          align="center"
          label="联系人"
          min-width="120"
        />
        <el-table-column
          prop="businessTime"
          header-align="center"
          align="center"
          label="开始营业时间"
          min-width="110"
          show-overflow-tooltip
        />
        <el-table-column
          prop="businessTimeEnd"
          header-align="center"
          align="center"
          label="停止营业时间"
          min-width="110"
          show-overflow-tooltip
        />

        <el-table-column
          prop="chargeInfo"
          header-align="center"
          align="center"
          label="收费信息"
          min-width="120"
        />
        <el-table-column
          prop="batteryInfo"
          header-align="center"
          align="center"
          label="电池信息"
          min-width="120"
        />
        <el-table-column
          prop="poitInfo"
          header-align="center"
          align="center"
          label="换电间信息"
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
          width="400"
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
            <el-button
              type="warning"
              size="mini"
              @click="refreshTheConfiguration(scope.row)"
            >刷新配置</el-button>
          </template>
        </el-table-column>
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
        :visible.sync="dialogVisible"
        width="65%"
        :before-close="handleClose"
      >
        <el-form ref="ruleForm" :model="stationVo" :rules="stationVoRules">
          <el-row>
            <el-col span="8">
              <el-form-item label="编码" prop="code" label-width="100px">
                <el-input v-model="stationVo.code" placeholder="" disabled @blur="testcode" />
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="区域" prop="areaId" label-width="100px">
                <el-select v-model="stationVo.areaId" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="item in arealist"
                    :key="item.id"
                    size="mini"
                    :label="item.province+item.city+item.area"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="名称" prop="name" label-width="100px">
                <el-input v-model="stationVo.name" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col span="8">
              <el-form-item label="地址" prop="address" label-width="100px">
                <el-input v-model="stationVo.address" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="联系人" prop="contacts" label-width="100px">
                <el-input v-model="stationVo.contacts" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="电池信息" prop="batteryInfo" label-width="100px">
                <el-input v-model="stationVo.batteryInfo" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col span="8">
              <el-form-item label="经度" prop="longitude" label-width="100px">
                <el-input v-model="stationVo.longitude" placeholder="" />
              </el-form-item>

            </el-col>
            <el-col span="8">
              <el-form-item label="纬度" prop="latitude" label-width="100px">
                <el-input v-model="stationVo.latitude" placeholder="" />
              </el-form-item>
            </el-col>

            <el-col span="8">
              <el-form-item label="收费信息" prop="chargeInfo" label-width="100px">
                <el-input v-model="stationVo.chargeInfo" placeholder="" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col span="8">
              <div class="pick_time">
                <el-form-item label="营业时间" label-width="100px">
                  <!-- <el-input v-model="stationVo.businessTime" placeholder="" /> -->
                  <div class="pick_time">
                    <el-time-picker
                      v-model="pickupTimeList"
                      style="width:100%"
                      is-range
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                    />
                  </div>
                </el-form-item>
              </div>
            </el-col>
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
import { commonQueryStation, addStation, updateStation, removeByIdStation, batchRemoveStation, queryById, refreshTheConfiguration, batchUpdateStation, batchAddStation } from '../../../api/station/station'
import { commonQueryArea, addArea, updateArea, removeByIdArea } from '../../../api/area/area'
import { commonQueryMachine } from '../../../api/machine/index'
import { commonQuerycode } from '@/api/orderconfig/index'
import moment from 'moment'
import { readExcel, formatJson } from '@/excel/Excel2Json'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      fileList: [],
      xlsxFile: null,
      temp: [],
      stationVo: {
        code: '',
        areaId: '',
        name: '',
        address: '',
        contacts: '',
        longitude: '',
        latitude: '',
        chargeInfo: ''
      },
      tableKey: true,
      expands: [],
      arealist: [],
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      stationlist: [],
      stationDTO: {},
      dialogType: '',
      pickupTimeList: [new Date(), new Date()],
      areaQueryLoading: false,
      getRowKeys(row) {
        return row.id
      },
      stationVoRules: {
        code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
        areaId: [{ required: true, message: '区域不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        contacts: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
        latitude: [{ required: true, message: '维度不能为空', trigger: 'blur' }],
        chargeInfo: [{ required: true, message: '收费不能为空', trigger: 'blur' }]
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
    // this.searchFormclick()
    this.onQuery()
  },

  // 方法集合
  methods: {
    onQuery() {
      commonQueryArea({ pageSize: 1000 }).then(res => {
        this.arealist = res.data
      })
      this.searchFormclick()
    },

    detailExpandHandle(row, expandedRows) {
      // 全屏遮罩加载显示

      // this.detailQueryLoading = true
      //	每次只展开一个扩展列表
      if (expandedRows.length) {
        if (row) {
          commonQueryMachine({ stationId: row.id, pageNum: 1, pageSize: 10000 }).then(res => {
            // this.temp = JSON.stringify(res.data)
            this.temp = res.data
          })

          this.expands = [row.id]
        }
      } else {
        this.expands = []
      }
      this.$forceUpdate()
    },

    testcode() {
      commonQueryStation({ code: this.stationVo.code }).then(res => {
        if (res.data.length !== 0) {
          this.$message.warning('编号已存在')
        }
      })
    },
    add() {
      this.pickupTimeList.length = 0
      this.pickupTimeList.push(new Date(), new Date())
      this.dialogType = 'ADD'
      this.dialogVisible = true
      commonQuerycode({ id: '1408713586204868610' }).then(res => {
        this.stationVo.code = res.currentSqno
      }).catch(error => {
        console.log(error)
      })
      commonQueryArea({ pageSize: 1000 }).then(res => {
        this.arealist = res.data
      })
    },
    rowCopy(row) {
      commonQuerycode({ id: '1408713586204868610' }).then(myres => {
        this.stationVo.code = myres.currentSqno
        queryById({ id: row.id }).then(res => {
          const v1 = moment(res.businessTime, 'HH:mm:ss')
          const v2 = moment(res.businessTimeEnd, 'HH:mm:ss')
          this.pickupTimeList.length = 0
          this.pickupTimeList.push(v1._d, v2._d)
          this.stationVo = res
          this.stationVo.code = myres.currentSqno
          this.dialogType = 'ADD'
          this.dialogVisible = true
        }).catch(error => {
          console.log(error)
        })
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'

      queryById({ id: row.id }).then(res => {
        const v1 = moment(res.businessTime, 'HH:mm:ss')
        const v2 = moment(res.businessTimeEnd, 'HH:mm:ss')
        this.pickupTimeList.length = 0
        this.pickupTimeList.push(v1._d, v2._d)
        this.stationVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      this.$refs.ruleForm.validate(res => {
        if (res) {
          const stationDTO = this.stationVo
          const startTime = this.pickupTimeList[0]
          const endRime = this.pickupTimeList[1]

          stationDTO.businessTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
          stationDTO.businessTimeEnd = moment(endRime).format('YYYY-MM-DD HH:mm:ss')
          if (this.dialogType === 'ADD') {
            addStation(stationDTO).then(response => {
              this.$message.success('操作成功')
              this.dialogVisible = false
              this.searchFormclick()
            })
          } else if (this.dialogType === 'update') {
            updateStation(stationDTO).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.stationVo = {}
              }
            })
          }
        }
      })
    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdStation({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      }).catch(error => {
        this.$message.warning('该站点存在关联信息')
        console.log(error)
      })
    },
    // 批量删除
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length === 0) {
        return this.$message.info('未选中记录')
      } else {
        this.$confirm('确定要删除吗？').then(res => {
          if (res === 'confirm') {
            const deleteList = []
            this.$refs.muiltitable.selection.map(item => {
              delete item.businessTime
              delete item.businessTimeEnd
              deleteList.push(item)
            })
            batchRemoveStation(deleteList).then(res => {
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

      commonQueryStation(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageNum = parseInt(pageNum)
        // this.commonPage.pageSize = parseInt(pageSize)
        this.stationlist = response.data// 分页信息带回显示
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
    handleClose() {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
      Object.keys(this.stationVo).map(key => {
        this.stationVo[key] = ''
      })
    },
    refreshTheConfiguration(val) {
      this.$confirm('是否刷新配置', { center: true }).then(res => {
        if (res === 'confirm') {
          this.loading = true
          refreshTheConfiguration({ code: val.code }).then(res => {
            this.loading = false
            this.$message.warning('请求配置参数成功,请到站点参数管理查看,如不成功请重试')
          })
        }
      })
    },
    onDropdownCommand(status) {
      if (this.$refs.muiltitable.selection.length > 0) {
        status = Number(status)
        let dataList = []
        this.$refs.muiltitable.selection.map(item => {
          dataList.push({ id: item.id, version: item.version, status: status })
        })
        batchUpdateStation(dataList).then(res => {
          if (res) {
            this.$message.success('更新成功')
            this.searchFormclick()
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('更新失败')
        })
      } else {
        this.$message.info('没有选中数据')
      }
    },
    exportFile() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        let jsondata = JSON.parse(JSON.stringify(this.$refs.muiltitable.selection))
        var that = this
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../excel/Export2Excel') // 这里必须使用绝对路径，根据自己的命名和路径
          const tHeader = ['编码', '名称', '地址', '经度', '纬度', '联系人', '开始营业时间', '结束营业时间'] // 导出的表头名
          const keyList = ['code', 'name', 'address', 'longitude', 'latitude', 'contacts', 'businessTime', 'businessTimeEnd'] // 导出的表头字段名
          const data = that.formatJson(keyList, jsondata)
          export_json_to_excel(tHeader, data, `站点测试导出excel${Date.now()}`) // 导出的表格名称，根据需要自己命名
        })
      }
    },
    formatJson(keyList, dataList) {
      return dataList.map(data => keyList.map(key => data[key]))
    },
    importFile() {
      if (!this.xlsxFile) {
        this.$message.info('未选择文件')
        return
      }
      readExcel(this.xlsxFile).then(res => {
        const tHeader = ['区域', '名称', '地址', '经度', '纬度', '联系人', '开始营业时间', '结束营业时间', '收费信息', '电池信息', '换电间信息'] // 导出的表头名
        const keyList = ['areaName', 'name', 'address', 'longitude', 'latitude', 'contacts', 'businessTime', 'businessTimeEnd', 'chargeInfo', 'batteryInfo', 'poitInfo'] // 导出的表头字段名
        let arry = formatJson(tHeader, keyList, res)
        let data = arry.map(item => {
          let areaObj = this.queryAreaIdByLikeName(item.areaName)
          // let no = this.queryOrderConfigNo()
          if (areaObj) {
            item.areaId = areaObj.id

            item.businessTime = moment(new Date('2021-02-02 ' + item.businessTime)).format('YYYY-MM-DD HH:mm:ss')
            item.businessTimeEnd = moment(new Date('2021-02-02 ' + item.businessTimeEnd)).format('YYYY-MM-DD HH:mm:ss')
            // item.code = no
            return item
          } else {
            this.$message.error('地区名称不合法规范,请参考区域管理')
          }
        })
        batchAddStation(data).then(res => {
          if (res) {
            this.$message.success('导入成功')
          } else {
            this.$message.error('导入失败')
          }
          this.handleRemove(null, [])
        }).catch(error => {
          console.log(error)
          this.$message.error('导入失败')
        })
      }).catch(error => {
        console.log(error)
        this.$message.info('文件解析失败')
      })
    },

    queryAreaIdByLikeName(name) {
      let area = this.arealist.find(item => item.province.concat(item.city, item.area).includes(name))
      if (area) {
        return area
      } else return null
    },
    async queryOrderConfigNo() {
      try {
        let res = await commonQuerycode({ id: '1408713586204868610' })
        return res.currentSqno
      } catch (e) {
        this.$message.error('解析失败')
      }
    },
    handlePreview() {
      return
    },
    handleRemove(file, fileList) {
      this.xlsxFile = null
      this.fileList = fileList
    },
    handleChange(file, filelist) {
      this.xlsxFile = file
      this.fileList = filelist
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
  .pick_time{
    text-align: center;

}

</style>
