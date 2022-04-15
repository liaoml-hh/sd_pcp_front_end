<template>
  <el-container>
    <el-header style="height:120px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm1"
            @keyup.enter.native="onQuery"
          >
            <el-form-item label="站点">
              <el-select
                v-model="searchForm1.id"
                clearable
                placeholder="站点名称"
                style="width:215px"
              >
                <el-option
                  v-for="(item,index) in stationlist"
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
        <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" :disabled="deletedisabled" @click="deleteSelect">删除</el-button>
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
        @selection-change="selectionChangeHandle1"
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
            <span>{{ scope.$index + 1 +(searchForm1.pageNum===1?0:commonPage1.pageSize*(searchForm1.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="站点名称"
          min-width="105"
        />
        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="站点地址"
          min-width="105"
        />
        <el-table-column
          prop="code"
          header-align="center"
          align="center"
          label="编码"
          min-width="105"
        />
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

        <!--<el-table-column

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

            <el-button
              type="primary"
              size="mini"
              @click="showDetail(scope.row)"
            >查看明细</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div style="float:left;">
        <el-pagination
          :v-model="commonPage1"
          :page-count="commonPage1.pageCount"
          :page-size="commonPage1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="commonPage1.total"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
        />
      </div>

      <el-dialog
        v-dialogDrag
        title="初始化换电柜"
        :visible.sync="maindialogvisiable"
        width="80%"
        :before-close="maindialoghandleClose"
      >
        <el-form :model="cabinetVO">
          <el-row>
            <el-col :span="6">
              <el-form-item label="站点">
                <el-select
                  v-model="cabinetVO.stationId"
                  clearable
                  placeholder="站点名称"
                  style="width:215px"
                >
                  <el-option
                    v-for="(item,index) in stationlist"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="init">查询</el-button>
            </el-col>
          </el-row>
          <el-row>
            <div style="display:flex">
              <el-button type="danger" @click="deleteCabinetClick">删除明细</el-button>
              <el-button type="primary" @click="addCabinetClick">插入换电柜</el-button>
            </div>
          </el-row>
          <div>

            <el-dialog
              v-dialogDrag
              width="50%"
              :title="dialogType==='addcabinet'?'插入换电柜':'修改换电柜'"
              :visible.sync="cabinetdialogvisible"
              append-to-body
              :before-close="cabinethandleClose"
            >
              <!-- 插入换电柜model -->
              <el-form ref="addCabinetModelRef" :model="addCabinetModel" label-width="100px" :rules="rules">
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="柜号" prop="code">
                      <el-input v-model="addCabinetModel.code" placeholder="" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="站点" prop="stationId">
                      <el-select
                        v-model="addCabinetModel.stationId"
                        clearable
                        placeholder="站点名称"
                        style="width:100%"
                      >
                        <el-option
                          v-for="(item,index) in stationlist"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="最大电池量" prop="maxQuantity">
                      <el-input v-model="addCabinetModel.maxQuantity" value="24" :disabled="true" placeholder="24" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="当前剩余电池" prop="currentQuantity">
                      <el-input v-model="addCabinetModel.currentQuantity" value="24" :disabled="true" placeholder="24" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="电池类型" prop="batteryType">
                      <el-select
                        v-model="addCabinetModel.batteryType"
                        clearable
                        placeholder="电池类型"
                        style="width:100%"
                      >
                        <el-option
                          v-for="item in dictionary"
                          :key="item.id"
                          :label="item.name+'-'+item.remark"
                          :value="item.name"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="放电柜数量" prop="cabinetcount">
                      <el-input v-model="addCabinetModel.cabinetcount" :disabled="dialogType==='update'?true:false" placeholder="" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <!-- 插入换电柜model -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="cabinethandleClose">取 消</el-button>
                <el-button type="primary" @click="onBtnSaveCabinetClick">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <el-table
            ref="cabinetmuiltitable"
            v-loading="cabinetLoading"
            :data="cabinetlist"
            style="width: 100%;"
            border
            fix
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
                <span>{{ scope.$index + 1 +(cabinetVO.pageNum===1?0:commonPage2.pageSize*(cabinetVO.pageNum-1)) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              header-align="center"
              align="center"
              label="柜号"
              min-width="90"
            />
            <el-table-column
              prop="stationVO.name"
              header-align="center"
              align="center"
              label="站点"
              min-width="90"
            />
            <el-table-column
              prop="batteryType"
              header-align="center"
              align="center"
              label="电池类型"
              min-width="120"
            />
            <el-table-column
              prop="maxQuantity"
              header-align="center"
              align="center"
              label="最大数量"
              min-width="120"
            />
            <el-table-column
              prop="currentQuantity"
              header-align="center"
              align="center"
              label="当前数量"
              min-width="120"
            />
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="300"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="rowCopy(scope.row)"
                >复制</el-button>
                <!-- <el-button
                  size="mini"
                  plain
                  @click="addCabinetDetailClick(scope.row)"
                >增加</el-button> -->
                <el-button
                  type="danger"
                  size="mini"
                  plain
                  @click="deleteHandle(scope.row)"
                >删除</el-button>
                <el-button
                  type="success"
                  size="mini"
                  @click="addOrUpdateHandle1(scope.row)"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div style="float:left;">
          <el-pagination
            :v-model="commonPage2"
            :page-count="commonPage2.pageCount"
            :page-size="commonPage2.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="commonPage2.total"
            @size-change="handleSizeChangecabinet"
            @current-change="handleCurrentChangecabinet"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="maindialoghandleClose">取 消</el-button>
          <el-button type="primary" @click="maindialoghandleClose">确 定</el-button>
        </span>
      </el-dialog>
      <!--  -->

    </el-main>
  </el-container>
</template>
<script>

import {
  commonQuerybatterystock,
  addbatterystock,
  batchUpdatebatterystock,
  batchRemovebatterystock } from '../../../api/electricitymessage/index'
import {
  commonQuerycabinet,
  bathAddcabinet,
  removeByIdcabinet,
  batchRemovecabinet,
  updatecabinet,
  queryById } from '../../../api/inventorymessage/index'
import { commonQueryStation } from '../../../api/station/station'
import {
  addcabinetdetail,
  bathAddcabinetdetail,
  commonQuerycabinetdetail,
  detailqueryById,
  removeByIdcabinetdetail,
  updatecabinetdetail } from '../../../api/cabinetdetail/index'
import { commonQueryDictionary } from '../../../api/dictionary/index'
import { toSJIS } from '@chenfengyuan/vue-qrcode'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      detailList: [],
      showdetail: false,
      addCabinetModel: {},
      cabinetcount: '',
      detailcount: '',
      cabinetVO: { pageNum: 1, pageSize: 10 },
      cabinetdetailVO: {},
      batteryStockVO: {},
      deletedisabled: true,
      dialogVisible: false,
      addCabinetdetailVisible: false,
      maindialogvisiable: false,
      editVisible: false,
      loading: true,
      queryLoading: false,
      cabinetLoading: false,
      cabinetdetailLoading: false,
      searchForm1: { pageNum: 1, pageSize: 10 },
      searchFormdetail: {},
      commonPage1: { total: 10, pageCount: 1, pageSize: 10 },
      commonPage2: { total: 10, pageCount: 1, pageSize: 10 },
      commonPagedetail: { total: 10, pageCount: 1, pageSize: 10 },
      packlist: [],
      batteryStockDTO: {},
      dialogType: '',
      dictionary: [],
      cabinetdialogvisible: false,
      cabinetlist: [],
      stationlist: [],
      cabinetdetaillist: [],
      tempData: {},
      updateCabinetdetailVisible: false,
      cabinetdeatilID: '',
      rules: {
        code: [{ required: true, message: '请输入柜号', trigger: 'blur' }],
        stationId: [{ required: true, message: '请输入站点', trigger: 'blur' }],
        // dictionaryTypeId: [{ required: true, message: '请输入电池类型', trigger: 'blur' }],
        cabinetcount: [{ required: true, message: '请输入放电柜数量', trigger: 'blur' }],
        detailcount: [{ required: true, message: '请输入放电柜明细数量', trigger: 'blur' }],
        packageName: [{ required: true, message: '请输入包名', trigger: 'blur' }],
        batteryType: [{ required: true, message: '请输入电池类型', trigger: 'blur' }],
        cabinetcode: [{ required: true, message: '请输入柜号', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.searchFormclick()
    this.initdialogdata()
    this.init()
    this.initType()
    this.initdetail()
  },

  // 方法集合
  methods: {
    initdialogdata() {
      commonQueryStation({ pageSize: 1000 }).then(res => {
        this.stationlist = res.data
      })
    },

    showDetail(item) {
      this.detailList.length = 0
      commonQuerycabinet({ stationId: item.id }).then(res => {
        this.showdetail = true
        this.detailList = res.data
      })
    },

    init() {
      this.cabinetLoading = true
      commonQuerycabinet(this.cabinetVO).then(response => {
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage2.total = parseInt(total)

        this.cabinetlist = response.data// 分页信息带回显示
        this.cabinetLoading = false // 关闭查询
      }).catch(() => {
        this.cabinetLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    initdetail() {
      this.cabinetdetailLoading = true
      this.searchFormdetail.cabinetId = this.cabinetdeatilID
      commonQuerycabinetdetail(this.searchFormdetail).then(response => {
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPagedetail.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.cabinetdetaillist = response.data// 分页信息带回显示
        this.cabinetdetailLoading = false // 关闭查询
      }).catch(() => {
        this.cabinetdetailLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    initType() {
      commonQueryDictionary({ pageSize: 1000, dictionaryTypeId: '1461525103069233152' }).then(res => {
        this.dictionary = res.data
      })
    },
    onQuery() { this.searchFormclick() },
    testcode() {
      if (this.batteryStockVO.code.length !== 0) {
        commonQuerybatterystock({ code: this.batteryStockVO.code }).then(res => {
          if (res.data.length !== 0) {
            this.$message.success('编号已存在')
          }
        })
      } else return
    },

    add() {
      this.dialogType = 'ADD'
      this.maindialogvisiable = true
    },
    addCabinetClick() {
      this.dialogType = 'addcabinet'
      this.cabinetdialogvisible = true
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const batteryStockDTO = this.batteryStockVO
        addbatterystock(batteryStockDTO).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.searchFormclick()
            this.batteryStockVO = {}
          }
        })
      } else if (this.dialogType === 'update') {
        const cabinedetailtDTO = this.cabinetdetailVO
        addcabinetdetail(cabinedetailtDTO).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.addCabinetdetailVisible = false
            this.searchFormclick()
            this.cabinetdetailVO = {}
          }
        })
      } else if (this.dialogType === 'addcabinet') {
        const n = []
        for (let i = 0; i < this.addCabinetModel.cabinetcount; i++) {
          n.push(this.cabinetVO)
        }
        bathAddcabinet(n).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.cabinetdialogvisible = false
            this.init()
            this.cabinetVO = {}
          }
        })
      }
    },

    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdcabinet({ id: val.id }).then(response => {
          debugger
          if (response) {
            this.$message.success('操作成功')
            this.init()
          }
        })
      })
    },
    deleteHandle1(val) {
      this.$confirm('确定要删除吗？').then(res => {
        removeByIdcabinetdetail({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.initdetail()
        })
      })
    },

    addCabinetDetail(row) {

    },
    addCabinetDetailClick(row) {
      this.tempData = row
      this.addCabinetdetailVisible = true
    },

    onBtnSaveCabinetDetalClick() {
      const countList = []
      this.cabinetdetailVO.cabinetId = this.tempData.id
      for (let i = 0; i < this.detailcount; i++) {
        countList.push(this.cabinetdetailVO)
      }
      bathAddcabinetdetail(countList).then(response => {
        if (response) {
          this.$message.success('操作成功')
          this.addCabinetdetailVisible = false
          this.initdetail()
        }
      })
    },
    onBtnSaveCabinetClick() {
      this.$refs.addCabinetModelRef.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addcabinet') {
            const countInserList = []
            for (let i = 0; i < this.addCabinetModel.cabinetcount; i++) {
              countInserList.push(this.addCabinetModel)
            }
            bathAddcabinet(countInserList).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.cabinetdialogvisible = false
                this.init()
              }
            })
          } else if (this.dialogType === 'update') {
            updatecabinet(this.addCabinetModel).then(res => {
              if (res) {
                this.init()
                this.$message.success('操作成功')
                this.cabinetdialogvisible = false
              }
            }).catch(error => {
              this.$message.error('操作失败')
              console.log(error)
            })
          }
        }
      })

      // TODO
    },
    onBtnupdateCabinetDetalClick() {
      const updatedetaildto = this.cabinetdetailVO
      updatecabinetdetail(updatedetaildto).then(response => {
        if (response) {
          this.$message.success('操作成功')
          this.updateCabinetdetailVisible = false
          this.initdetail()
          this.cabinedetailtVO = {}
        }
      })
    },

    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryStation(this.searchForm1).then(response => {
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage1.total = parseInt(total)
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
    handleSizeChangecabinet(val) {
      this.cabinetVO.pageSize = val
      this.commonPage2.pageSize = val
      this.init()
    },
    handleCurrentChangecabinet(val) {
      this.cabinetVO.pageNum = val
      this.commonPage2.pageNum = val
      this.init()
    },
    handleSizeChangedetail(val) {
      this.searchFormdetail.pageSize = val
      this.initdetail()
    },
    handleCurrentChangedetail(val) {
      this.searchFormdetail.pageNum = val
      this.initdetail()
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
      batchUpdatebatterystock(arry).then(res => {
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
      this.batteryStockVO = {}
    },
    selectionChangeHandle(e) {
      if (e.length !== 0) {
        this.deletedisabled = false
      } else this.deletedisabled = true
    },
    // 1

    selectionChangeHandle1() {

    },

    handleSizeChange1(val) {
      this.searchForm1.pageSize = val
      this.commonPage1.pageSize = val
      this.searchFormclick()
    },
    handleCurrentChange1(val) {
      this.searchForm1.pageNum = val
      this.commonPage1.pageNum = val
      this.searchFormclick()
    },

    // 批量删除
    deleteSelect() {
      this.$confirm('确定要删除吗？').then(res => {
        if (res === 'confirm') {
          batchRemovebatterystock(this.$refs.muiltitable.selection).then(res => {
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
      this.$set(this.rules.cabinetcount, 0, { required: true, message: '请输入放电柜数量', trigger: 'blur' })
      queryById({ id: row.id }).then(res => {
        this.dialogType = 'addcabinet'
        this.cabinetdialogvisible = true
        this.addCabinetModel = res
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      queryById({ id: row.id }).then(res => {
        this.dialogType = 'update'
        this.cabinetdialogvisible = true
        this.addCabinetModel = res
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle1(row) {
      this.$set(this.rules.cabinetcount, 0, { required: false, message: '请输入放电柜数量', trigger: 'blur' })
      queryById({ id: row.id }).then(res => {
        this.dialogType = 'update'
        this.cabinetdialogvisible = true
        this.addCabinetModel = res
      }).catch(error => {
        console.log(error)
      })
    },
    updateCabinetDetail(row) {
      detailqueryById({ id: row.id }).then(res => {
        this.cabinetdetailVO = res
        this.updateCabinetdetailVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    maindialoghandleClose() {
      this.maindialogvisiable = false
    },
    cabinethandleClose() {
      this.cabinetdialogvisible = false
      this.cabinetdetailVO = {}
      this.$refs.addCabinetModelRef.resetFields()
    },
    addCabinetDetailhandleClose() {
      this.addCabinetdetailVisible = false
      this.cabinetdetailVO = {}
    },
    updateCabinetDetailhandleClose() {
      this.updateCabinetdetailVisible = false
      this.cabinetdetailVO = {}
    },
    deleteCabinetClick() {
      if (this.$refs.cabinetmuiltitable.selection.length === 0) {
        this.$message.info('未选中信息')
      } else {
        let data = this.$refs.cabinetmuiltitable.selection.map(item => ({ id: item.id, verson: item.version }))
        batchRemovecabinet(data).then(res => {
          if (res) {
            this.$message.success('操作成功')
            this.init()
          } else {
            this.$message.error('操作失败')
          }
        }).catch(error => {
          console.log(error)
          this.$message.error('操作失败')
        })
      }
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
