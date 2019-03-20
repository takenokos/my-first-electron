<template>
  <div class="websocket">
    <div class="websocket-top">
      <label>房间号：
        <el-input
          v-model.number="roomId"
          placeholder="房间号"
          size="mini"
          style="width:110px"
        />
      </label>
      <el-button
        :disabled="isLink"
        type="primary"
        size="mini"
        plain
        round
        @click="getTrueRoom"
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
    <div class="websocket-top">
      <label>人气值：{{popularity}}</label>
      <el-input
        v-model="filterKey"
        placeholder="弹幕池过滤"
        size="mini"
        clearable
        style="width:242px"
      />
    </div>
    <div
      ref="danmuBox"
      class="websocket-box"
    >
      <p
        v-for="(msg,index) in danmuShow"
        :key="index"
        v-html="msg"
      />
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
import { addText } from './txt-file'
import { getRoomId, setRoomId } from '@/db/danmu'
import { getTrueRoomId } from '@/api/room'
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
      filterKey: '', // 弹幕池过滤
      wsMessages: ['请先连接房间'], // 弹幕池
      WebSocket: null,
      heartBeat: null, // 心跳定时器
      reConnectNumber: 10 // 重连次数
    }
  },
  computed: {
    danmuShow () {
      return this.wsMessages
        .filter(msg => msg.indexOf(this.filterKey) > -1)
        .map(msg => {
          if (!this.filterKey) {
            return msg
          }
          // 匹配关键字正则
          const replaceReg = new RegExp(this.filterKey, 'g')
          // 高亮替换v-html值
          const replaceHtml =
            '<span class="highlight-text">' + this.filterKey + '</span>'
          // 开始替换
          return msg.replace(replaceReg, replaceHtml)
        })
    },
    trueRoomId () {
      return this.$store.getters.trueRoomId
    }
  },
  created () {
    this.getRoom()
  },
  destroyed () {
    clearInterval(this.heartBeat)
    this.WebSocket = null
  },
  methods: {
    // 获取上次连接的房间号
    getRoom () {
      getRoomId().then(id => {
        this.roomId = id
      })
    },
    // 获取真实房间号
    getTrueRoom () {
      const reg = /^[0-9]*$/
      if (!this.roomId || !reg.test(this.roomId)) {
        this.$message({
          type: 'warning',
          message: '请正确输入房间号'
        })
        return
      }
      this.pushMessage({
        type: 'local',
        text: '连接中...'
      })
      getTrueRoomId(this.roomId).then(res => {
        if (res.msg === 'ok') {
          this.$store.dispatch('setTrueRoomId', res.data.room_id)
          this.pushMessage({
            type: 'local',
            text: `真实房间号:${this.trueRoomId}`
          })
          // 更新本地存储的房间号
          setRoomId(this.roomId)
          // 开始连接
          this.linkRoom()
        } else {
          this.$message({
            type: 'warning',
            message: '房间号无效'
          })
          this.pushMessage({
            type: 'local',
            text: '房间号无效'
          })
        }
      })
    },
    // 连接房间 弹幕池
    linkRoom () {
      // 连接弹幕池
      this.WebSocket = new WebSocket(
        'wss://broadcastlv.chat.bilibili.com:2245/sub'
      )
      this.WebSocket.binaryType = 'arraybuffer'
      // 进房请求
      this.WebSocket.onopen = () => {
        this.sendData(7, JSON.stringify({ roomid: this.trueRoomId }))
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
        this.pushMessage({
          type: 'local',
          text: '连接意外断开，正在尝试重连...'
        })
      } else if (this.reConnectNumber > 0) {
        setTimeout(() => {
          this.linkRoom()
          this.reConnectNumber--
        }, 10000)
      } else {
        this.pushMessage({
          type: 'local',
          text: '重连失败，请稍后再试'
        })
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
            this.pushMessage({
              type: 'local',
              text: '连接成功'
            })

            // 之后发送心跳
            this.sendData(2, '') // 直接发送一次获取人气值
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
          const msgObj = {
            type: 'msg',
            timestamp: body.info[9].ts,
            uname: body.info[2][1],
            text: body.info[1]
          }
          this.pushMessage(msgObj)
          break
        case 'SEND_GIFT': // 礼物消息
          const giftObj = {
            type: 'gift',
            timestamp: body.data.timestamp,
            uname: body.data.uname,
            text: `${body.data.action} ${body.data.num} 个 ${
              body.data.giftName
            }~`
          }
          this.pushMessage(giftObj)
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
        this.pushMessage({
          type: 'local',
          text: '连接已断开'
        })
      }
    },
    // time formate
    newTime (timestamp) {
      const date = new Date(timestamp)
      const h = date.getHours()
      const m = date.getMinutes()
      const s = date.getSeconds()

      const hh = h > 9 ? h : '0' + h
      const mm = m > 9 ? m : '0' + m
      const ss = s > 9 ? s : '0' + s
      return hh + ':' + mm + ':' + ss
    },
    // 弹幕池展示
    pushMessage (param) {
      let text = ''
      const time = this.newTime(
        param.timestamp ? param.timestamp * 1000 : new Date().getTime()
      )
      switch (param.type) {
        case 'local':
          text = param.text
          break
        case 'msg':
          text = `[${time}] ${param.uname}: ${param.text}`
          this.addToFile(text)
          break
        case 'gift':
          text = `[${time}] ${param.uname} ${param.text}`
          break
      }
      this.wsMessages.push(text)
      // 发送 添加弹幕 事件至主线程
      const json = Object.assign({}, param, { time })
      this.$electron.ipcRenderer.send('add-danmu', json)
      // 滚动到底部
      this.$nextTick(() => {
        this.$refs.danmuBox.scrollTop = this.$refs.danmuBox.scrollHeight
      })
    },
    // 弹幕聊天消息保存
    addToFile (text) {
      addText(this.roomId, text)
    }
  }
}
</script>
<style lang="scss" scoped>
.websocket {
  display: flex;
  flex-direction: column;
  .websocket-top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 10px;
    label {
      font-size: 12px;
    }
  }
  .websocket-box {
    border: 1px solid $bili-blue;
    border-radius: 5px;
    height: 100%;
    padding: 5px;
    font-size: 12px;
    overflow-y: auto;
  }
}
</style>
