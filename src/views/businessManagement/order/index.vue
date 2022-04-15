<template>

  <el-container>
    <el-header style="height:110px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
          >
            <el-form-item label="单号">
              <el-input
                v-model="searchForm.orderNo"
                style="width:90%"
                clearable

                @keyup.enter.native="onQuery"
              />
            </el-form-item>
            <el-form-item label="用户">
              <el-select v-model="searchForm.userId" clearable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.id"

                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="车辆">
              <el-input
                v-model="searchForm.carNo"
                style="width:90%"
                clearable

                @keyup.enter.native="onQuery"
              />
            </el-form-item>

            <el-form-item
              label="申请时间"
              class="dateForm"
            >
              <el-date-picker
                v-model="applyTimeList"
                type="datetimerange"
                style="width:98%"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="placeChangeTime"
              />
            </el-form-item>
            <el-button
              v-loading="queryLoading"
              type="primary"
              style="margin-top:3px;margin-left:-5px"
              size="medium"
              @click="searchFormclick"
            >查询</el-button>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="1">
            <el-button
              type="primary"

              @click="outExe"
            >excel导出
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- <el-dropdown
          size="mini"
          split-button
          type="primary"
        >
          导入
          <el-dropdown-menu
            slot="dropdown"
            size="mini"
          >

            <el-dropdown-item
              type="primary"
              command="destroy"
            >
              <el-upload
                class="upload"
                style="width: fit-content"
                :on-change="fastImport"
                :on-remove="uploadRemove"
                :loading="uploadLoading"
                :file-list="fileListUpload"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                :auto-upload="false"
              >
                <el-link type="primary">快速导入</el-link>
              </el-upload>
            </el-dropdown-item>

          </el-dropdown-menu></el-dropdown></div> -->
    </el-header>

    <el-main>
      <el-table
        v-loading="queryLoading"
        :data="orderlist"
        style="width: 100%;"
        border
        fix

        @selection-change="selectionChangeHandle"
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
          prop="orderNo"
          header-align="center"
          align="center"
          label="单号"
          min-width="125"
        />
        <el-table-column
          prop="userVO.name"
          header-align="center"
          align="center"
          label="用户"
          min-width="90"
        />
        <el-table-column
          prop="userVO.tel"
          header-align="center"
          align="center"
          label="手机号"
          min-width="110"
        />
        <el-table-column
          prop="carVO.carNo"
          header-align="center"
          align="center"
          label="车辆"
          min-width="95"
        />
        <el-table-column
          prop="powerApplyVO.applyNo"
          header-align="center"
          align="center"
          label="换电单号"
          min-width="90"
        />
        <el-table-column
          prop="machineVO.name"
          header-align="center"
          align="center"
          label="设备"
          min-width="120"
        />
        <el-table-column
          prop="applyOrderRelationVO.cabinetVO.code"
          header-align="center"
          align="center"
          label="柜号"
          min-width="80"
        />
        <el-table-column
          prop="mechinePrice"
          header-align="center"
          align="center"
          label="应付金额"
          min-width="80"
        />
        <el-table-column
          prop="actualPrice"
          header-align="center"
          align="center"
          label="实付金额"
          min-width="80"
        />
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="开始时间"
          min-width="155"
        />
        <el-table-column
          prop="endTime"
          header-align="center"
          align="center"
          label="结束时间"
          min-width="155"
        />
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="换电状态"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.powerApplyVO.status <4?'未开始':scope.row.powerApplyVO.status>5?'换电完成':scope.row.powerApplyVO.status===5?'换电中':scope.row.powerApplyVO.status }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="paymentStatus"
          header-align="center"
          align="center"
          label="支付状态"
          min-width="120"
        >
          <template slot-scope="{row}">
            <span>{{ row.paymentStatus==0?'未支付':row.paymentStatus==1?'已支付':row.paymentStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          label="申请单状态"
          width="150"
        >
          <template slot-scope="{row}">
            <span>{{
              row.powerApplyVO.status===-3?"已失效"
              :row.powerApplyVO.status===-2?"已取消"
                :row.powerApplyVO.status===-1?"未通过"
                  :row.powerApplyVO.status===0?'待审核'
                    :row.powerApplyVO.status===1?"审核通过"
                      :row.powerApplyVO.status===2?'已发送'
                        :row.powerApplyVO.status===3?'发送成功'
                          :row.powerApplyVO.status===4?'已进站'
                            :row.powerApplyVO.status===5?'车辆到位'
                              :row.powerApplyVO.status===6?'充换电中'
                                :row.powerApplyVO.status===7?'换电完成'
                                  :row.powerApplyVO.status===8?'支付成功'
                                    :row.powerApplyVO.status===9?'已出站'
                                      :row.powerApplyVO.status===10?'站点申请订单完成'
                                        :row.powerApplyVO.status===11?'站点申请订单取消':'同意站点申请' }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          header-align="center"
          align="center"
          width="250"
          label="操作"
        >
          <template slot-scope="scope">

            <el-button
              type="primary"
              size="mini"
              plain
              :disabled="scope.row.status!==2"
            >
              <el-link
                :underline="false"
                :href="scope.row.pdfUrl"
                :disabled="scope.row.status!==2"
                @click="gotoOption(scope.row)"
              >下载发票</el-link>
            </el-button>

            <el-button
              :disabled="scope.row.status!==2"
              size="mini"
              @click="eamilsend(scope.row)"
            >发送发票</el-button>

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
        v-dialogDrag
        title="添加信息"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <el-form :model="stationVo">
          <el-row>
            <el-col>
              <el-form-item label="区域">
                <el-select
                  v-model="stationVo.areaId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in arealist"
                    :key="item.id"
                    size="mini"
                    :label="item.area"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="编码">
                <el-input
                  v-model="stationVo.code"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="名称">
                <el-input
                  v-model="stationVo.name"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="地址">
                <el-input
                  v-model="stationVo.address"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="联系人">
                <el-input
                  v-model="stationVo.contacts"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="电池信息">
                <el-input
                  v-model="stationVo.batteryInfo"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="经度">
                <el-input
                  v-model="stationVo.longitude"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="纬度">
                <el-input
                  v-model="stationVo.latitude"
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
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="onBtnSaveClick"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
<!--
注意：上面代码有以下 2 个需要注意的点
	1. action 属性必须要有，可以为空，但是不能没有，不然控制台会报错
	2. 钩子函数必须是 on-change 这个钩子，只有这个钩子可以添加文件，其他都是上传，具体可以看[elementtui官方文档的介绍](https://element.eleme.io/#/zh-CN/component/upload)
-->

</template>

<script>
import { from } from '@chenfengyuan/vue-qrcode'
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryApply } from '../../../api/exchangeOrder/index'
import { eamilsend } from '../../../api/invoice/index'
import { commonQueryUser } from '../../../api/user/index'
import moment from 'moment'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      userList: {},
      stationVo: {},
      arealist: [],
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      orderlist: [],
      stationDTO: {},
      fileTemp: null,
      uploadLoading: false,
      fileListUpload: 1,
      dialogType: '',
      msg: 'hello,Element',
      limitUpload: 1,
      file: '',
      excelData: [],
      fileContent: '',
      data: '',
      applyTimeList: null
      // applyTimeList: [new Date(Date.now() - 1000 * 60 * 60 * 24), new Date()]
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
    this.initData()
  },
  // 方法集合
  methods: {
    initData() {
      commonQueryUser({ pageSize: 10000 }).then(res => {
        this.userList = res.data
      })
    },
    handleDelete(item) {
      console.log('handleDelete', item)
    },
    handelEdit(item) {
      console.log('handleDelete', item)
    },
    // 核心部分代码(handleChange 和 importfile)
    handleChange(file, fileList) {
      this.fileContent = file.raw
      const fileName = file.name
      const fileType = fileName.substring(fileName.lastIndexOf('.') + 1)
      if (this.fileContent) {
        if (fileType === 'xlsx' || fileType === 'xls') {
          this.importfile(this.fileContent)
        } else {
          this.$message({
            type: 'warning',
            message: '附件格式错误，请重新上传！'
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请上传附件！'
        })
      }
    },
    importfile(obj) {
      const reader = new FileReader()
      let _this = this

      reader.readAsArrayBuffer(obj)
      reader.onload = function() {
        const buffer = reader.result
        const bytes = new Uint8Array(buffer)
        const length = bytes.byteLength
        let binary = ''
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const XLSX = require('xlsx')
        const wb = XLSX.read(binary, {
          type: 'binary'
        })
        const outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        this.data = [...outdata]
        const arr = []
        this.data.map(v => {
          const obj = {}

          obj.orderNo = v.ORDERNO
          obj.name = v.NAME
          arr.push(obj)
        })

        _this.orderlist = _this.orderlist.concat(arr)
      }
    },

    onQuery() {
      this.searchFormclick()
    },
    rowCopy() {

    },
    outExe() {
      this.$confirm('此操作将导出excel文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        if (res === 'confirm') {
          this.excelData = this.orderlist // 你要导出的数据list。
          this.export2Excel()
        }
      })
    },
    export2Excel() {
      var that = this
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../excel/Export2Excel') // 这里必须使用绝对路径，根据自己的命名和路径
        const tHeader = ['单号', '用户', '手机号', '应付金额', '实付金额', '开始时间', '结束时间'] // 导出的表头名
        const keyList = ['orderNo', 'modifier', 'userVOTel', 'mechinePrice', 'actualPrice', 'startTime', 'endTime'] // 导出的表头字段名
        const dataList = that.excelData
        dataList.forEach(data => {
          data.userVOTel = data.userVO.tel
        })
        debugger
        // that.excelData为传入的数据
        const data = that.formatJson(keyList, dataList)
        export_json_to_excel(tHeader, data, `测试导出excel${Date.now()}`) // 导出的表格名称，根据需要自己命名
        // tHeader为导出Excel表头名称，`xxxxxx`即为导出Excel名称
      })
    },
    formatJson(keyList, dataList) {
      return dataList.map(data => keyList.map(key => data[key]))
    },

    fastImport(file, fileList) {
      this.importType = 'fast'
      this.uploadChange(file, fileList, 'fast')
    },
    uploadRemove() {
      this.fileTemp = null
      this.uploadLoading = false
    },
    eamilsend(val) {
      eamilsend(val).then(res => {
        if (res) {
          this.$message.success('发送成功')
        }
        this.searchFormclick()
      }).catch(error => {
        this.$$message.error('发送失败')
        console.log(error)
      })
      this.searchFormclick()
    },

    placeChangeTime(val) {

    },
    // 添加和编辑方法
    // onBtnSaveClick() {
    //   if (this.dialogType === 'ADD') {
    //     const stationDTO = this.stationVo
    //
    //     addStation(stationDTO).then(response => {
    //       this.$message.success('操作成功')
    //       this.dialogVisible = false
    //       this.searchFormclick()
    //     })
    //   }
    // },
    // 删除方法
    // deleteHandle(val) {
    //   this.$confirm('确定要删除吗？').then(res => {
    //     removeByIdStation({ id: val.id }).then(response => {
    //       this.$message.success('操作成功')
    //       this.searchFormclick()
    //     })
    //   }).catch(() => {})
    // },
    // 发起查询
    searchFormclick() {
      this.searchForm.timeStart = ''
      this.searchForm.timeEnd = ''
      if (this.applyTimeList != null) {
        const startTime = this.dateTimeFormat(this.applyTimeList[0] || null)
        const endTime = this.dateTimeFormat(this.applyTimeList[1] || null)

        if (startTime !== null && endTime != null) {
          this.searchForm.timeStart = startTime
          this.searchForm.timeEnd = endTime
        }
      }

      this.queryLoading = true
      commonQueryApply(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageNum = parseInt(pageNum)
        // this.commonPage.pageSize = parseInt(pageSize)
        this.orderlist = response.data// 分页信息带回显示
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
    dateTimeFormat(date = '', pattern = 'YYYY-MM-DD HH:mm:ss') {
      try {
        return moment(date).format(pattern)
      } catch (e) {
        console.log(e)
        return null
      }
    },
    selectionChangeHandle() {

    },
    addOrUpdateHandle() {

    },
    handleClose() {

    },
    onBtnSaveClick() {

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
