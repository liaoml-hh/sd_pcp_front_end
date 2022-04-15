<template>
  <el-container>
    <el-header style="height:60px">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="add">上传</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="distribute">下发</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="batchDelete">删除</el-button>
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
        :data="appversionlist"
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
          width="50"
          type="index"
        > <template slot-scope="scope">
          <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="appName"
          header-align="center"
          align="center"
          label="app名称"
          width="200%"
        />
        <el-table-column
          prop="fileMd5"
          header-align="center"
          align="center"
          show-overflow-tooltip
          label="校验码"
          width="200%"
        />
        <el-table-column
          prop="appVersion"
          header-align="center"
          align="center"
          label="app版本号"
          width="200%"
        />
        <el-table-column
          prop="appUrl"
          header-align="center"
          align="center"
          label="安装路径"
          width="200%"
        />
        <el-table-column
          prop="upgradeType"
          header-align="center"
          align="center"
          label="升级类型"
          width="200%"
        />
        <el-table-column
          prop="upgradeNotcie"
          header-align="center"
          align="center"
          label="升级提示"
          width="200%"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">停用</el-tag>
            <el-tag v-else type="success">启用</el-tag>
          </template>
        </el-table-column>

        <el-table-column

          header-align="center"
          align="center"
          width="400%"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="rowDispatch(scope.row)"
            >下发</el-button>
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
        :visible.sync="uploaddialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <el-form ref="appversionVoRef" :model="appversionVo" :rules="appversionVoRules" label-width="100px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="版本号" prop="appVersion" label-width="100px">
                <el-input v-model="appversionVo.appVersion" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="校验码" prop="fileMd5" label-width="100px">
                <el-input v-model="appversionVo.fileMd5" disabled placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="安装包路径" prop="appUrl" label-width="100px">
                <el-input v-model="appversionVo.appUrl" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="升级提示" prop="upgradeNotcie" label-width="100px">
                <el-input v-model="versiondispatchVo.upgradeNotcie" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="文件上传" prop="file">
                <el-upload
                  action=""
                  class="upload-demo"
                  :auto-upload="false"
                  :on-preview="handlePreview"
                  :on-change="change"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploaddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">上传</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        title="下发信息"
        :visible.sync="distributedialogVisible"
        width="80%"
        :before-close="distributehandleClose"
      >
        <el-form :model="stationVO" label-width="100px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="区域">
                <el-select
                  v-model="stationVO.areaId"
                  clearable
                  placeholder="区域"
                >
                  <el-option
                    v-for="(item,index) in arealist"
                    :key="index"
                    :label="item.area"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button v-loading="dialogLoading" type="primary" style="margin-top:6px;" size="mini" @click="dialogTableSerach">查询</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3"><el-button type="primary" size="medium" @click="doDispatch">升级</el-button></el-col>
          </el-row>
        </el-form>
        <div style="margin-top:30px">

          <el-table
            ref="stationmuiltitable"
            v-loading="dialogLoading"
            style="width: 100%;"
            border
            fix
            :data="stationList"
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
            />
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
            <!-- <el-table-column
                prop="batteryInfo"
                header-align="center"
                align="center"
                label="电池信息"
                min-width="120"
              /> -->
            <!-- <el-table-column
                prop="poitInfo"
                header-align="center"
                align="center"
                label="换电间信息"
                min-width="120"
              /> -->
            <!-- <el-table-column
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
              </el-table-column> -->
          </el-table>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributehandleClose">取 消</el-button>
          <el-button type="primary" @click="distributehandleClose">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>

</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryArea } from '../../../api/area/area'
import { commonQueryAppVersion, addAppVsersionFile, addAppVersion, removeByIdAppVersion, updateAppVersion, batchDeleteAppVersion, batchUpdateAppVersion, queryAppById } from '../../../api/appversion/index'
import {
  commonQueryVersionDispatch,
  queryById,
  batchAddVsersionDispatch } from '../../../api/versiondispatch/index'
import { commonQueryStation } from '@/api/station/station'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      tempObj: {},
      stationList: [],
      areaId: '',
      dialogLoading: false,
      appversionVo: {
        appUrl: '/home/pcpuser/'
      },
      versiondispatchVo: {},
      deletedisabled: true,
      uploaddialogVisible: false,
      distributedialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      versiondispatchlist: [],
      appversionlist: [],
      versiondispatchDTO: {},
      dialogType: '',
      arealist: [],
      stationVO: {
        areaId: ''
      },
      fileList: [],
      appFile: {},
      appversionVoRules: {
        appVersion: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        fileMd5: [{ required: false, message: '请输入活动名称', trigger: 'blur' }],
        appUrl: [{ required: true, message: '请输入文件路径', trigger: 'blur' }],
        upgradeNotcie: [{ required: false, message: '请输入活动名称', trigger: 'blur' }],
        file: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    }
  },

  mounted() {
    this.searchAppclick()
    this.searchFormclick()
    this.initdialogdata()
  },
  // 方法集合
  methods: {
    add() {
      this.dialogType = 'ADD'
      this.uploaddialogVisible = true
    },
    distribute() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else if (this.$refs.muiltitable.selection.length > 1) {
        this.$message.info('只能一条')
      } else {
        let target = this.$refs.muiltitable.selection[0]
        this.rowDispatch(target)
      }
    },
    rowDispatch(row) {
      this.tempObj = row
      this.dialogTableSerach()
      this.dialogType = 'DISTRIBUTE'
      this.distributedialogVisible = true
    },
    dialogTableSerach() {
      this.dialogLoading = true
      commonQueryStation({ pageSize: 1000, areaId: this.stationVO.areaId }).then(res => {
        this.stationList = res.data
        this.dialogLoading = false
      })
    },

    doDispatch() {
      if (this.$refs.stationmuiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否确定升级?', { center: true }).then(res => {
          if (res === 'confirm') {
            const appdispatchlist = []
            let { id: appVersionId, appId, appName, fileMd5, appVersion, appUrl } = this.tempObj
            this.$refs.stationmuiltitable.selection.map(item => {
              let appversionObj = {
                appVersionId,
                appId,
                fileName: appName,
                fileMd5,
                appVersion,
                appUrl,
                stationId: item.id
              }
              appdispatchlist.push(appversionObj)
            })

            batchAddVsersionDispatch(appdispatchlist).then(res => {
              if (res) {
                this.$message.success('下发成功')
              }
            })
          }
        })
      }
    },

    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const appversionDTO = this.appversionVo

        let from = new FormData()

        if (this.appFile?.raw) {
          appversionDTO.appName = this.appFile.name
          from.append('file', this.appFile.raw)
        }
        from.append('data', JSON.stringify(appversionDTO))
        addAppVsersionFile(from).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.uploaddialogVisible = false
            this.searchAppclick()
            this.appversionVo = {}
          }
        })
      } else if (this.dialogType === 'update') {
        const appversionDTO = this.appversionVo
        let from = new FormData()
        if (this.appFile.raw) {
          appversionDTO.appName = this.appFile.name
          from.append('file', this.appFile.raw)
        }
        from.append('data', JSON.stringify(appversionDTO))
        updateAppVersion(from).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.uploaddialogVisible = false
            this.searchAppclick()
            this.appversionVo = {}
          }
        })
      }
    },

    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗?').then(res => {
        removeByIdAppVersion({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchAppclick()
        })
      })
    },
    initdialogdata() {
      commonQueryArea({ pageSize: 1000 }).then(res => {
        this.arealist = res.data
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryVersionDispatch(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.versiondispatchlist = response.data// 分页信息带回显示
        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    searchAppclick() {
      try {
        this.queryLoading = true
        commonQueryAppVersion(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
          const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
          this.commonPage.total = parseInt(total)
          // this.commonPage.pageCount = pageNum
          // this.commonPage.pageSize = pageSize
          this.appversionlist = response.data// 分页信息带回显示
          this.queryLoading = false // 关闭查询
        }).catch(() => {
          this.queryLoading = false // 关闭查询
          this.$message.error('网络异常')
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.commonPage.pageSize = val
      this.searchAppFormclick()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.searchAppFormclick()
    },
    onDropdownCommand(methodName) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('没有选中任何数据')
      } else {
        this.$confirm('是否确定?').then(res => {
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
      batchUpdateAppVersion(arry).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.searchAppclick()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleClose() {
      this.uploaddialogVisible = false
      this.appversionVo = {}
    },
    distributehandleClose() {
      this.distributedialogVisible = false
      // this.versiondispatchVo = {}
      this.tempObj = {}
    },
    selectionChangeHandle(e) {
      if (e.length !== 0) {
        this.deletedisabled = false
      } else this.deletedisabled = true
    },
    addSelect() {
      this.$confirm('确定要下发吗？').then(res => {
        if (res === 'confirm') {
          batchAdd(this.$refs.muiltitable.selection).then(res => {
            if (res) {
              this.$message.success('下发成功')
              this.searchFormclick()
            }
          }).catch(error => {
            console.log(error)
            this.$message.error('下发失败')
          })
        }
      })
    },
    rowCopy(row) {
      queryAppById({ id: row.id }).then(res => {
        this.appversionVo = res
        this.appversionVoRules.file.length = 0
        this.appversionVoRules.file.push({ required: true, message: '请输入活动名称', trigger: 'blur' })
        this.uploaddialogVisible = true
        this.dialogType = 'ADD'
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryAppById({ id: row.id }).then(res => {
        this.appversionVo = res
        this.appversionVoRules.file.length = 0
        this.appversionVoRules.file.push({ required: false, message: '请输入活动名称', trigger: 'blur' })

        this.uploaddialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    change(file, fileList) {
      this.appFile = file
    },
    handleRemove(file, fileList) {
      this.appFile = file
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    batchDelete() {
      if (this.$refs.muiltitable.selection.length !== 0) {
        let data = []
        this.$refs.muiltitable.selection.map(item => {
          data.push({ id: item.id, version: item.version })
        })
        batchDeleteAppVersion(data).then(res => {
          if (res) {
            this.$message.success('删除成功')
          } else this.$message.error('删除失败')
        }).catch(error => {
          this.$message.error('删除失败，服务器错误' + JSON.stringify(error))
        }).finally(() => {
          this.searchAppclick()
        })
      } else this.$message.info('未选中记录')
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
