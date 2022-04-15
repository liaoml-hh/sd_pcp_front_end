<template>
  <div class="topGrid">
    <dv-border-box-12 class="center_top_border">
      累计收入数据
      <div class="money">
        {{ totalincome }}
        <div style="font-size:12px;margin-top:0px;">元</div>
      </div>
    </dv-border-box-12>
    <div />
    <dv-border-box-12 class="center_top_border">
      当日收入数据
      <div class="money">
        {{ todayincome }}
        <div style="font-size:12px;margin-top:0px;">元</div>
      </div>
    </dv-border-box-12>
  </div>
</template>

<script>
import { allsumprice, todaysumprice } from '@/api/exchangeOrder/index'
export default {
  components: {
  },
  data() {
    return {
      totalincome: '', // 累计收入
      todayincome: '', // 当日收入
      Interval: null
    }
  },
  mounted() {
    this.initData()
    this.Interval = setInterval(this.initData, 3 * 60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.Interval)
  },
  methods: {
    initData() {
      this.$bus.$emit('initLoad', true)
      // 查询累计收入数据
      allsumprice().then(response => {
        this.totalincome = response
        if (response === undefined) {
          this.totalincome = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })

      // 查询当日收入数据0
      this.$bus.$emit('initLoad', false)
      todaysumprice().then(response => {
        this.todayincome = response
        if (response === undefined) {
          this.todayincome = 0
        }
      }).catch(() => {
        this.$message.error('网络异常')
      }).finally(() => {
        this.$bus.$emit('initLoad', false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .topGrid{
    display: grid;
    grid-template-columns: repeat( 5 , 1fr );
    // margin-top: 100px;
    // margin-left: 80px;
    // height: 87px;
    z-index: 1;
    margin: auto;
    color: white;
    .center_top_border{
      grid-column: span 2 / auto;
      grid-row: span 2 / auto;
      width: 200px;
      height: 90px;
      border: 1px solid #021132;
      padding: 10px 0;
      text-align: center;
      .money{
        margin-top: 10px;
        font-size: 24px;
        letter-spacing: 2px;
        color:#00d7ff;
      }
    }
  }

</style>
