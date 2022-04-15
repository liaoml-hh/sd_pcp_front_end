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
            <el-form-item label="车辆属性">
              <el-select
                v-model="searchForm.carAttribute"
                clearable
                placeholder="车辆属性"
              >
                <el-option

                  v-for="(item,index) in carTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!-- <el-input v-model="searchForm.mechineType" style="width:90%" clearable size="mini" /> -->
            </el-form-item>
            <el-form-item label="收费名称">
              <el-input v-model="searchForm.projectItemName" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="区域">
              <el-input v-model="searchForm.extend1" style="width:90%" clearable />
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div style="  margin-bottom:10px">
        <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect">删除</el-button>
        <!-- <el-button type="primary" icon="el-icon-document" @click="copy()">复制</el-button> -->
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
          width="80"
          type="index"
        > <template slot-scope="scope">
          <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="carAttribute"
          header-align="center"
          align="center"
          label="车辆属性"
          min-width="110"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.carAttribute==="1"?"整车出售":"车电分离" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectItemName"
          header-align="center"
          align="center"
          label="收费名称"
          min-width="90"
        />
        <el-table-column
          prop="price"
          header-align="center"
          align="center"
          label="价格(元)"
          min-width="90"
        />
        <el-table-column
          prop="extend1"
          header-align="center"
          align="center"
          label="区域"
          min-width="90"
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
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
      >
        <div style="margin-left:-30px;">
          <el-form ref="formName" :model="feeitem" label-width="100px" :rules="updataformrules">
            <el-row>
              <el-col :span="12">
                <el-form-item label="车辆属性" prop="carAttribute">
                  <el-select
                    v-model="feeitem.carAttribute"
                    clearable
                    placeholder="车辆属性"
                    style="width:100%"
                  >
                    <el-option
                      v-for="(item,index) in carTypeList"
                      :key="index"
                      size="small"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="区域名称" prop="extend1">
                  <!-- <el-input v-model="feeitem.extend1" value="1" /> -->
                  <el-select
                    v-model="feeitem.extend1"
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
              <!-- <el-col :span="12">
                <el-form-item label="站点" prop="stationId">
                  <el-select
                    v-model="feeitem.stationId"
                    clearable
                    placeholder="站点"
                    style="width:100%"
                  >
                    <el-option
                      v-for="(item,index) in carTypeList"
                      :key="index"
                      size="small"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>

                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="收费名称" prop="projectItemName">
                  <el-input v-model="feeitem.projectItemName" placeholder="项目名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="价格(元)" prop="price">
                  <el-input v-model="feeitem.price" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
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
            </el-row> -->

            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="区域" prop="extend1">
                  <el-input v-model="feeitem.extend1" value="1" />
                </el-form-item>
              </el-col>
            </el-row> -->

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

import { commonQueryFeeItem, addFeeItem, removeByIdFeeItem, batchRemoveFeeItem, queryByIdFeeItem, updateFeeItem } from '../../../api/feeitem/index'
import { commonQueryArea } from '@/api/area/area'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      machinelist: [],
      searchLoading: false,
      areaNamelist: [],
      tempAreaNameList: [],
      carTypeList: [{ name: '电池租用', id: '0' }, { name: '整车出售', id: '1' }],
      feeitem: {
        carAttribute: '',
        stationId: '',
        projectItemName: '',
        price: '',
        extend1: ''
      },
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      dialogType: '',
      dialogTitle: '',
      updataformrules: {
        carAttribute: [
          { required: true, message: '请选择车辆属性', trigger: 'blur' }

        ],
        projectItemName: [
          { required: true, message: '请输入收费名称', trigger: 'blur' }

        ],
        price: [
          { required: true, message: '请输入费用', trigger: 'blur' },
          { message: '请输入正确格式 如:12.2', trigger: 'blur', pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/ }
        ],
        extend1: [
          { required: false, message: '请输入区域', trigger: 'blur' }

        ]
        // stationId: [
        //   { required: true, message: '请输入折扣,没有折扣为1', trigger: 'blur' }
        // ]
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.commonQueryAreaList()
    this.searchFormclick()
  },
  methods: {
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.dialogType = 'ADD'
      this.dialogTitle = '添加数据'
      this.dialogVisible = true
    },
    // 添加和编辑方法
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            if (this.dialogType === 'ADD') {
              const mechineDTO = this.feeitem
              addFeeItem(mechineDTO).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
              }).finally(() => {
                this.$refs[form].resetFields()
              })
            } else if (this.dialogType === 'update') {
              const mechineDTO = this.feeitem
              updateFeeItem(mechineDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                }
                this.searchFormclick()
              }).finally(() => {
                this.$refs[form].resetFields()
              })
            }
          }
        })
    },
    onBtnCancelClick() {
      this.dialogVisible = false
      this.$refs.formName.resetFields()
      Object.keys(this.feeitem).map(key => {
        this.feeitem[key] = ''
      })
    },

    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', {
        center: true
      }).then(res => {
        removeByIdFeeItem({ id: val.id }).then(response => {
          if (response) {
            this.$message.success('操作成功')
            this.searchFormclick()
          } else this.searchFormclick()
        })
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonQueryFeeItem(this.searchForm).then(response => {
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
            batchRemoveFeeItem(datalist).then(res => {
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
      queryByIdFeeItem({ id: val.id }).then(res => {
        this.feeitem = res
        this.dialogTitle = '修改数据'
        this.dialogType = 'update'
        this.dialogVisible = true
      })
    },
    rowCopy(val) {
      queryByIdFeeItem({ id: val.id }).then(res => {
        this.feeitem = res
        this.dialogTitle = '添加数据'
        this.dialogType = 'ADD'
        this.dialogVisible = true
      })
    },
    onDropdownCommand(e) {
      console.log('onDropdownCommand')
    },
    handleClose() {
      this.dialogVisible = false
      this.dialogTitle = ''
      this.dialogType = ''
      this.$refs.formName.resetFields()
      Object.keys(this.feeitem).map(key => {
        this.feeitem[key] = ''
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
