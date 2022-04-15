<template>
  <el-container>
    <el-header style="height:120px">
      <div>
        <el-row>
          <el-form
            :inline="true"
          >
            <el-form-item label="区域">
              <el-input style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="站点">
              <el-input style="width:90%" clearable />
            </el-form-item>
            <el-form-item label="服务器">
              <el-input style="width:90%" clearable />
            </el-form-item>
            <el-button type="primary" style="margin-top:3px;margin-left:20px" size="medium">查询</el-button>
          </el-form>
        </el-row>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus">增加</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
        <el-button type="info" icon="el-icon-edit">编辑</el-button>
      </div>
    </el-header>

    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%;"
        border
        fix
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          type="expand"
          class="siteDescription"
          align="center"
        >
          <template>
            <el-table>
              <el-table-column
                prop="label"
                label="序号"
                align="center"
                min-width="90"
              />
              <el-table-column
                prop="label"
                label="属性名称"
                align="center"
                min-width="90"
              />
              <el-table-column
                prop="label"
                label="参数"
                align="center"
                min-width="90"
              />
              <el-table-column
                prop="label"
                label="值"
                align="center"
                min-width="90"
              />
              <el-table-column
                header-align="center"
                align="center"
                min-width="90"
                label="操作"
              >
                <template>
                  <el-button
                    size="mini"
                    title="增加"
                    type="primary"
                    circle
                  />
                  <el-button
                    size="mini"
                    title="编辑"
                    type="danger"
                    circle
                  />
                  <el-button
                    size="mini"
                    title="删除"
                    type="danger"
                    circle
                  />
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="序号"
          width="80"
          type="index"
        />
        <el-table-column
          prop="number"
          header-align="center"
          align="center"
          label="序号"
          min-width="90"
        />

        <el-table-column
          prop="site"
          header-align="center"
          align="center"
          label="站点"
          min-width="90"
        />
        <el-table-column
          prop="signal"
          header-align="center"
          align="center"
          label="信号"
          min-width="90"
        />
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          label="站点类型"
          min-width="90"
        />
        <el-table-column
          prop="servicename"
          header-align="center"
          align="center"
          label="服务器名称"
          min-width="120"
        />
      </el-table>
    </el-main>
  </el-container>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      tableData: [{
        number: 1,
        site: 'A站',
        signal: '001',
        type: '001',
        servicename: '顺加能'
      }]
    }
  }
}
</script>

<style>
  .el-header {
    background-color: #ffffff;

  }
  .el-main {
    background-color: #ffffff;
    text-align: center;

  }
</style>
