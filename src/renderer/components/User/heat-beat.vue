<template>
  <el-progress
    type="circle"
    :percentage="tick/dTick"
    status="text"
  >{{time}}</el-progress>
</template>
<script>
import { userHeartBeat } from '@/api/user'
import { setTimeout } from 'timers'
const defaultTick = 300 // 5*60=5m=300s
export default {
  name: 'HeartBeat',
  props: {
    cookie: {
      type: Object,
      default: () => {}
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
    this.heartBeat()
  },
  methods: {
    // 心跳 5m 5*60*1000
    heartBeat () {
      userHeartBeat(this.cookie).then(res => {
        this.$emit('heart-beat')
        this.tick = defaultTick
        return this.timeTick()
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
    }
  }
}
</script>

