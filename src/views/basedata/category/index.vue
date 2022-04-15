<template>
  <div class="app-container">
    <el-form ref="queryCondtion" :model="queryCondtion" label-width="120px">
      <el-form-item label="name">
        <div>
          <el-input v-model="queryCondtion.name" style="width:200px" />
          <el-date-picker v-model="queryCondtion.start" type="date" placeholder="Pick a date" />
          <el-time-picker v-model="queryCondtion.end" type="fixed-time" placeholder="Pick a time" />
          <el-button type="primary">Search</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="categories"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="分类ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.categoryId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类" width="95">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getCategories } from '@/api/category'
export default {
  data() {
    return {
      categories: null,
      listLoading: false, // init view model data
      queryCondtion: {
        name: 'test',
        start: null,
        end: null
      }
    }
  },
  methods: {
    fetchData() {
      this.listLoading = true
      let str = /sdgcsdhs/
      getCategories(queryCondtion).then(response => {
        this.categories = response.data.items
        this.listLoading = false
      })
    }

  }

}
</script>
