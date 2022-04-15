<template>
  <div>
    <hr style="background-color: #FFFFFF; height: 1px; border: none">
    <div style="margin-left: 20px;">
      <el-tag
        v-for="item in tags"
        :key="item.title"
        :closable="item.closable"
        :path="item.path"
        :color="item.color"
        effect="dark"
        style="margin-right: 2px;color: #000000"
        @close="handlerClose"
        @click.native="toPath"
      >
        {{ item.title }}
      </el-tag>
    </div>
    <hr style="background-color: #D7D7D7; height: 1px; border: none">
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    // 主页title
    homeTitle: {
      type: String,
      default: '首页'
    },
    // 主页path
    homePath: {
      type: String,
      default: '/'
    }
  },
  data: function() {
    return {
      // 已打开标签，默认有首页
      tags: [],
      currentTagColor: '#3399FF',
      normalTagColor: '#ffffff'
    }
  },
  watch: {
    $route: function(newRoute) {
      this.pathChange(newRoute)
    }
  },
  mounted: function() {
    // 设置默认tag
    const newTags = this.tags
    if (this.homeTitle !== '' && this.homePath !== '') {
      newTags.push({
        title: this.homeTitle,
        path: this.homePath,
        closable: false, // 主页不能关闭
        color: this.currentTagColor
      })
    }
    if (this.$route.fullPath !== this.homePath) {
      this.pathChange(this.$route)
    }
    this.tags = newTags
  },
  methods: {
    // 路径改变
    pathChange(route) {
      console.log(route)
      const newTags = this.tags
      let dumpling = false
      newTags.forEach(item => {
        if (route.fullPath === item.path) {
          // 重复path不添加
          dumpling = true
        }
      })
      if (!dumpling) {
        newTags.push({
          title: route.meta.title,
          path: route.fullPath,
          closable: true,
          color: this.currentTagColor
        })
      }

      // 改变背景颜色
      newTags.forEach(item => {
        if (item.path === route.fullPath) {
          item.color = this.currentTagColor
        } else {
          item.color = this.normalTagColor
        }
      })
      this.tags = newTags
    },
    /**
     * 跳转
     */
    toPath(event) {
      console.log(event)
      const goPath = event.target.getAttribute('path')
      if (goPath === this.$route.fullPath) {
        return
      }
      this.$router.push(goPath)
    },
    /**
     * 捕获tag关闭
     * @param event
     */
    handlerClose(event) {
      console.log(event)
      const newTags = []
      const removePath = event.target.parentElement.getAttribute('path')
      this.tags.forEach(item => {
        if (item.path !== removePath) {
          newTags.push(item)
        }
      })
      // 跳转到tags最后一个
      const last = newTags.slice(-1)[0]
      this.$router.push(last.path)
      this.tags = newTags
    }
  }
}
</script>

<style scoped>

</style>
