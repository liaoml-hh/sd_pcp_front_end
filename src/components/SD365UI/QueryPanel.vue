<!--
 * @Author: your name
 * @Date: 2020-11-18 16:52:44
 * @LastEditTime: 2020-11-23 21:54:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sd365-oms-front-end/src/components/SD365UI/QueryPanel.vue
-->
<template>
  <el-form class="formStyle" :model="queryModel" :inline="true" label-width="120px">
    <el-row style="padding:5px;">
      <slot />
      <el-form-item label-width="80px">
        <el-button
          id="btnQuery"
          v-loading="queryLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleBtnQueryClick"
        >查询</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
export default {
  props: {
    queryModel: { type: Object, required: true }

  },
  data() {
    return {
      queryLoading: false
    }
  },
  methods: {
    handleBtnQueryClick() {
      this.queryLoading = true
      this.$emit('QueryButtonClick')
      this.queryLoading = false
    }
  }
}
</script>

<style scoped>
  #btnQuery{
    /* position: absolute; */
    margin-top: 70%;
    margin-left: 80%;
  }
  .formStyle{
    transform:scale(0.8);
    -ms-transform:scale(0.8);
    -webkit-transform:scale(0.8)!important;
    width: 130%;
    margin-left: -16.6%;
    margin-top: 10px
  }
</style>
