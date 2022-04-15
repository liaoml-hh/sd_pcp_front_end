<template>
  <div>
    <div :class="imgContainer">
      <div class="badge">
        <div style="margin-top:16%;">{{ optionData.value }}</div>
      </div>
      <el-tooltip class="item" effect="dark" placement="top-start">
        <div slot="content">{{ optionData.tipContent }}</div>
        <el-image
          :src="optionData.imgSrc"
          :class="optionData.routerPath?'':'gray'"
          style="width: 100px; height: 100px;vertical-align:bottom;z-index:1;"
          @click="jumpMenu"
        >
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </el-tooltip>

      <span class="stepName" style="clear:both">{{ optionData.name }}</span>
    </div>
    <el-steps :class="lineDirection">
      <i :class="lineTop" />
      <i class="lineCenter" />
      <i :class="lineBottom" />
    </el-steps>
  </div>
</template>

<script>
export default {
  props: ['optionData', 'lineDirection', 'lineTop', 'lineBottom', 'imgContainer'],
  data() {
    return {
      active: 11,
      flag: false,
      orderNumStockOptionData: []

      // optionData: [
      //   { name: '运单数', value: 111 },
      //   { name: '提货计划数', value: 111 },
      //   { name: '提货执行数', value: 111 },
      //   { name: '已提货数', value: 111 },
      //   { name: '配送计划数', value: 111 },
      //   { name: '配送执行数', value: 111 },
      //   { name: '到达数', value: 111 },
      //   { name: '配送签收数', value: 111 },
      //   { name: '签收异常数', value: 111 },
      //   { name: '回单数', value: 111 },
      //   { name: '财务', value: 111 }
      // ]
    }
  },

  mounted() {
    // this.$nextTick(() => {
    //   this.initChartData()
    // })
  },

  // updated() {
  //   this.$nextTick(() => {
  //     this.getAllData()
  //   })
  // },
  methods: {
    jumpMenu() {
      if (!this.optionData.routerPath) {
        this.$message.warning('暂无权限,请授权后访问')
        return
      }
      this.$router.push({ path: this.optionData.routerPath })
    }
  }
}
</script>

<style lang="scss" scoped>
.badge{
  position: absolute;
  right: -44px;
  top: -34px;
  width: 50px;
  height: 40px;
  text-align: center;
  border-radius: 40%;
  background: #f56c6c;
  color:white;
  font-size: 22px;
  line-height: -10px;
}
.stepName{
  // margin-left: 10%;
  color:#0080ff;
}
.containerTop{
  top: 70px;
}
.container{
  position: relative;
  // border: 1px solid blue;
  // display: inline-block;
  display: table-cell;
  vertical-align:middle;
  text-align: center;
  width: 100px;
}
.lineCenter{
  position: relative;
  transition-delay:100ms;
  border:1px;
  width:150px;
  height:4px;
  background-color: #409EFF;
  margin-top: -70px;
  margin-left: 110px;
}
.directionVertical{
  // display: flex;
  position: absolute;
  width:4px;
  height:152px;
  background-color: #409EFF;
  margin-top: 42px;
  margin-left: 50px;
  float: left;
  top: 150px;
}
.lineTop{
  // margin-top: -10px;
  position: absolute;
  transition-delay:100ms;
  border:1px;
  width:20px;
  height:4px;
  background-color: #409EFF;
  margin-top: -76px;
  margin-left: 245px;
  transform: rotate(45deg);
}
.lineTopVertical{
  position: absolute;
  transition-delay:100ms;
  border:1px;
  width:20px;
  height:4px;
  background-color: #409EFF;
  margin-top: 143px;
  margin-left: -14px;
  transform: rotate(45deg);
}
.lineBottom{
  // margin-top: -10px;
  position: absolute;
  transition-delay:100ms;
  border:1px;
  width:20px;
  height:4px;
  background-color: #409EFF;
  margin-top: -64px;
  margin-left: 245px;
  transform: rotate(-45deg);
}
.lineBottomVertical{
  // margin-top: -10px;
  position: absolute;
  transition-delay:100ms;
  border:1px;
  width:20px;
  height:4px;
  background-color: #409EFF;
  margin-top: 143px;
  margin-left: -2px;
  transform: rotate(-45deg);
}
.gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);

    filter: grayscale(100%);

    filter: gray;
}
</style>
