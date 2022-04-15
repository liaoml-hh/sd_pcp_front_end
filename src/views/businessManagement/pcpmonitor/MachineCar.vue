<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备列表</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div v-if="dataList.length==0" style="text-align: center" class="text item">
        暂无数据
      </div>
      <div v-for="(data,index) in dataList" :key="data.id" class="text item list">

        <div style="width:90% ;">{{ index+1 }}、{{ data.name }}</div>
        <div><el-button size="mini" type="danger" @click="dialogVisible=true">查看</el-button></div>
      </div>
    </el-card>
    <div>
      <el-dialog
        v-dialogDrag
        title="告警信息"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
      >
        <div>

          <div>
            <el-table
              ref="waringtable"
              v-loading="queryLoading"
              :data="warmingList"
              style="width: 100%;"
              border
              fix
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="40"
              />
              <el-table-column
                header-align="center"
                align="center"
                label="序号"
                width="40"
                type="index"
              />
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="记录"
                min-width="125"
              />
              <el-table-column
                prop="time"
                header-align="center"
                align="center"
                label="报警时间"
                min-width="90"
              />
              <el-table-column
                prop="info"
                header-align="center"
                align="center"
                label="报警信息"
                min-width="110"
              />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" @click="deleteWarningById(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { commonQueryMachine } from '@/api/machine/index'
export default {

  props: {
    stattion: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 这里存放数据
    return {
      dialogVisible: false,
      dataList: [],
      warmingList: [
        { name: '设备1', time: '时间1', info: '报警信息1' },
        { name: '设备2', time: '时间2', info: '报警信息2' },
        { name: '设备3', time: '时间3', info: '报警信息3' },
        { name: '设备4', time: '时间4', info: '报警信息4' },
        { name: '设备5', time: '时间5', info: '报警信息5' },
        { name: '设备6', time: '时间6', info: '报警信息6' },
        { name: '设备7', time: '时间7', info: '报警信息7' },
        { name: '设备8', time: '时间8', info: '报警信息8' },
        { name: '设备9', time: '时间9', info: '报警信息9' }
      ]
    }
  },
  // 计算属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    commonQueryMachine({ stationId: this.stattion.id }).then(res => {
      this.dataList = res.data
    })
  },
  // 方法集合
  methods: {

  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>

  .text {
    text-align: left;
    font-size: 14px;
      border-bottom: 1px solid #817e7e;
  }
.list{
  display: flex;
}
  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {

    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.clearfix span{
  text-align: center;

}
  .box-card {

    margin-top: -10em;
    width: 90%;
  }
</style>
