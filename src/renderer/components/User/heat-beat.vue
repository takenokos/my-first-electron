<template>
  <el-progress
    :percentage="(tick/dTick)*100"
    :width="40"
    type="circle"
    title="心跳计时"
    color="#23ade5"
    :format="()=>{return time}"
  />
</template>
<script>
import { userHeartBeat } from '@/api/user'
const defaultTick = 300 // 5*60=5m=300s
export default {
  name: 'HeartBeat',
  props: {
    uid: {
      type: Number,
      default: 0
    },
    enable: {
      type: Boolean,
      default: false
    },
    cookie: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      dTick: defaultTick,
      tick: defaultTick,
      time: '5:00'
    }
  },
  mounted () {
    if (!this.enable) {
      this.time = '失效'
      return
    }
    this.timeTick()
  },
  methods: {
    // 心跳 5m 5*60*1000
    heartBeat () {
      if (!this.enable) {
        return
      }
      userHeartBeat(this.cookie)
        .then(res => {
          console.log('heart-beat', res)
          if (res.code !== 0) {
            this.setUserEnable()
            return
          }
          this.$emit('heart-beat')
          this.tick = defaultTick
          this.timeTick()
        })
        .catch((err) => {
          console.log('heart-beat', err)
          this.setUserEnable()
        })
    },
    // 定时器
    timeTick () {
      // 归0 发送心跳
      if (this.tick === 0) {
        return this.heartBeat()
      }
      // 显示的时间
      const m = parseInt(this.tick / 60)
      const s = this.tick - m * 60
      const ss = s < 10 ? `0${s}` : s
      this.time = `${m}:${ss}`
      // 定时 -1s
      setTimeout(() => {
        this.tick--
        this.timeTick()
      }, 1000)
    },
    // 用户信息失效处理
    setUserEnable () {
      this.time = '失效'
      this.$store.dispatch('updateUserData', {
        uid: this.uid,
        enable: false
      })
    }
    // 这里大概要加刷新用户信息的方法
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-progress__text {
  font-size: 12px !important;
}
</style>
