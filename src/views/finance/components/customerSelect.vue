<template>
  <el-select
    v-if="isCustomer"
    v-model="customerId"
    filterable
    clearable
    size="mini"
    :disabled="isDisabled"
    @change="getCustomerId"
  >
    <el-option
      v-for="item in customerList"
      :key="item.id"
      size="mini"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
  <el-select
    v-else
    v-model="carrierId"
    filterable
    clearable
    :disabled="isDisabled"
    size="mini"
    @change="getCarrierId"
  >
    <el-option
      v-for="item in carrierList"
      :key="item.id"
      size="mini"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { planAndExecuteApi } from '@/api/planAndExecute/pickupPlan'
export default {
  props: {
    isCustomer: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      customerList: [],
      customerId: '',
      carrierList: [],
      carrierId: ''
    }
  },
  mounted() {
    if (this.isCustomer) {
      // 客户以及仓库下拉框
      planAndExecuteApi.queryCustomerAndWarehouse().then(res => {
        this.customerList = res.customerDTOS
      }).catch(err => {
        this.$message.error(err)
      })
    } else {
      // 获取承运商列表
      planAndExecuteApi.getCarrierList({ pageSize: 1000 }).then(res => {
        this.carrierList = res.data
      })
    }
  },
  methods: {
    /**
     * 客户下拉事件监听
     */
    getCustomerId(e) {
      this.customerId = e
      this.$emit('changeCustomerId', e)
    },
    /**
     * 承运商下拉事件监听
     */
    getCarrierId(e) {
      this.carrierId = e
      this.$emit('changeCarrierId', e)
    }
  }
}
</script>
