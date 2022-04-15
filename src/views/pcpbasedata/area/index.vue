<template>
  <el-container>
    <el-header style="height:120px">
      <div>
        <el-form
          :inline="true"
          :model="searchForm"
          @keyup.enter.native="onQuery"
        >
          <el-form-item label="区域">
            <el-input v-model="searchForm.area" style="width:90%" clearable />
          </el-form-item>
          <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" @click="searchFormclick">查询</el-button>
        </el-form>
      </div>
      <div style="  margin-bottom:10px">
        <el-button type="primary" icon="el-icon-plus" @click="add">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect">删除</el-button>
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
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="muiltitable"
        v-loading="queryLoading"
        :data="arealist"
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
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="province"
          header-align="center"
          align="center"
          label="省"
          min-width="90"
        />
        <el-table-column
          prop="city"
          header-align="center"
          align="center"
          label="市"
          min-width="90"
        />
        <el-table-column
          prop="area"
          header-align="center"
          align="center"
          label="区"
          min-width="90"
        />
        <el-table-column
          prop="code"
          header-align="center"
          align="center"
          label="区域编码"
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
        <el-form ref="areaVo" :model="areaVo" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="省" prop="province" label-width="100px">
                <!-- <el-input v-model="areaVo.province" style="width:220px" placeholder="" /> -->
                <el-select v-model="areaVo.province" style="width:100%" placeholder="请选择" @change="provinceChange">
                  <el-option
                    v-for="(item,index) in provinceList"
                    :key="index"
                    :label="item.name"
                    :value="index"
                  />

                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="市" prop="city" label-width="100px">
                <!-- <el-input v-model="areaVo.city" style="width:220px" placeholder="" /> -->
                <el-select v-model="areaVo.city" style="width:100%" placeholder="请选择" @change="cityChange">
                  <el-option
                    v-for="(item,index) in cityList"
                    :key="index"

                    :label="item.name"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="区" prop="area" label-width="100px">
                <!-- <el-input v-model="areaVo.area" style="width:220px" placeholder="" /> -->
                <el-select v-model="areaVo.area" style="width:100%" placeholder="请选择" @change="areaChange">
                  <el-option
                    v-for="(item,index) in areaList"
                    :key="index"

                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编码" prop="code" label-width="100px">
                <el-input v-model="areaVo.code" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick('areaVo')">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { from } from '@chenfengyuan/vue-qrcode'
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryArea, addArea, updateArea, batchRemoveArea, batchUpdateArea, queryById, removeByIdArea } from '../../../api/area/area'
import aera from './province.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      areaVo: {
        province: '', city: '', area: '', code: ''
      },
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      arealist: [],
      areaDTO: {},
      dialogType: '',
      provinceList: aera,
      cityList: null,
      areaList: null,
      rules: {
        province: [
          { required: true, message: '请选择省份', trigger: 'blur' }

        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'blur' }

        ],
        area: [
          { required: true, message: '请选择区域', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请选择编码', trigger: 'blur' }
        ]
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
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {},
  // 方法集合
  methods: {
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.cityList = null
      this.areaList = null
      /**
       * 清空对象属性的值
       */
      Object.keys(this.areaVo).map(key => {
        this.areaVo[key] = ''
      })

      this.provinceList = aera
      this.dialogType = 'ADD'
      this.dialogVisible = true
    },
    rowCopy(row) {
      this.dialogType = 'ADD'
      queryById({ id: row.id }).then(res => {
        this.initDialogProvince(res)
        this.areaVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      if (this.$refs.muiltitable.selection.length > 1) {
        this.$message.error('不允许勾选多条记录')
      } else {
        this.dialogType = 'update'
        queryById({ id: row.id }).then(res => {
          this.initDialogProvince(res)
          this.areaVo = res
          this.dialogVisible = true
        }).catch(error => {
          console.log(error)
        })
      }
    },

    initDialogProvince(res) {
      this.provinceList.map(item => {
        if (res.province === item.name) {
          this.cityList = item.city
          this.cityList.map(item => {
            if (res.city === item.name) {
              this.areaList = item.districtAndCounty
            }
          })
        }
      })
    },
    // 添加和编辑方法
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            if (this.dialogType === 'ADD') {
              const areaDTO = this.areaVo
              addArea(areaDTO).then(response => {
                this.$message.success('操作成功')
                this.dialogVisible = false
                this.searchFormclick()
                this.areaVo = {}
              })
            } else if (this.dialogType === 'update') {
              const areaDTO = this.areaVo
              updateArea(areaDTO).then(response => {
                if (response) {
                  this.$message.success('操作成功')
                  this.dialogVisible = false
                  this.searchFormclick()
                  this.areaVo = {}
                }
              })
            } else if (this.dialogType === 'audit') {
              this.dialogVisible = false
            }
          }
        })
    },
    // 删除方法
    deleteHandle(val) {
      this.$confirm('确定要删除吗？', { center: true }).then(res => {
        removeByIdArea({ id: val.id }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      })
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonQueryArea(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageCount = pageNum
        // this.commonPage.pageSize = pageSize
        this.arealist = response.data// 分页信息带回显示
        this.queryLoading = false // 关闭查询
      }).catch(() => {
        this.queryLoading = false // 关闭查询
        this.$message.error('网络异常')
      })
    },
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中任何记录')
      } else {
        const byremovelist = []

        this.$refs.muiltitable.selection.map(item => {
          const { id, version } = item
          byremovelist.push({ id, version })
        })

        this.$confirm('确定要删除吗？').then(res => {
          if (res === 'confirm') {
            batchRemoveArea(byremovelist).then(res => {
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
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.commonPage.pageSize = val
      this.searchFormclick()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNum = val
      this.searchFormclick()
    },
    provinceChange(val) {
      const provinceObj = this.provinceList[val]
      this.areaVo.province = provinceObj.name
      this.cityList = provinceObj.city
      this.areaVo.city = this.cityList[0].name
      this.areaList = this.cityList[0].districtAndCounty
      this.areaVo.area = this.cityList[0].districtAndCounty[0]
    },
    cityChange(val) {
      const cityObj = this.cityList[val]
      this.areaVo.city = cityObj.name

      this.areaList = cityObj.districtAndCounty
      this.areaVo.area = cityObj.districtAndCounty[0]
    },
    areaChange(val) {
      // eslint-disable-next-line no-empty
      if (this.dialogType === 'ADD') {
      }

      const areaObj = this.areaList[val]
      this.areaVo.area = areaObj
    },
    onDropdownCommand(command) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.error('未选中任何记录')
      } else {
        const updateList = []
        this.$refs.muiltitable.selection.map(item => {
          // const { id, version } = item
          item.status = command
          updateList.push(item)
        })
        batchUpdateArea(updateList).then(res => {
          if (res) {
            this.$message.success('操作成功')
            this.searchFormclick()
          }
        }).catch(() => {
          this.$message.error('操作失败')
        })
      }
    },
    selectionChangeHandle() {

    },
    handleClose() {

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
