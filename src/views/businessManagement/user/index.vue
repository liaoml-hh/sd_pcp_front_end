<template>
  <el-container>
    <el-header style="height:40px">
      <div>
        <el-row>
          <el-form
            :inline="true"
            :model="searchForm"
            @keyup.enter.native="onQuery"
          >
            <el-form-item label="姓名">
              <el-input v-model="searchForm.name" style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="searchForm.acount" style="width:90%" clearable />
            </el-form-item>
            <el-button v-loading="queryLoading" type="primary" style="margin-top:3px;margin-left:20px" size="medium" @click="searchFormclick">查询</el-button>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-button size="medium" type="primary" @click="sendPart">发送通知</el-button>
            <el-button size="medium" type="primary" @click="sendAll">全部发送</el-button>
          </el-col>
        </el-row>
      </div>
    </el-header>

    <el-main>
      <el-table
        ref="multipleSeleted"
        v-loading="queryLoading"
        :data="userlist"
        style="width: 100%;margin-top:50px"
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
          prop="acount"
          header-align="center"
          align="center"
          label="账号"
          min-width="90"
        />
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="姓名"
          min-width="90"
        />
        <el-table-column
          prop="defaultChangeWay"
          header-align="center"
          align="center"
          label="默认换电方式"
          min-width="90"
        >
          <template slot-scope="scope">
            <div contenteditable="true">
              {{ scope.row.defaultChangeWay==='1'?'里程':scope.row.defaultChangeWay==='2'?'电量':scope.row.defaultChangeWay==='3'?'次数':'未定义' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sex"
          header-align="center"
          align="center"
          label="性别"
          min-width="90"
        >
          <template slot-scope="{row}">
            <span> {{ row.sex == 1 ? '男' :row.sex == 2 ? '女' : row.sex==0?'未知':row.sex }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="area"
          header-align="center"
          align="center"
          label="地图"
          min-width="90"
        /> -->
        <el-table-column
          prop="birthday"
          header-align="center"
          align="center"
          label="生日"
          min-width="120"
        />
        <el-table-column
          prop="acountPrice"
          header-align="center"
          align="center"
          label="账户余额"
          min-width="120"
        />
        <el-table-column
          prop="level"
          header-align="center"
          align="center"
          label="等级"
          min-width="120"
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
          fixed="right"
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
            >复制</el-button> -->
            <el-button
              v-show="false"
              size="mini"
              type="warning"
              @click="addOrUpdateHandle(scope.row)"
            >编辑</el-button>
            <el-button
              :type="scope.row.status===1?`primary`:scope.row.status===-1?`danger`:`infor`"
              size="mini"
              @click="updateUserLockStatus(scope.row)"
            >{{ scope.row.status===1?"锁定用户":scope.row.status===-1?"解锁用户":"未定义" }}</el-button>
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
        <el-form :inline="true" :model="userVo">

          <el-form-item label="账号">
            <el-input v-model="userVo.acount" placeholder="" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="userVo.name" placeholder="" />

          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="userVo.sex" placeholder="" />
          </el-form-item>

          <el-form-item label="生日">
            <el-input v-model="userVo.birthday" placeholder="" />
          </el-form-item>

          <el-form-item label="账户余额">
            <el-input v-model="userVo.acountPrice" placeholder="" />
          </el-form-item>

          <el-form-item label="等级">
            <el-input v-model="userVo.level" placeholder="" />
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onBtnSaveClick">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        v-dialogDrag
        title="添加通知"
        :visible.sync="sendDialogVisible"
        width="40%"
        :before-close="sendDialogClose"
      >
        <div>
          <el-form ref="msgRuleForm" :model="msg" :rules="msgRules">
            <el-form-item label="消息内容" prop="notifyText">
              <el-input
                v-model="msg.notifyText"
                type="textarea"
                :rows="4"
                maxlength="256"
                placeholder="请输入内容(限字数256)"
              />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="sendDialogClose">取 消</el-button>
          <el-button type="primary" @click="saveMessage">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>

// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryUser, addUser, removeByIdUser, updateUserLockStatus } from '../../../api/user/index'
import { commonMsg, sendPart, sendAll } from '../../../api/sendmessage/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      msg: {
        notifyText: ''
      },
      sendDialogVisible: false,
      userVo: {},
      arealist: [],
      dialogVisible: false,
      loading: true,
      queryLoading: false,
      searchForm: { pageNum: 1, pageSize: 10 },
      commonPage: { total: 10, pageCount: 1, pageSize: 10 },
      userlist: [],
      userDTO: {},
      dialogType: '',
      actionType: '',
      msgRules: { notifyText: [{ required: true, message: '请输入消息', trigger: 'blur' }] }
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

  // 方法集合
  methods: {

    saveMessage() {
      this.$refs.msgRuleForm.validate(valid => {
        if (valid) {
          if (this.actionType === 'sendPart') {
            if (this.$refs.multipleSeleted.selection.length === 0) {
              this.$message.info('未选中任何记录')
            } else {
              let msgLis = []
              this.$refs.multipleSeleted.selection.map(item => {
                let obj = { userId: item.id, notifyText: this.msg.notifyText }
                msgLis.push(obj)
              })
              sendPart(msgLis).then(res => {
                if (res) {
                  this.$message.success('发送成功,等待对方阅读')
                  this.$refs.msgRuleForm.resetFields()
                  this.sendDialogVisible = false
                  this.actionType = ''
                  this.msg.notifyText = ''
                  return
                }
              })
            }
          } else if (this.actionType === 'sendAll') {
            sendAll(this.msg).then(res => {
              if (res) {
                this.$message.success('发送成功,等待对方阅读')
                this.$refs.msgRuleForm.resetFields()
                this.sendDialogVisible = false
                this.msg.notifyText = ''
                this.actionType = ''
                return
              }
            })
          } else return
        }
      })
    },
    sendPart() {
      if (this.$refs.multipleSeleted.selection.length === 0) {
        this.$message.info('未选中记录')
      } else {
        this.actionType = 'sendPart'
        this.sendDialogVisible = true
      }
    },
    sendAll() {
      this.actionType = 'sendAll'
      this.sendDialogVisible = true
    },
    onQuery() {
      this.searchFormclick()
    },
    add() {
      this.dialogType = 'ADD'
      this.dialogVisible = true

      commonQueryUser().then(res => {
        this.userlist = res.data
      })
    },
    // 添加和编辑方法
    onBtnSaveClick() {
      if (this.dialogType === 'ADD') {
        const userDTO = this.userVo

        addUser(userDTO).then(response => {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.searchFormclick()
        })
      }
    },
    // 删除方法
    /**
     * 用户解锁或者上锁
     */
    updateUserLockStatus(val) {
      this.$confirm('锁定用户后,用户不可以登录。解锁后方能登录，是否继续操作?', {
        center: true
      }).then(res => {
        let status = 0
        if (val.status === 1) {
          status = -1
        } else if (val.status === -1) {
          status = 1
        }
        updateUserLockStatus({ id: val.id, version: val.version, status }).then(response => {
          this.$message.success('操作成功')
          this.searchFormclick()
        })
      }).catch(() => {})
    },
    addOrUpdateHandle(val) {

    },
    deleteHandle(val) {
      this.$confirm('确定要删除吗？').then(res => {
        if (res === 'confirm') {
          removeByIdUser({ id: val.id }).then(response => {
            this.$message.success('操作成功')
            this.searchFormclick()
          })
        }
      }).catch(() => {})
    },
    // 发起查询
    searchFormclick() {
      this.queryLoading = true

      commonQueryUser(this.searchForm).then(response => {
        // eslint-disable-next-line no-unused-vars
        const { total, pageNum, pageSize } = response// 如果异常则被axios 的拦截器拦截并且显示错误码和消息

        this.commonPage.total = parseInt(total)
        // this.commonPage.pageNum = parseInt(pageNum)
        // this.commonPage.pageSize = parseInt(pageSize)
        this.userlist = response.data// 分页信息带回显示
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
    selectionChangeHandle() {

    },
    handleClose() {

    },
    sendDialogClose() {
      this.sendDialogVisible = false
      this.$refs.msgRuleForm.resetFields()
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
