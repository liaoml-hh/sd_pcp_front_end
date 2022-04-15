<template>
  <div class="slider">
    <div class="slider-item">
      <i class="el-icon-circle-close" @click="closeSlider" />
      <slide-verify
        :l="42"
        :r="10"
        :w="310"
        :h="155"
        :imgs="imgs"
        :slider-text="text"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Slider',
  data() {
    return {
      msg: '',
      text: '向右滑',
      imgs: [
        require('../../assets/SliderImages/slider (' + Math.round(Math.random() * 72) + ').jpg')
      ]
    }
  },
  methods: {
    onSuccess() {
      this.$emit('SliderSucess')
    },
    onFail() {
      this.msg = ''
    },
    onRefresh() {
      this.msg = ''
    },
    closeSlider() {
      this.$emit('closeSlider')
    }
  }
}
</script>
<style lang="scss" scoped>
.slider{
  position: absolute;
  width:100%;
  height:100vh;
  margin: auto;
  background-color: rgba(0,0,0,0.1);
  color: white;
  z-index:1;

}
.slider-item{
  position: relative;
  width: 350px;
  height:240px;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  padding:10px 20px 20px 20px;
  box-shadow: 0 0 10px rgba(255,255,255,0.8);
  i {
    display: inline-block;
    position: relative;
    left: 300px;
    width:20px;
    height: 20px;
    cursor: pointer;
  }
}
</style>
