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
            <el-form-item label="车牌">
              <el-input v-model="searchForm.carNo" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="车型">
              <el-input v-model="searchForm.type" style="width:90%" clearable />
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
      <div style="  margin-bottom:10px">
        <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button>

        <!-- <el-dropdown
          split-button
          type="primary"
          style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px"
          @command="onDropdownCommand"
        >
          启停控制
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="enable_command">启用</el-dropdown-item>
            <el-dropdown-item command="disable_command">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <!-- <el-button type="primary" icon="el-icon-plus" @click="excel()">excel导出</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="excel()">excel导入</el-button> -->
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="carlist"
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
          prop="userVO.name"
          header-align="center"
          align="center"
          label="用户"
          min-width="90"
        />
        <el-table-column
          prop="carNo"
          header-align="center"
          align="center"
          label="车牌"
          min-width="90"
        />
        <el-table-column
          prop="carTrademark"
          header-align="center"
          align="center"
          label="品牌"
          min-width="90"
          :formatter="formatterCarTrademark"
        />
        <el-table-column
          prop="color"
          header-align="center"
          align="center"
          label="颜色"
          min-width="90"
        />
        <!-- <el-table-column
          prop="area"
          header-align="center"
          align="center"
          label="地图"
          min-width="90"
        /> -->
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          label="车型"
          min-width="120"
        />
        <el-table-column
          prop="batteryType"
          header-align="center"
          align="center"
          label="电池包类型"
          min-width="120"
          :formatter="formatterBatteryType"
        />

        <el-table-column
          prop="carAttribute"
          header-align="center"
          align="center"
          label="售卖类型"
          min-width="120"
        >
          <template slot-scope="{row}">
            <div>{{ row.carAttribute==='0'?'电池租用':row.carAttribute==='1'?'整车出售':'其他' }}</div>
          </template>
        </el-table-column>

        <el-table-column
          prop="initPowerPack"
          header-align="center"
          align="center"
          label="初始电池包"
          min-width="120"
        />
        <el-table-column
          prop="currentPowerPack"
          header-align="center"
          align="center"
          label="当前电池包"
          min-width="120"
        />

        <!--
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
        </el-table-column> -->

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
              @click="rowdelete(scope.row)"
            >删除</el-button>

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
        v-dialogDrag
        title="添加信息"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose"
      >
        <el-form ref="carVoref" :model="carVo" label-width="100px" :rules="carVoRules">
          <el-row>
            <el-col :span="12">

              <el-form-item label="用户" prop="userId">
                <!-- <el-input v-model="carVo.id" placeholder="" /> -->
                <el-select v-model="carVo.userId" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    size="mini"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="车牌" prop="carNo">
                <el-input v-model="carVo.carNo" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="品牌" prop="carTrademark">
                <!-- <el-input v-model="carVo.carTrademark" placeholder="" /> -->
                <el-select v-model="carVo.carTrademark" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in cartrademarklist"
                    :key="index"
                    size="mini"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="颜色" prop="color">
                <!-- <el-input v-model="carVo.color" placeholder="" /> -->
                <el-select v-model="carVo.color" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in carcolorlist"
                    :key="index"
                    size="mini"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车型" prop="type">
                <!-- <el-input v-model="carVo.type" placeholder="" /> -->
                <el-select v-model="carVo.type" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in carTypeList"
                    :key="index"
                    size="mini"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电池类型" prop="batteryType">
                <!-- <el-input v-model="carVo.batteryType" placeholder="" /> -->
                <el-select v-model="carVo.batteryType" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in initPackageTypeList"
                    :key="index"
                    size="mini"
                    :label="item.remark"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="初始电池包" prop="initPowerPack">
                <el-input v-model="carVo.initPowerPack" placeholder="" />
                <!-- <el-select v-model="carVo.initPowerPack" style="width:100%" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in initPackageList"
                    :key="index"
                    size="mini"
                    :label="item"
                    :value="item"
                  />
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前电池包" prop="currentPowerPack">
                <el-input v-model="carVo.currentPowerPack" :disabled="dialogType===`update`" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车辆属性" prop="carAttribute">
                <el-radio-group v-model="carVo.carAttribute">
                  <el-radio :disabled="dialogType===`update`" value="0" :label="0">电池租用</el-radio>
                  <el-radio :disabled="dialogType===`update`" value="1" :label="1">整车出售</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

import {
  commonQueryCar,
  addCar,
  updateCar,
  batchUpdateCar,
  removeByIdCar,
  batchRemoveCar,
  queryById,
  checkCarNo, queryPowerType } from '../../../api/car/index'
import { commonQueryUser } from '../../../api/user/index'
import { queryVehicleBrand } from '@/api/vehiclebrand/index'
export default {
  data() {
    var validateCarNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('车牌号不能为空'))
      } else {
        if (value !== '') {
          checkCarNo({ carNo: value }).then(res => {
            if (res) {
              callback(new Error('车牌号重复'))
            } else {
              callback()
            }
          })
        }
      }
    }
    // 这里存放数据
    return {
      carVo: {
        userId: '',
        carNo: '',
        batteryType: '',
        initPowerPack: '',
        currentPowerPack: '',
        carAttribute: '',
        color: '',
        type: ''
      },
      userList: [],
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      carlist: [],
      carDTO: {},
      dialogType: '',
      carVoRules: {
        carAttribute: [
          { required: true, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        carNo: [
          { validator: validateCarNo, trigger: 'blur', required: true },
          {
            pattern: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
            message: '请输入正确车牌号',
            trigger: 'blur'
          }],
        batteryType: [
          { min: 1, max: 10, required: true, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        initPowerPack: [
          { min: 1, max: 10, required: true, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        currentPowerPack: [
          { min: 1, max: 10, required: true, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择用户', trigger: 'blur' }],
        carTrademark: [{ required: true, message: '请填写正确的车辆品牌', trigger: 'blur' }],
        color: [{ required: true, message: '请选择颜色', trigger: 'blur' }],
        type: [{ required: true, message: '请选择车型', trigger: 'blur' }]
      },
      carTypeList: ['轿车', 'SUV'],
      initPackageList: ['B1', 'B2', 'B3', 'B4'],
      initPackageTypeList: [],
      carcolorlist: ['白色', '黑色', '蓝色', '红色'],
      cartrademarklist: [{ id: 1, name: '奇瑞' }, { id: 2, name: '其他' }],
      VehicleBrand: new Map()
    }
  },
  mounted() {
    this.initbatteryList()
    this.searchFormclick()
    this.initVehicleBrand()
  },

  // 方法集合
  methods: {

    initbatteryList() {
      queryPowerType().then(res => {
        this.initPackageTypeList = res.data
      })
    },

    onQuery() {
      this.searchFormclick()
    },

    async  add() {
      const res = await commonQueryUser({})
      this.userList = res.data
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      this.$refs.carVoref.validate(res => {
        if (res) {
          if (this.dialogType === 'ADD') {
            const carDTO = this.carVo
            addCar(carDTO).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.$refs.carVoref.resetFields()
              }
            })
          } else if (this.dialogType === 'update') {
            const updatecarDTO = this.carVo
            updateCar(updatecarDTO).then(response => {
              if (response) {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.$refs.carVoref.resetFields()
              }
            })
          }
        } else return
      })

      // #end
    },

    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', {
        center: true
      }).then(res => {
        removeByIdCar({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },

    rowdelete(val) {
      this.$confirm('确定要删除吗？', {
        center: true
      }).then(res => {
        removeByIdCar({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true
      commonQueryCar(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息
        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.carlist = response.data// 分页信息带回显示
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
    onDropdownCommand(methodName) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('没有选中任何数据')
      } else {
        this.$confirm('是否确定', {
          center: true
        }).then(res => {
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
      batchUpdateCar(arry).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.searchFormclick()
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleClose() {
      Object.keys(this.carVo).map(key => {
        this.carVo[key] = ''
      })
      this.dialogVisible = false
      this.$refs.carVoref.resetFields()
    },
    selectionChangeHandle(e) {
      if (e.length !== 0) {
        this.deletedisabled = false
      } else this.deletedisabled = true
    },
    // 批量删除
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('确定要删除吗？', {
          center: true
        }).then(res => {
          if (res === 'confirm') {
            batchRemoveCar(this.$refs.muiltitable.selection).then(res => {
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
    rowCopy(row) {
      this.initcommonQueryUser()
      queryById({ id: row.id }).then(res => {
        this.dialogVisible = true
        this.dialogType = 'ADD'
        this.carVo = res
      }).catch(error => {
        console.log(error)
      })
    },

    addOrUpdateHandle(row) {
      this.initcommonQueryUser()
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.carVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    async initcommonQueryUser() {
      const res = await commonQueryUser({})
      this.userList = res.data
    },
    formatterBatteryType(row) {
      let res = ''
      this.initPackageTypeList.map(item => {
        if (item.name === row.carAttribute) {
          res = item.remark
        }
      })
      return res
    },

    formatterCarTrademark(row) {
      return this.VehicleBrand.get(row.carTrademark)
    },

    initVehicleBrand() {
      queryVehicleBrand({ pageSize: 1000 }).then(res => {
        res.data.map(item => {
          this.VehicleBrand.set(item.split('-')[0], item.split('-')[1])
        })
      })
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
