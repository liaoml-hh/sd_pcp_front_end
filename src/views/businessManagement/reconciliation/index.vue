<template>
  <el-container>
    <el-header />
    <el-main>
      <div class="station_box">

        <dv-border-box-11 v-for="(item,index) in stationList" :key="index" :reverse="true" style="width:40%;height:500px;margin-top:30px" :title="item.name">
          <div style="margin-top:60px">
            <div>{{ item.code }}</div>
            <div>{{ item.address }}</div>
          </div>
          <div class="scroll_board">
            <dv-scroll-board :config="item.config" style="width:80%;height:200px" />
          </div>
        </dv-border-box-11>

        <!-- <el-row>
          <el-col v-for="(item,index) in stationList" :key="index" :span="6"><div class="grid-content bg-purple">
            <h4>{{ item.name }}</h4>
            <div>{{ item.code }}</div>
            <div>{{ item.address }}</div>
          </div></el-col>
        </el-row> -->
      </div>
    </el-main>
  </el-container>

</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryStation } from '@/api/station/station'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
      stationList: [],
      config: {
        evenRowBGC: '#8490a0',
        oddRowBGC: '#8490a0',
        header: ['设备', '时间', '报警信息'],
        data: [
          ['设备1', '行1列2', '行1列3'],
          ['设备2', '行2列2', '行2列3'],
          ['设备3', '行3列2', '行3列3'],
          ['设备4', '行4列2', '行4列3'],
          ['设备5', '行5列2', '行5列3'],
          ['设备6', '行6列2', '行6列3'],
          ['设备7', '行7列2', '行7列3'],
          ['设备8', '行8列2', '行8列3'],
          ['设备9', '行9列2', '行9列3']

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
  },

  // 方法集合
  methods: {
    initStationData() {
      commonQueryStation({ pageSize: 1000 }).then(res => {
        res.data.map(item => {
          item.config = this.config
          this.stationList.push(item)
        })
        this.stationList.push(...this.stationList)
        this.stationList.push(...this.stationList)
      }).catch(error => { console.log(error) })
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
    background: #d3dce6;
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
    background-color: #f9fafc;
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
    margin-top: 180px;
    margin-left: 16%;
  }
</style>
