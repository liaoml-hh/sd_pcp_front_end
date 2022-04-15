<template>
  <el-container>
    <el-header>
      <el-form :model="searchForm" :inline="true" style="margin-top:10px">
        <el-row>
          <!-- <el-col :span="3">
            <el-form-item label="">
              <el-select v-model="searchForm.areaId" clearable placeholder="请选择区域">
                <el-option v-for="item in areaList" :key="item.id" :label="item.province+item.city+item.area" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="站点名称">
              <el-input v-model="searchForm.stationName" placeholder="输入站点名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="initStationData">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-container>
      <!--    左边的树-->
      <el-aside style="position:relative;top: 20px;" :width="showmuenflag?'0px':'190px'">
        <el-menu :collapse="showmuenflag">
          <el-col :span="4">
            <el-card shadow="always" style="height:100%;width:190px">
              <div slot="header" style="width:555px;" class="clearfix">
                <em class="el-icon-menu" style="height:22px;" @click="showmuenflag=!showmuenflag">区域</em>
              </div>
              <el-tree class="treee" draggable :data="areaData" @node-click="handleNodeClick" />
            </el-card>
          </el-col>
        </el-menu>
      </el-aside>
      <el-main>
        <el-card shadow="always">
          <div style="margin-bottom:20px;margin-left:-90%;">
            <i :class="showmuenflag?'el-icon-arrow-right':'el-icon-arrow-left'" class="i-sty" @click="showmuen">当前区域:{{ areaName }}</i>
          </div>
          <div class="station_box">
            <dv-border-box-8 v-for="(item,index) in stationList" :key="index" :color="(index+1)%2?end:end" :reverse="true" style="width:360px;height:120px;margin-top:10px;position: relative;margin-left:20px">
              <i type="primary" class="el-icon-view camera" @click="handleVideoOpen(item)" />
              <div style="margin-top:10px">站点:{{ item.name }}</div>
              <div style="margin-top:10px">站点联系人:{{ item.contacts }}</div>
              <div style="margin-top:10px;margin-left:-10px;">
                <span>站点设备状态: </span>
                <el-button type="primary" size="mini" style="font-size:16px;" plain @click="showMachineStatus(item)">查看</el-button>
              </div>
            </dv-border-box-8>
            <div class="waringtable" />
          </div>
          <el-dialog
            v-dialogDrag
            :title="`${stationName}设备状态`"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose"
          >
            <div>
              <el-table
                ref="waringtable"
                v-loading="queryLoading"
                :data="stationMachineStatusVOS"
                style="width: 100%;"
                border
                fix
              >
                <el-table-column
                  header-align="center"
                  align="center"
                  label="序号"
                  width="50"
                  type="index"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 +(searchForm.pageNum===1?0:commonPage.pageSize*(searchForm.pageNum-1)) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  header-align="center"
                  align="center"
                  label="记录"
                  min-width="300"
                />
                <el-table-column
                  prop="path"
                  header-align="center"
                  align="center"
                  label="报警字段"
                  min-width="400"
                />
                <el-table-column
                  prop="value"
                  header-align="center"
                  align="center"
                  label="值"
                  min-width="130"
                />
                <!-- <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" @click="deleteWarningById(scope)">删除</el-button>
                </template>
              </el-table-column> -->
              </el-table>
              <el-empty v-show="stationMachineStatusVOS.length===0" description="描述文字" />
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
          <webcam
            ref="videoPlayer"
            :visible="playVisible"
            :station-vo="stationVo"
            @handleVideoClose="handleVideoClose"
          />
        </el-card>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { commonQueryStation, commonQueryStationStatus, commonQueryStationStatusList } from '@/api/station/station'
import { commonQueryArea } from '@/api/area/area'
import area from './province.js'
import MachineCar from './MachineCar'
import Webcam from './Webcam.vue'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {
    Webcam
  },
  props: {},
  data() {
    // 这里存放数据
    return {
      searchForm: {
        pageSize: 10000,
        name: '',
        stationName: '',
        pageNum: 1
      },
      commonPage: {
        pageNum: 1,
        pageSize: 1,
        total: 1
      },
      stationMachineStatusVOS: [],
      stationName: '',
      areaList: [],
      dialogVisible: false,
      queryLoading: false,
      stationList: [],
      end: ['#3399ff', '#3399ff', '#3399ff'],
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
      },
      playVisible: false,
      stationVo: {},
      stationMachineStatusVOS: [],
      stationName: '',
      showmuenflag: true,
      areaData: [],
      areaName: '宁德市'
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.$route.query.sk !== undefined) {
      this.searchForm.id = this.$route.query.sk
    }
    this.initStationData()
    this.initarea()
    console.log(this.$route)
    console.log(area)
    this.treetransform()
  }, // 如果页面有keep-alive缓存功能，这个函数会触发
  beforeDestroy() {
    this.$refs.videoPlayer.player.dispose()
  },
  // 方法集合
  methods: {
    initStationData() {
      commonQueryStationStatus(this.searchForm).then(res => {
        this.stationList.length = 0
        this.stationList = res.data
      }).catch(error => { console.log(error) }).finally(() => {
        this.searchForm.stationName = ''
      })
    },
    showMachineStatus(item) {
      this.stationName = item.name
      this.queryLoading = true
      this.dialogVisible = true
      commonQueryStationStatusList({ id: item.id }).then(res => {
        this.stationMachineStatusVOS = res.data
        this.queryLoading = false
      })
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
    },
    handleVideoClose(e) {
      this.playVisible = false
    },
    /*
      打开dialog传递站点信息
    */
    handleVideoOpen(item) {
      if (Object.keys(item).length !== 0) {
        this.playVisible = true
        this.stationVo = item
      }
    },
    showmuen() {
      this.showmuenflag = !this.showmuenflag
    },
    treetransform() {
      const tree = []
      /* 存储第一节点 */
      area.map(item => {
        tree.push({ label: item.name, children: [] })
      })
      /* 存储第二节点 */
      tree.map(itemParent => {
        area.map(item => {
          if (itemParent.label === item.name) {
            item.city.forEach(itemCity => {
              itemParent.children.push({ label: itemCity.name, children: [] })
            })
          }
        })
      })
      /* 存储第三节点 */
      tree.map(itemParent => {
        itemParent.children.map(itemSecondParent => {
          area.map(item => {
            item.city.forEach(itemCity => {
              if (itemCity.name === itemSecondParent.label) {
                itemCity.districtAndCounty.forEach(itemCountry => {
                  itemSecondParent.children.push({ label: itemCountry })
                })
              }
            })
          })
        })
      })
      this.areaData = tree
    },
    handleNodeClick(data) {
      this.areaName = data.label
      commonQueryStationStatus({ name: this.areaName }).then(res => {
        this.stationList = res.data
        if (this.stationList.length === 0) {
          this.$message.error('该区域暂无站点信息')
        }
      }).catch(() => {
        this.$message.error('网络异常')
      })
    }
  }
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
    margin-top: 0;
    width: 100%;
    height: 100%;
  }
  .scroll_board{
    /* text-align: center; */
    margin-left: 10%;
  }
  .camera{
    position: absolute;
    right: 10px;
    top: 0px;
    font-size: 30px;
    z-index: 999;
  }
.i-sty{
  cursor:pointer;
}
</style>
