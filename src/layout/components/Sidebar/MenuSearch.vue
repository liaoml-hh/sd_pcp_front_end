<template>
  <el-menu-item :hidden="isCollapse">
    <el-select v-model="label" @change="onChange" filterable placeholder="请输入关键词搜索">
      <el-option
        v-for="item in getOptions"
        :key="item.label + item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </el-menu-item>
</template>

<script>
export default {
  name: 'MenuSearch',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      label: null
    }
  },
  mounted() {
    console.log(this.getOptions)
  },
  computed: {
    getOptions() {
      const routes = this.$router.options.routes
      const all_routes = []
      routes.forEach((item) => {
        all_routes.push(...this.getAllRoutes(item))
      })
      const options = []
      console.log(all_routes)
      all_routes.forEach(item => {
        options.push({
          label: item.meta.title,
          value: this.getFirstRoutePath(item)
        })
      })
      console.log(options)
      return options
    }
  },
  methods: {
    getAllRoutes(route, parentPath, parentTitle) {
      const all_routes = []
      const path = (parentPath || '') + (route.path.indexOf('/') >= 0 ? route.path : (parentPath === '/' ? route.path : '/' + route.path))
      const title = (parentTitle || '') + (route.meta ? (route.meta.title ? (parentTitle ? '-' : '') + route.meta.title : '') : '')
      const newRoute = {
        meta: {
          // 带有层级关系的title
          title: title
        },
        // 完整路径
        path: path
      }
      // hidden=true不搜索，有子节点当前节点不搜索
      if ((route.hidden === undefined || route.hidden === null || route.hidden === false) && (route.children === undefined || route.children === null || route.children.length === 0)) {
        all_routes.push(newRoute)
      }
      if (route.children) {
        route.children.forEach(item => {
          all_routes.push(...this.getAllRoutes(item, path, title))
        })
      }
      return all_routes
    },
    getFirstRoutePath(route) {
      // 获取当前路由第一个叶子节点
      // console.log(route)
      if (route.children !== undefined && route.children !== null && route.children.length !== 0) {
        let childPath = this.getFirstRoutePath(route.children[0])
        if (childPath.indexOf('/') !== 0) {
          childPath = '/' + childPath
        }
        if (route.path.indexOf('/') !== 0) {
          route.path = '/' + route.path
        }
        return route.path + childPath
      } else {
        return route.path
      }
    },
    onChange(value) {
      this.$router.push(value)
    }
  }
}
</script>

<style scoped>

</style>
