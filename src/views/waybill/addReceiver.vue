<template>
  <el-form style="height:400px;" :model="addReceiverVO" :rules="receiverRules" label-width="100px">
    <el-col :span="12">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="addReceiverVO.name" placeholder="请输入姓名" @change="getAssistantCode(addReceiverVO.name)" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="助记码" prop="assistantCode">
        <el-input v-model="addReceiverVO.assistantCode" placeholder="请输入助记码" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="英文名" prop="ename">
        <el-input v-model="addReceiverVO.ename" placeholder="请输入英文名" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="addReceiverVO.mobile" placeholder="请输入电话" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addReceiverVO.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="所在省份" prop="province">
        <el-input v-model="addReceiverVO.province" placeholder="请输入省份" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="所在城市" prop="city">
        <el-input v-model="addReceiverVO.city" placeholder="请输入城市" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="所在县区" prop="county">
        <el-input v-model="addReceiverVO.county" placeholder="请输入县区" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="所在地址" prop="address">
        <el-input v-model="addReceiverVO.address" placeholder="请输入地址" />
      </el-form-item>
    </el-col>
    <div style="float:right;margin-top:6%">
      <el-button @click="parentCancelHandel">取消</el-button>
      <el-button type="primary" @click="onBtnSaveReceiverClick">确 定</el-button>
    </div>

  </el-form>

</template>

<script>
import detail from '@/views/waybill/detail'
import { WaybillApi } from '@/api/waybill/waybill'
import vPinyin from '../../utils/vue-py'
export default {
  name: 'Merge',
  components: {
  },
  data() {
    return {
      addReceiverVO: {},
      receiverRules: {
        // 定义当前页面的非空规则这点参考表结构的字段comment规则要求
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        address: [{ required: true, message: '请输入所在地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 收货人弹窗确定保存
    onBtnSaveReceiverClick() {
      console.log(this.addReceiverVO)
      WaybillApi.addReceiverInfo(this.addReceiverVO).then(res => {
        if (res) {
          this.$message.success('增加成功')
          this.$emit('addReceiverInfo', this.addReceiverVO)
        }
        this.parentCancelHandel()
      }).catch(() => {
        this.parentCancelHandel()
      })
    },
    parentCancelHandel() {
      this.$emit('parentCancelHandel')
    },
    /**
     * 获取助记码
     */
    getAssistantCode(name) {
      const assistantCode = vPinyin
        .getPinYinFirstCharacter(name, '', true)
        .replace(/\s+/g, '')
      // 助记码方法
      this.$set(this.addReceiverVO, 'assistantCode', assistantCode)
      console.log(this.addReceiverVO)
    }
  }
}
</script>

<style scoped>

</style>
