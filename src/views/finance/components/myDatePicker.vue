<template>
  <el-date-picker
    v-model="timeList"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    style="width:220px"
    end-placeholder="结束日期"
    @change="changeTime"
  />
</template>

<script>
export default {
  data() {
    return {
      timeList: [],
      startTime: '',
      endTime: ''
    }
  },
  mounted() {
    this.timeList = [this.formatTime(new Date(), true), new Date()]
  },
  methods: {
    // 监听查询时间变化
    changeTime() {
      console.log(this.timeList)
      if (this.timeList != null && this.timeList !== undefined && this.timeList.length === 2) {
        this.startTime = this.timeList[0]
        this.endTime = this.timeList[1]
      } else {
        this.startTime = ''
        this.endTime = ''
      }
      this.$emit('changeDateTime', this.startTime, this.endTime)
    },
    /**
     * 时间格式化
     * @param time 传入所需格式化时间
     */
    formatTime(time, isMonthBegin = false) {
      if (!time) {
        return
      }
      time = new Date(time)
      if (!isMonthBegin) {
        time = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        (time.getDate() < 10 ? '0' + time.getDate() : time.getDate()) + ' ' +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      } else {
        time = time.getFullYear() + '-' +
        ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' +
        1 + ' ' +
        (time.getHours() + 1 < 10 ? '0' + time.getHours() : time.getHours()) + ':' +
        (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ':' +
        (time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds())
      }

      return time
    }
  }
}
</script>
