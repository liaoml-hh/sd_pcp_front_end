<!--
 * @Author: abel.zhan
 * @Date: 2020-11-18 06:19:11
 * @LastEditTime: 2020-11-23 20:38:11
 * @LastEditors: Please set LastEditors
 * @Description: 封装了 编辑和保存的对话框用于开发过程统一代码和样式表单的内容由slot定义
 * @FilePath: \sd365-tms-omp-front-end\src\components\sd365ui\FormDialog.vue
-->
<template>
  <el-dialog
    v-dialogDrag
    :title="caption"
    :visible.sync="visible"
    :width="width"
    :before-close="handleClose"
    modal="true"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formName"
      :model="model"
      :label-position="left"
      :rules="rules"
      label-width="100px"
    >
      <slot />
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button id="btnCancel" @click="onBtnCancelClick">取 消</el-button>
      <el-button v-show="isSaveVisible" id="btnOK" @click="onBtnSaveClick('formName')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    caption: { type: String, required: true, default: '信息维护' },
    width: { type: String, required: true, default: '50%' },
    visible: { type: Boolean, default: true },
    model: { type: Object, required: true },
    rules: { type: Object, required: true },
    isSaveVisible: { type: Boolean, required: true, default: true }
  },
  data() {
    return {
      queryLoading: false,
      left: null
    }
  },
  methods: {
    /**
     * @description: 取消的时候回调外部时间
     * @param {*}
     * @return {*}
     */
    onBtnCancelClick() {
      this.queryLoading = true
      this.$emit('CancelButtonClick', this)
      this.queryLoading = false
      this.visible = false
      this.isSaveVisible = true
    },
    /**
     * @description: 如果操作较长时间则显示进度 如果校验通过则回调父组件定义的保存或者更新操作
     * @param {*} form 表单名
     * @return {*}
     */
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            this.queryLoading = true
            this.$emit('OkButtonClick', this) // 回调父组件的时间具体业务逻辑由父组件实现
            this.queryLoading = false
            this.visible = false
          }
        })
    },
    handleClose() {
      this.onBtnCancelClick()
    }
  }
}
</script>
