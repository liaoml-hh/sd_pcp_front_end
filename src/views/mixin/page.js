// 通用分页对象和触发函数
export const pageMixin = {
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    sizeChange(val) {
      this.page.pageSize = val
      this.getTableData()
    },
    currentChange(val) {
      this.page.pageNum = val
      this.getTableData()
    }
  }
}
