<template>
  <el-container>
    <el-header style="height:120px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="onQueryCoupon"
          >
            <el-form-item label="类型">
              <el-input v-model="searchForm.subType" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" clearable placeholder="请选择">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium " @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="add()">增加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteSelect()">删除</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="distribute()">下发</el-button>
        <el-dropdown
          split-button
          type="primary"
          style="margin-left: 10px;margin-right: 10px;"
          @command="onDropdownCommand"
        >
          启停控制
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="enableCommand">启用</el-dropdown-item>
            <el-dropdown-item command="disableCommandv1">停用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </el-header>
    <el-main>
      <el-table
        ref="muiltitable"
        :data="couponList"
        style="width: 100%;"
        border
        fix
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="40"
        />
        <el-table-column
          type="index"
          label="序号"
          header-align="center"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="subTitle"
          label="标题"
          align="center"
          width="120"
        />
        <el-table-column
          prop="subType"
          label="类型"
          align="center"
          width="120"
        />
        <el-table-column
          prop="subMoney"
          label="优惠价格"
          align="center"
          width="120"
        />
        <el-table-column
          prop="couponCount"
          label="数量"
          align="center"
          width="120"
        />
        <el-table-column
          prop="startTime"
          label="开始时间"
          align="center"
          width="160"
        />
        <el-table-column
          prop="endTime"
          label="失效时间"
          align="center"
          width="160"
        />
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.status === -1" type="danger">停用</el-tag>
            <el-tag v-else type="info">过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作区"
          align="center"
          width="400"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="rowCopy(scope.row)">复制</el-button>
            <el-button size="mini" type="warning" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteHandle(scope.row)">删除</el-button>
            <!-- <el-button size="mini" icon="el-icon-view" type="primary" @click="queryHandle(scope.row)">分配</el-button> -->
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
        v-dialogDrag
        :visible.sync="adddialogVisible"
        title="添加信息"
        width="60%"
        :before-close="adddialogClose"
      >
        <el-form ref="couponVoRef" :model="couponVo" :rules="couponVoRules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="标题" label-width="100px" prop="subTitle">
                <el-input v-model="couponVo.subTitle" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="类型" label-width="100px" prop="subType">
                <el-input v-model="couponVo.subType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="优惠价格" label-width="100px" prop="subMoney">
                <el-input v-model="couponVo.subMoney" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="数量" label-width="100px" prop="couponCount">
                <el-input v-model="couponVo.couponCount" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="优惠时间" label-width="100px" prop="pickupDateList">
                <el-date-picker
                  v-model="pickupDateList"
                  style="width:100%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogClose">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        title="下发优惠卷"
        :visible.sync="distributedialogVisible"
        width="60%"
      >

        <div style="margin-left:15%">
          <el-form :model="searchUser" @keyup.enter.native="onQueryUser">
            <el-row>
              <el-col span="6">
                <el-form-item label="账号" label-width="100px">
                  <el-input v-model="searchUser.acount" />
                </el-form-item>
              </el-col>
              <el-col span="6">
                <el-form-item label="姓名" label-width="100px">
                  <el-input v-model="searchUser.name" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button v-loading="dialogLoading" type="primary" style="margin-top:2px;" size="medium " @click="dialogTableSerach">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-container>
          <div id="box_context">
            <el-table
              ref="usertable"
              :data="userList"
              border
              fix
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="80"
              />
              <el-table-column
                type="index"
                label="序号"
                header-align="center"
                align="center"
                width="80"
              />
              <el-table-column
                prop="acount"
                label="账号"
                align="center"
                width="150"
              />
              <el-table-column
                prop="name"
                label="姓名"
                align="center"
                width="80"
              />
              <el-table-column
                prop="defaultChangeWay"
                label="默认换电方式"
                align="center"
                width="120"
              />
              <el-table-column
                prop="sex"
                label="性别"
                align="center"
                width="80"
              />
              <el-table-column
                prop="birthday"
                label="生日"
                align="center"
                width="120"
              />
              <el-table-column
                prop="acountPrice"
                label="账号余额"
                align="center"
                width="80"
              />
              <el-table-column
                prop="level"
                label="等级"
                align="center"
                width="80"
              />
            </el-table>
          </div>

        </el-container>

        <span slot="footer" class="dialog-footer">
          <el-button @click="distributedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnUserClick">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import moment from 'moment'
import { commonQueryUser, addUser, removeByIdUser, updateUserLockStatus } from '../../../api/user/index'
import { commonQueryCoupon, addCoupon, updateCoupon, removeByIdCoupon, batchremoveCoupon, batchupdateCoupon, queryById } from '../../../api/coupon/index'
import { commonQueryUserCoupon, addUserCoupon, updateUserCoupon, removeByIdUserCoupon, batchaddUserCoupon, batchremoveUserCoupon, batchupdateUserCoupon } from '../../../api/userconpon/index'
import { from } from '@chenfengyuan/vue-qrcode'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      searchForm: { pageNum: 1, pageSize: 10 },
      couponList: [],
      queryLoading: false,
      adddialogVisible: false,
      distributedialogVisible: false,
      dialogType: '',
      pickupDateList: [new Date(), new Date()],
      couponVo: {
        pickupDateList: []
      },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      dialogLoading: false,
      searchUser: {},
      userList: [],
      userCouponDTO: {},
      userDTO: [],
      couponDTO: [],
      statusOptions: [
        { value: 0, label: '过期' },
        { value: 1, label: '正常' }
      ],
      couponVoRules: {
        subTitle: [{ required: true, message: '不能为空', trigger: 'blur' }],
        subType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        subMoney: [{ required: true, message: '不能为空', trigger: 'blur' }],
        couponCount: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pickupDateList: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    pickupDateList: {
      handler: function(newV, oldV) { this.couponVo.pickupDateList = newV },
      immediate: true
    }
  },
  mounted() {
    this.searchFormclick()
  },
  methods: {
    searchFormclick() {
      this.queryLoading = true
      commonQueryCoupon(this.searchForm).then(response => {
        const { total, pageSize, pageNum } = response
        this.commonPage.total = parseInt(total)
        this.couponList = response.data
        this.queryLoading = false
      }).catch(() => {
        this.queryLoading = false
        this.$message.error('网络异常')
      })
    },
    onQueryCoupon() {
      this.searchFormclick()
    },
    onQueryUser() {
      this.dialogTableSerach()
    },
    add() {
      this.couponVo = {}

      this.pickupDateList = []
      this.pickupDateList.push(new Date(), new Date())
      this.dialogType = 'ADD'
      this.adddialogVisible = true
    },
    onBtnSaveClick() {
      this.$refs.couponVoRef.validate((valid) => {
        if (valid) {
          const couponDTO = this.couponVo
          const startTime = this.pickupDateList[0]
          const endTime = this.pickupDateList[1]
          couponDTO.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
          couponDTO.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
          if (this.dialogType === 'ADD') {
            addCoupon(couponDTO).then(response => {
              this.$message.success('操作成功')
              this.adddialogVisible = false
              this.searchFormclick()
              this.$refs.couponVoRef.resetFields()
            })
          } else if (this.dialogType === 'update') {
            updateCoupon(couponDTO).then(response => {
              this.$message.success('更新成功')
              this.adddialogVisible = false
              this.searchFormclick()
              this.$refs.couponVoRef.resetFields()
            })
          }
        }
      })
    },
    deleteSelect() {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否批量删除', {
          center: true
        }).then(res => {
          if (res === 'confirm') {
            batchremoveCoupon(this.$refs.muiltitable.selection).then(res => {
              if (res) {
                this.$message.success('删除成功')
                this.searchFormclick()
              } else {
                this.$message.warning('优惠券正在使用中 无法删除')
              }
            }).catch(error => {
              this.$message.warning('优惠券正在使用中 无法删除')
              console.log(error)
            })
          }
        })
      }
    },
    rowCopy(row) {
      queryById({ id: row.id }).then(res => {
        const v1 = new Date(res.startTime)
        const v2 = new Date(res.endTime)
        this.pickupDateList.length = 0
        this.pickupDateList.push(v1, v2)
        this.couponVo = res
        this.dialogType = 'ADD'
        this.adddialogVisible = true
      }).catch((error) => {
        console.log(error)
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.id }).then(res => {
        this.couponVo = res
        this.adddialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    deleteHandle(row) {
      this.$confirm('确定要删除吗？').then(res => {
        if (res === 'confirm') {
          removeByIdCoupon({ id: row.id }).then(res => {
            this.$message.success('删除成功')
            this.searchFormclick()
          }).catch(error => {
            this.$message.warning('该优惠券正在使用')
            console.log(error)
          })
        }
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
    // 下发
    distribute() {
      this.distributedialogVisible = true
      this.dialogTableSerach()
    },
    // 添加用户优惠卷
    onBtnUserClick() {
      const userDTO = this.$refs.usertable.selection
      const couponDTO = this.$refs.muiltitable.selection
      const userCouponList = []

      if (userDTO.length === 0) {
        this.$message.info('未选中用户')
      } else if (couponDTO.length === 0) {
        this.$message.info('未选中优惠卷')
      } else {
        couponDTO.forEach(item1 => {
          console.log(item1.id)
          userDTO.forEach(item2 => {
            console.log(item1.id, item2.id)
            userCouponList.push({ userId: item2.id, couponId: item1.id })
          })
        })

        this.distributedialogVisible = false
        batchaddUserCoupon(userCouponList).then(res => {
          this.$message.success('下发成功')
          this.distributedialogVisible = false
          this.userDTO = {}
          this.couponDTO = {}
          this.searchFormclick()
        }).catch(() => {
          this.$message.error('下发失败')
        })
      }
    },
    // 查询用户
    dialogTableSerach() {
      this.dialogLoading = true
      commonQueryUser(this.searchUser).then(response => {
        this.userList = response.data
        this.dialogLoading = false
      }).catch(() => {
        this.dialogLoading = false
        this.$message.error('网络异常')
      })
    },
    queryHandle(row) {
      this.$router.push({ path: 'usercoupon', query: { id: row.id }})
    },
    onDropdownCommand(command) {
      debugger
      this[command]()
    },
    enableCommand() {
      this.doCommand(1)
    },
    disableCommandv1() {
      this.doCommand(-1)
    },
    doCommand(status) {
      if (this.$refs.muiltitable.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.$confirm('是否更改?', { center: true }).then(res => {
          if (res === 'confirm') {
            let dataList = []
            this.$refs.muiltitable.selection.map(item => {
              dataList.push({ id: item.id, version: item.version, status })
            })
            batchupdateCoupon(dataList).then(res => {
              if (res) {
                this.searchFormclick()
                this.$message.success('修改成功')
              }
            })
          }
        })
      }
    },
    adddialogClose() {
      this.$refs.couponVoRef.resetFields()
      this.adddialogVisible = false
    }
  }
}
</script>

<style lang="css" scoped>
  .el-header {
    background-color: #ffffff;
  }
  .el-main {
    background-color: #ffffff;
    text-align: center;
  }
  #box_context{
    margin: 0 auto;
   /* display:flex;
  align-items: center;
  width: 100%; */
  /* justify-content: center; */
  }
</style>
