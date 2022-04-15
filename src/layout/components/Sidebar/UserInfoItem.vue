<template>
  <div :hidden="isCollapse">
    <el-menu-item style="height: 100px" align="center">
      <el-avatar :size="100" :src="avatar" style="margin-top: 10px" />
    </el-menu-item>
    <el-menu-item align="left" style="margin-left: 10px">
      <h3><font style="font-size: 100px;color: #00FF66;overflow:auto">·</font>欢迎{{ userName }}</h3>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'UserInfoItem',
  props: {
    // 头像
    avatar: {
      type: String,
      default: null
    },
    // 用户名
    userName: {
      type: String,
      default: ''
    },
    // 是否收缩侧边栏
    isCollapse: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.el-avatar>>>img {
    display: block;
    height: 100%;
    margin-left: 0px;
    border-radius: 50%;
    /* margin-top: -1px; */
}
</style>
