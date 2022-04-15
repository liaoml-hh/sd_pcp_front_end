<template>
  <el-container>
    <el-header style="height:120px">
      <div>
        <el-row>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户">
              <el-select v-model="searchForm.userId" clearable placeholder="请选择">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  size="mini"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <el-table
        :data="usercouponList"
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
          prop="userVO.name"
          label="用户姓名"
          align="center"
          width="120"
        />
        <el-table-column
          prop="userVO.acount"
          label="用户账号"
          align="center"
          width="120"
        />
        <el-table-column
          prop="basicCouponVO.subTitle"
          label="优惠卷标题"
          align="center"
          width="120"
        />
        <el-table-column
          prop="basicCouponVO.subType"
          label="优惠卷类型"
          align="center"
          width="120"
        />
        <el-table-column
          prop="basicCouponVO.subMoney"
          label="优惠价格"
          align="center"
          width="120"
        />
        <el-table-column
          prop="createdTime"
          label="领取时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="basicCouponVO.startTime"
          label="开始时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="basicCouponVO.endTime"
          label="结束时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success">已使用</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="info">未使用</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="warning">已过期</el-tag>
            <el-tag v-else type="danger">其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="false"
          label="操作区"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" :disabled="scope.row.status === 0?true: false" size="mini" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
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
        title="添加信息"
        :visible.sync="dialogVisible"
        width="65%"
      >
        <div>
          <el-form :model="couponVo">
            <el-row>
              <el-col :span="12">
                <el-form-item label="标题" label-width="100px">
                  <el-input v-model="couponVo.subTitle" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型" label-width="100px">
                  <el-input v-model="couponVo.subType" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="优惠价格" label-width="100px">
                  <el-input v-model="couponVo.subMoney" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="优惠时间" label-width="100px">
                  <el-date-picker
                    v-model="pickupDateList"
                    type="datetimerange"
                    style="width:100%"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
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
export default {
  data() {
    return {
      userList: [],
      usercouponList: [],
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      dialogType: '',
      dialogVisible: false,
      pickupDateList: [new Date(), new Date()],
      couponVo: {},
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      statusOptions: [
        { value: 0, label: '已使用' },
        { value: 1, label: '未使用' },
        { value: 2, label: '已过期' }

      ]
    }
  },
  mounted() {
    this.searchFormclick()
    this.initData()
    console.log(this.$router)
  },
  methods: {
    initData() {
      commonQueryUser({ pageSize: 10000 }).then(res => {
        this.userList = res.data
      })
    },
    searchFormclick() {
      this.queryLoading = true
      this.searchForm.couponId = this.$route.query.id
      commonQueryUserCoupon(this.searchForm).then(response => {
        const { total, pageSize, pageNum } = response
        this.commonPage.total = parseInt(total)
        this.usercouponList = response.data
        this.queryLoading = false
      }).catch(() => {
        this.queryLoading = false
        this.$message.error('网络异常')
      })
    },
    addOrUpdateHandle(row) {
      this.dialogType = 'update'
      queryById({ id: row.basicCouponVO.id }).then(res => {
        const v1 = new Date(res.startTime)
        const v2 = new Date(res.endTime)
        this.pickupDateList.length = 0
        this.pickupDateList.push(v1, v2)
        this.couponVo = res
        this.dialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    onBtnSaveClick() {
      const couponDTO = this.couponVo
      const startTime = this.pickupDateList[0]
      const endTime = this.pickupDateList[1]
      couponDTO.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
      couponDTO.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
      updateCoupon(couponDTO).then(res => {
        this.$message.success('更新成功')
        this.dialogVisible = false
        this.searchFormclick()
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
