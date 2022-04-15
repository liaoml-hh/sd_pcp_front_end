<template>

  <el-container>
    <el-header style="height:120px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="packsearchForm"
            @keyup.enter.native="onQuery"
          >
            <el-form-item label="站点">
              <el-select
                v-model="packsearchForm.id"
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
        <!-- <el-dropdown
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
        </el-dropdown> -->
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
            <span>{{ scope.$index + 1 +(packsearchForm.pageNum===1?0:commonPage.pageSize*(packsearchForm.pageNum-1)) }}</span>
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

        <el-table-column

          header-align="center"
          align="center"
          width="250"
          label="操作"
        >
          <template slot-scope="scope">
            <!-- <el-button
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
            >删除</el-button> -->

            <el-button
              type="primary"
              size="mini"
              @click="showDetail(scope.row)"
            >查看明细</el-button>
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
              <!--  -->
              <el-button type="primary" @click="addCabinetClick">插入换电柜</el-button>
            </div>

          </el-row>
          <div>

            <el-dialog
              v-dialogDrag
              width="50%"
              title="插入换电柜"
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
                  <el-col :span="10"> <el-form-item label="最大电池量">
                    <el-input v-model="addCabinetModel.maxQuantity" value="24" :disabled="true" placeholder="24" />
                  </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="当前剩余电池">
                      <el-input v-model="addCabinetModel.currentQuantity" value="24" :disabled="true" placeholder="24" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="电池类型" prop="dictionaryTypeId">
                      <el-select
                        v-model="addCabinetModel.batteryType"
                        clearable
                        placeholder="电池类型"
                        style="width:100%"
                      >
                        <el-option
                          v-for="(item,index) in dictionary"
                          :key="index"
                          :label="item.name"
                          :value="item.name"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="放电柜数量" prop="cabinetcount">
                      <el-input v-model="count" placeholder="" />
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
            ref="muiltitable"
            v-loading="cabinetLoading"
            :data="cabinetlist"
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
            />
            <!-- <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column> -->
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
                <el-button
                  size="mini"
                  plain
                  @click="addCabinetDetailClick(scope.row)"
                >增加</el-button>
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
            :v-model="commonPage"
            :page-count="commonPage.pageCount"
            :page-size="commonPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="commonPage.total"
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

      <el-dialog
        v-dialogDrag
        width="50%"
        title="插入换电柜明细"
        :visible.sync="addCabinetdetailVisible"
        append-to-body
        :before-close="addCabinetDetailhandleClose"
      >
        <el-form :model="cabinetdetailVO" label-width="100px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="柜号" prop="cabinetcode">
                <el-input v-model="cabinetdetailVO.code" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="包名" prop="packageName">
                <el-input v-model="cabinetdetailVO.packageName" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电池类型" prop="batteryType">
                <el-select
                  v-model="cabinetdetailVO.batteryType"
                  clearable
                  placeholder="电池类型"
                  style="width:100%"
                >
                  <el-option
                    v-for="(item,index) in dictionary"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="插入数量" prop="detailcount">
                <el-input v-model.number="detailcount" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCabinetdetailVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveCabinetDetalClick">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        width="80%"
        title="编辑明细"
        :visible.sync="editVisible"
        :v-model="searchFormdetail"
        append-to-body
      >
        <el-table
          ref="muiltitable"
          v-loading="cabinetdetailLoading"
          :data="cabinetdetaillist"
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
          />
          <!-- <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column> -->
          <el-table-column
            prop="code"
            header-align="center"
            align="center"
            label="柜号"
            min-width="105"
          />
          <el-table-column
            prop="batteryType"
            header-align="center"
            align="center"
            label="电池类型"
            min-width="105"
          />
          <el-table-column
            prop="packageName"
            header-align="center"
            align="center"
            label="电池包"
            min-width="105"
          />
          <!-- <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="250"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="updateCabinetDetail(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deleteHandle1(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div style="float:left;">
          <el-pagination
            :v-model="commonPagedetail"
            :page-count="commonPagedetail.pageCount"
            :page-size="commonPagedetail.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="commonPagedetail.total"
            @size-change="handleSizeChangedetail"
            @current-change="handleCurrentChangedetail"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        width="50%"
        title="修改明细"
        :visible.sync="updateCabinetdetailVisible"
        append-to-body
        :before-close="updateCabinetDetailhandleClose"
      >
        <el-form :model="cabinetdetailVO" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="柜号">
                <el-input v-model="cabinetdetailVO.code" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="包名">
                <el-input v-model="cabinetdetailVO.packageName" placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-form-item label="电池类型">
                <el-select
                  v-model="cabinetdetailVO.batteryType"
                  clearable
                  placeholder="电池类型"
                  style="width:215px"
                >
                  <el-option
                    v-for="(item,index) in dictionary"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateCabinetDetailhandleClose">取 消</el-button>
          <el-button type="primary" @click="onBtnupdateCabinetDetalClick">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展开站点的明细 -->
      <el-dialog
        v-dialogDrag
        width="80%"
        title="展开站点的明细"
        :visible.sync="showdetail"
        append-to-body
      >
        <!-- :before-close="updateCabinetDetailhandleClose" -->
        <div>
          <el-table
            :data="detailList"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  :data="scope.row.cabinetDetailVOS"
                  style="width: 100%"
                >  <el-table-column
                     prop="code"
                     header-align="center"
                     align="center"
                     label="编码"
                     min-width="105"
                   />
                  <el-table-column
                    prop="batteryType"
                    header-align="center"
                    align="center"
                    label="类型"
                    min-width="105"
                  />
                  <el-table-column
                    prop="packageName"
                    header-align="center"
                    align="center"
                    label="包名"
                    min-width="105"
                  />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              prop="code"
              header-align="center"
              align="center"
              label="柜号"
              min-width="105"
            />
            <el-table-column
              prop="maxQuantity"
              header-align="center"
              align="center"
              label="最大存储"
              min-width="105"
            />
            <el-table-column
              prop="currentQuantity"
              header-align="center"
              align="center"
              label="最小存储"
              min-width="105"
            />
            <el-table-column
              prop="batteryType"
              header-align="center"
              align="center"
              label="类型"
              min-width="105"
            />
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showdetail=!showdetail">取 消</el-button>
          <el-button type="primary" @click="showdetail=!showdetail">确 定</el-button>
        </span>
      </el-dialog>

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
      count: '',
      detailcount: '',
      cabinetVO: {},
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
      packsearchForm: { pageNum: 1, pageSize: 10 },
      searchFormdetail: {},
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
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
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        code: [{ required: true, message: '请输入柜号', trigger: 'blur' }],
        stationId: [{ required: true, message: '请输入站点', trigger: 'blur' }],
        dictionaryTypeId: [{ required: true, message: '请输入电池类型', trigger: 'blur' }],
        cabinetcount: [{ required: true, message: '请输入放电柜数量', trigger: 'blur' }],
        detailcount: [{ required: true, message: '请输入放电柜明细数量', trigger: 'blur' }],
        packageName: [{ required: true, message: '请输入包名', trigger: 'blur' }],
        batteryType: [{ required: true, message: '请输入电池类型', trigger: 'blur' }],
        cabinetcode: [{ required: true, message: '请输入柜号', trigger: 'blur' }]
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
      commonQuerycabinet(this.packsearchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
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
        // eslint-disable-next-line no-unused-vars
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
        for (let i = 0; i < this.count; i++) {
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
          this.$message.success('操作成功')
          this.init()
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
          this.cabinetdetailVO = {}
        }
      })
    },
    onBtnSaveCabinetClick() {
      const countInserList = []
      for (let i = 0; i < this.count; i++) {
        countInserList.push(this.addCabinetModel)
      }
      bathAddcabinet(countInserList).then(response => {
        if (response) {
          this.$message.success('操作成功')
          this.cabinetdialogvisible = false
          this.init()
          this.cabinetVO = {}
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
      commonQueryStation(this.searchForm).then(response => {
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
    handleSizeChangecabinet(val) {
      this.searchForm.pageSize = val
      this.init()
    },
    handleCurrentChangecabinet(val) {
      this.searchForm.pageNum = val
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
            //   this[methodName]() <===>this.xxxx() 二者相等
            // 意为传入方法名称(methodName)通过this.方法名()调用 如 methodName的值为disableHandle 则调用的方法为 this.disableHandle()方法
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
      queryById({ id: row.id }).then(res => {
        this.cabinedetailtVO = res
        this.addCabinetdetailVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'adddetail'
      queryById({ id: row.id }).then(res => {
        this.cabinetdetailVO = res
        this.addCabinetdetailVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle1(row) {
      commonQuerycabinetdetail({ cabinetId: row.id }).then(res => {
        const { total, pageNum, pageSize } = res// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPagedetail.total = parseInt(total)
        this.cabinetdetaillist = res.data
        this.cabinetdeatilID = row.id
        this.editVisible = true
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
