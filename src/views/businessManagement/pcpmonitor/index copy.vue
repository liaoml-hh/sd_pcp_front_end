<template>
  <el-container>
    <el-header>
      <el-form :model="searchForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <el-select v-model="searchForm.areaId" clearable placeholder="请选择区域" @change="doquery">
                <el-option v-for="item in areaList" :key="item.id" :label="item.province+item.city+item.area" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main>
      <div class="station_box">
        <dv-border-box-11 v-for="(item,index) in stationList" :key="index" :color="(index+1)%2==0?end:undefind" :reverse="true" style="width:40%;height:500px;margin-top:30px" :title="item.name">
          <div style="margin-top:60px" @click="dialogVisible=true">
            <div>{{ item.code }}</div>
            <div>{{ item.address }}</div>
            <div>{{ (index+1)%2==0?"不可用":"可用" }}</div>
          </div>
          <div class="scroll_board">
            <machine-car :key="index" :stattion="item" />
          </div>
        </dv-border-box-11>
        <div class="waringtable" />
      </div>
    </el-main>
  </el-container>

</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryStation } from '@/api/station/station'
import { commonQueryArea } from '@/api/area/area'

import MachineCar from './MachineCar'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    MachineCar
  },
  props: {},
  data() {
    // 这里存放数据
    return {
      searchForm: {
        areaId: '',
        pageSize: 10000
      },
      commonPage: {
        pageNum: 1,
        pageSize: 10,
        total: 10,
        pageCount: 1
      },
      areaList: [],
      dialogVisible: false,
      queryLoading: false,
      stationList: [],
      end: ['#ff0000', '#ff0000', '#ff0000'],
      config: {
        evenRowBGC: '#8490a0',
        oddRowBGC: '#8490a0',
        header: ['设备', '时间', '报警信息'],
        data: [
          ['设备1', '时间1', '报警信息1'],
          ['设备2', '时间2', '报警信息2'],
          ['设备3', '时间3', '报警信息3'],
          ['设备4', '时间4', '报警信息4'],
          ['设备5', '时间5', '报警信息5'],
          ['设备6', '时间6', '报警信息6'],
          ['设备7', '时间7', '报警信息7'],
          ['设备8', '时间8', '报警信息8'],
          ['设备9', '时间9', '报警信息9']
        ]
      }
    }
  },
  // 计算属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initStationData()
    this.initarea()
    console.log(this.$route)
  },
  // 方法集合
  methods: {
    initStationData() {
      commonQueryStation(this.searchForm).then(res => {
        this.stationList.length = 0
        res.data.map(item => {
          item.config = this.config
          this.stationList.push(item)
        })
        // this.stationList.push(...this.stationList)
        // this.stationList.push(...this.stationList)
        // this.stationList.push(...this.stationList)
      }).catch(error => { console.log(error) })
    },
    searchFormclick() {
      this.initStationData()
    },
    doquery(id) {
      this.searchForm.areaId = id
      this.searchFormclick()
    },
    initarea() {
      commonQueryArea({ pageSize: 10000 }).then(res => {
        this.areaList = res.data
      })
    },
    deleteWarningById(scope) {
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleCurrentChange() {
    },
    handleSizeChange() {
    }

  } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style  scoped >
.el-header {
  background-color: #ffffff;
}
.el-main {
  background-color: #ffffff;
  text-align: center;
}
 .el-row {
    margin-bottom: 20px;

  }
  .el-row:last-child{
 margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #e6d3d3;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #fcf9f9;
  }
  .grid-content{
    margin-top: 20px;
    margin-left: 20px;
    box-shadow: #8490a0 3px 3px;
    background-image: url("../../../assets/404_images/powerstation.png");
    background-repeat: no-repeat;
    background-position: 130px 20px;
  }
  .station_box{
        overflow:hidden;
    display:flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    justify-content: space-around;
  }
  .scroll_board{
    /* text-align: center; */
    margin-top: 40%;
    margin-left: 10%;
  }

</style>
