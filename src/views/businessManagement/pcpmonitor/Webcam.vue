<!--
 * @Author: Xnew
 * @Description:
 * @Date: 2021-12-27 10:51:36
 * @LastEditors: Xnew
 * @LastEditTime: 2021-12-30 17:22:49
-->
<template>
  <el-container>
    <el-dialog
      v-dialogDrag
      :visible.sync="visible"
      title="监控窗口"
      width="75%"
      :before-close="handleClose"
      @open="handleVisibleOpen"
    >
      <el-select v-model="value" placeholder="请选择监控站点" style="float:left" @change="selectChange">
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="list-vedio">
        <video-player
          ref="videoPlayer"
          class="video-js vjs-custom-skin"
          :options="options"
          :playsinline="true"
          style="width:90%;height:90%"
        />
      </div>

      <div slot="footer">
        <el-button size="medium" type="primary" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { commonQueryMachine } from '../../../api/machine/index'
export default {
  props: {
    visible: { type: Boolean, default: false },
    stationVo: { type: Object, default: () => { return {} } }
  },
  data() {
    return {
      playOptions: [],
      reply: [],
      machineList: [],
      selectOptions: [],
      options: {},
      value: 1
    }
  },
  mounted() {

  },
  methods: {
    handleClose() {
      this.$emit('handleVideoClose', this)
    },
    handleVisibleOpen() {
      const stationId = this.stationVo.id
      this.commonQueryMachine(stationId)
    },
    /*
      查询站点监控
    */
    commonQueryMachine(id) {
      commonQueryMachine({ stationId: id, mechineType: '1456442547432980480' }).then(res => {
        this.machineList = res.data
        this.options = {
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: true, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          techOrder: ['html5'], // 兼容顺序
          sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
            type: 'application/x-mpegURL',
            src: ''
          }
          ],
          poster: '', // 你的封面地址
          notSupportedMessage: '此监控视频暂无法播放', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true // 全屏按钮
          }
        }
        this.selectOptions = []
        this.playOptions = []
        if (this.machineList.length !== 0) {
          for (const [index, value] of this.machineList.entries()) {
            if (value.networkAddress !== '') {
              let options = {
                playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
                autoplay: true, // 如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                techOrder: ['html5'], // 兼容顺序
                sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
                  type: 'application/x-mpegURL',
                  src: value.networkAddress.split('&')[1]
                }
                ],
                poster: '', // 你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此监控视频暂无法播放', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                  remainingTimeDisplay: false,
                  fullscreenToggle: true // 全屏按钮
                }
              }
              if (this.playOptions.length < this.machineList.length) {
                this.playOptions.push(options)
                this.selectOptions.push({ label: value.name, value: index })
              }
            }
          }
          this.options = this.playOptions[1]
          this.value = 1
        } else {
          this.value = ''
          this.$message.error('该站点暂无监控设备')
        }
      })
    },
    selectChange(index) {
      this.options = this.playOptions[index]
      console.log(this.options)
    }

  }
}
</script>

<style>
.list-vedio{
  /* display: flex;
  flex-wrap: wrap; */
  margin-top: 60px;
}
.video-js{
  margin-left: 3.4%;
}
</style>
