<template>
  <div class="websocket">
    <div class="websocket-top">
      <label>房间号：</label>
      <el-input
        style="width:110px;"
        v-model.number="roomId"
        size="mini"
        placeholder="房间号"
      />
      <el-button
        :disabled="isLink"
        type="primary"
        size="mini"
        plain
        round
        @click="linkRoom"
      >连接</el-button>
      <el-button
        :disabled="!isLink"
        type="primary"
        size="mini"
        plain
        round
        @click="disconnectRoom"
      >断开</el-button>
    </div>
    <div class="websocket-box">
      <p
        v-for="(item,index) in wsMessages"
        :key="index"
      >{{item}}</p>
    </div>
  </div>
</template>
<script>
import {
  sendArrayBuffer,
  fixMessage,
  getPopularity,
  getMessage
} from './danmu.js'
import { setTimeout } from 'timers'
export default {
  name: 'WebSocket',
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isLink: false,
      roomId: null,
      popularity: 0, // 人气值
      wsMessages: ['请先连接房间'], // 弹幕池
      WebSocket: null,
      heartBeat: null, // 心跳定时器
      reConnectNumber: 10 // 重连次数
    }
  },
  destroyed () {
    clearInterval(this.heartBeat)
    this.WebSocket = null
  },
  methods: {
    // 连接房间 弹幕池
    linkRoom () {
      if (!this.roomId) {
        this.$message({
          type: 'warning',
          message: '请填写房间号'
        })
        return
      }
      this.wsMessages.push('连接中...')
      // 连接弹幕池
      this.WebSocket = new WebSocket(
        'wss://broadcastlv.chat.bilibili.com:2245/sub'
      )
      this.WebSocket.binaryType = 'arraybuffer'
      // 进房请求
      this.WebSocket.onopen = () => {
        this.sendData(7, JSON.stringify({ roomid: this.roomId }))
      }

      // 接收
      this.WebSocket.onmessage = this.wsOnMessage
      // 关闭?意外断开
      this.WebSocket.onclose = this.reConnect
    },
    // 重新连接
    reConnect () {
      // 尝试重连10次
      if (this.reConnectNumber === 10) {
        this.wsMessages.push('连接意外断开，正在尝试重连...')
      } else if (this.reConnectNumber > 0) {
        setTimeout(() => {
          this.linkRoom()
          this.reConnectNumber--
        }, 10000)
      } else {
        this.wsMessages.push('连接已断开，请稍后再试')
        this.isLink = false
      }
    },
    // ws 回应
    wsOnMessage (event) {
      fixMessage(event).then(res => {
        switch (res.op) {
          case 8: // 进房回应
            this.isLink = true
            this.reConnectNumber = 10
            this.$message({
              type: 'success',
              message: '连接成功'
            })
            this.wsMessages.push('连接成功')

            // 之后发送心跳
            this.heartBeat = setInterval(() => {
              this.sendData(2, '')
            }, 30000)
            break
          case 3: // 心跳回应 会返回人气？
            this.popularity = getPopularity(res.dataView)
            console.log(`当前人气:${this.popularity}`)
            break
          case 5: // 弹幕消息
            const body = getMessage(res)
            console.log(body)
            this.consoleWs(body)
            break
        }
      })
    },
    // 接收的弹幕消息
    consoleWs (body) {
      switch (body.cmd) {
        case 'DANMU_MSG': // 弹幕消息
          const logMsg = `${body.info[2][1]}: ${body.info[1]}`
          console.log(logMsg)
          this.wsMessages.push(logMsg)
          break
        case 'SEND_GIFT': // 礼物消息
          const logGift = `${body.data.uname} ${body.data.action} ${
            body.data.num
          } 个 ${body.data.giftName}`
          console.log(logGift)
          this.wsMessages.push(logGift)
          break
        case 'WELCOME':
          console.log(`欢迎 ${body.data.uname}`)
          break
        case 'WELCOME_GUARD': // 舰长消息
          const getGuardName = index => {
            switch (index) {
              case 1:
                return '总督'
              case 2:
                return '提督'
              case 3:
                return '舰长'
            }
          }
          const guardName = getGuardName(body.data.guard_level)
          console.log(`欢迎 ${guardName} ${body.data.username}`)
          break
        // 此处省略很多其他通知类型
        default:
          console.log(body)
      }
    },
    // 发送消息
    sendData (type, data) {
      const ab = sendArrayBuffer(type, data)
      this.WebSocket.send(ab)
    },
    // 关闭连接
    disconnectRoom () {
      if (this.WebSocket) {
        this.isLink = false
        this.WebSocket.onopen = null
        this.WebSocket.onmessage = null
        this.WebSocket.onclose = null
        clearInterval(this.heartBeat)
        this.WebSocket.close()
        this.$message({
          type: 'info',
          message: '断开连接'
        })
        this.wsMessages.push('连接已断开')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.websocket {
  display: flex;
  flex-direction: column;
  .websocket-top {
    margin-bottom: 10px;
    label {
      font-size: 12px;
    }
    .el-input,
    .el-button {
      margin-left: 10px;
    }
  }
  .websocket-box {
    border: 1px solid $bili-blue;
    border-radius: 5px;
    height: 100%;
    padding: 5px;
    font-size: 12px;
  }
}
</style>
