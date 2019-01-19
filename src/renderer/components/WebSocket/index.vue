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
    <div class="websocket-box">Main</div>
  </div>
</template>
<script>
const dataStruct = [
  {
    name: 'Header Length',
    key: 'headerLen',
    bytes: 2,
    offset: 4,
    value: 16
  },
  {
    name: 'Protocol Version',
    key: 'ver',
    bytes: 2,
    offset: 6,
    value: 1
  },
  {
    name: 'Operation',
    key: 'op',
    bytes: 4,
    offset: 8,
    value: 1
  },
  {
    name: 'Sequence Id',
    key: 'seq',
    bytes: 4,
    offset: 12,
    value: 1
  }
]
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
      wsMessages: ['请先连接房间'],
      WebSocket: null,
      heartBeat: null // 心跳定时器
    }
  },
  destroyed () {
    clearInterval(this.heartBeat)
    this.WebSocket = null
  },
  methods: {
    // 关闭连接
    disconnectRoom () {
      this.WebSocket && this.WebSocket.close()
    },
    // 连接房间 弹幕池
    linkRoom () {
      if (!this.roomId) {
        this.$message({
          type: 'warning',
          message: '请填写房间号'
        })
        return
      }
      // 连接弹幕池
      this.WebSocket = new WebSocket(
        'wss://broadcastlv.chat.bilibili.com:2245/sub'
      )
      const ws = this.WebSocket
      const _this = this
      // 进房请求
      ws.onopen = () => {
        this.sendData(7, JSON.stringify({ roomid: this.roomId }))
        // 之后发送心跳
        this.heartBeat = setInterval(() => {
          this.sendData(2, '')
        }, 30000)
      }

      // 接收
      ws.onmessage = event => {
        _this.readBlob(event.data).then(res => {
          console.log(res)
          // for (let i = 0; i < packets.length; ++i) {
          switch (res.op) {
            case 8: // 进房回应
              this.isLink = true
              this.$message({
                type: 'success',
                message: '连接成功'
              })
              break
            case 3: // 心跳回应 会返回人气？
              console.log('心跳：' + res)
              break
            case 5: // 弹幕消息
              this.consoleWs(res.body)
              break
          }
        })
      }
      // 关闭
      ws.onclose = () => {
        this.isLink = true
        ws.onopen = null
        ws.onmessage = null
        clearInterval(this.heartBeat)
        this.$message({
          type: 'info',
          message: '断开连接'
        })
      }
    },
    // 接收的弹幕消息
    consoleWs (body) {
      // const body = decodeJson(packet.data)
      switch (body.cmd) {
        case 'DANMU_MSG':
          console.log(`${body.info[2][1]}: ${body.info[1]}`)
          break
        case 'SEND_GIFT':
          console.log(
            `${body.data.uname} ${body.data.action} ${body.data.num} 个 ${
              body.data.giftName
            }`
          )
          break
        case 'WELCOME':
          console.log(`欢迎 ${body.data.uname}`)
          break
        // 此处省略很多其他通知类型
        default:
          console.log(body)
      }
    },
    // 发送消息
    sendData (type, data) {
      const totalLen = 16 + data.length
      const headLen = 16
      const version = 1 // version ? 客户端版本？
      const driver = 0 // driver ? 客户端设备？ 0|1
      const bufferData = Buffer.allocUnsafe(totalLen)
      bufferData.writeInt32BE(totalLen, 0)
      bufferData.writeInt16BE(headLen, 4)
      bufferData.writeInt16BE(version, 6)
      bufferData.writeInt32BE(type, 8)
      bufferData.writeInt32BE(driver, 12)
      if (data) bufferData.write(data, headLen)
      this.WebSocket.send(bufferData)
    },
    // 以下方法 参考 https://github.com/LeeeeeeM/bilibili-web-socket/blob/master/biWebSock.js
    // 读取blob消息 返回ArrayBuffer
    readBlob (blob) {
      return new Promise(resolve => {
        const reader = new FileReader()
        // This fires after the blob has been read/loaded.
        reader.onloadend = e => {
          const result = e.srcElement.result
          const dataView = new DataView(result)
          let data = {}
          data.packetLen = dataView.getUint32(0)
          dataStruct.forEach(item => {
            if (item.bytes === 4) {
              data[item.key] = dataView.getUint32(item.offset)
            } else if (item.bytes === 2) {
              data[item.key] = dataView.getUint16(item.offset)
            }
          })
          if (data.op && data.op === 5) {
            resolve(this.getDanmuInfo(dataView, data))
          } else {
            resolve(data)
          }
        }
        // Start reading the blob as text.
        reader.readAsArrayBuffer(blob)
      })
    },
    // 校验 获取 弹幕信息
    getDanmuInfo (dataView, data) {
      return new Promise((resolve, reject) => {
        data.body = []
        let packetLen = data.packetLen
        let headerLen = data.headerLen
        for (
          let offset = 0;
          offset < dataView.byteLength;
          offset += packetLen
        ) {
          packetLen = dataView.getUint32(offset)
          headerLen = dataView.getUint16(offset + 4)

          let recData = []
          for (let i = headerLen; i < packetLen; i++) {
            recData.push(dataView.getUint8(i))
          }
          try {
            const body = JSON.parse(this.bytes2str(recData))
            data.body.push(body)
          } catch (e) {
            // console.log('tcp 校验失败，重新发送')
            reject(e)
          }
        }
        resolve(data)
      })
    },
    // 处理字符串 接收的信息
    bytes2str (array) {
      let __array = array.slice(0)
      let j
      let filterArray = [
        [0x7f],
        [0x1f, 0x3f],
        [0x0f, 0x3f, 0x3f],
        [0x07, 0x3f, 0x3f, 0x3f]
      ]
      let str = ''
      for (let i = 0; i < __array.length; i = i + j) {
        let item = __array[i]
        let number = ''
        if (item >= 240) {
          j = 4
        } else if (item >= 224) {
          j = 3
        } else if (item >= 192) {
          j = 2
        } else if (item < 128) {
          j = 1
        }
        let filter = filterArray[j - 1]
        for (let k = 0; k < j; k++) {
          let r = (__array[i + k] & filter[k]).toString(2)
          let l = r.length
          if (l > 6) {
            number = r
            break
          }
          for (let n = 0; n < 6 - l; n++) {
            r = '0' + r
          }
          number = number + r
        }
        str = str + String.fromCharCode(parseInt(number, 2))
      }
      return str
    }
  }
}
</script>
<style lang="scss" scoped>
.websocket {
  display: flex;
  flex-direction: column;
  .websocket-top {
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
  }
}
</style>
