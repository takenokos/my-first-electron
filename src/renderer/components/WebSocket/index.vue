<template>
  <div class="websocket">
    <el-form
      label-width="82px"
      size="mini"
    >
      <el-form-item label="房间号：">
        <el-input
          style="width:92px;"
          v-model.number="roomId"
          size="mini"
          placeholder="房间号"
        />
        <el-button
          type="primary"
          size="mini"
          plain
          round
          @click="linkRoom"
        >连接</el-button>
      </el-form-item>
      <el-form-item label="当前用户：">
        <!-- {{user.name}} -->
      </el-form-item>
    </el-form>
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
      roomId: null,
      messages: ['请先连接房间'],
      WebSocket: null
    }
  },
  destroyed () {
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
      // 连接弹幕池
      this.WebSocket = new WebSocket(
        'wss://broadcastlv.chat.bilibili.com:2245/sub'
      )
      const ws = this.WebSocket
      const _this = this
      // 进房请求
      ws.onopen = () => {
        // ws.send(
        //   encodeURIComponent(
        //     JSON.stringify({
        //       roomid: this.roomId
        //     }),
        //     7
        //   )
        // )
        this.sendData(7, JSON.stringify({ roomid: this.roomId }))
        // 之后发送心跳
        this.heartBeat()
      }

      // 接收
      ws.onmessage = event => {
        _this.readBlob(event.data).then(res => {
          console.log(res)
        })
        // const data = new DataView(event.data)
        // console.log('data:' + data)
        // const packets = decodeURIComponent(data)
        // for (let i = 0; i < packets.length; ++i) {
        //   const packet = packets[i]
        //   switch (packet.op) {
        //     case 8:
        //       console.log('加入房间')
        //       break
        //     case 3:
        //       // const count = decodeInt(packet.data)
        //       // console.log(`人气：${count}`)
        //       break
        //     case 5:
        //       // const body = decodeJson(packet.data)
        //       // switch (body.cmd) {
        //       //   case 'DANMU_MSG':
        //       //     console.log(`${body.info[2][1]}: ${body.info[1]}`)
        //       //     break
        //       //   case 'SEND_GIFT':
        //       //     console.log(
        //       //       `${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`
        //       //     )
        //       //     break
        //       //   case 'WELCOME':
        //       //     console.log(`欢迎 ${body.data.uname}`)
        //       //     break
        //       //   // 此处省略很多其他通知类型
        //       //   default:
        //       //     console.log(body)
        //       // }
        //       break
        //     default:
        //       console.log(packet)
        //   }
        // }
      }
      // 关闭
      ws.onclose = () => {
        ws.onopen = null
        ws.onmessage = null
        clearInterval(this.hbI)
      }
    },
    // 心跳
    heartBeat () {
      // 30s 心跳保持连接
      setInterval(this.hbI, 30000)
    },
    // 心跳定时方法
    hbI () {
      this.sendData(2, '')
    },
    // 发送消息
    sendData (type, data) {
      const totalLen = 16 + data.length
      const headLen = 16
      const bufferData = Buffer.allocUnsafe(totalLen)
      bufferData.writeInt32BE(totalLen, 0)
      bufferData.writeInt16BE(headLen, 4)
      // bufferData.writeInt16BE(version, 6)
      bufferData.writeInt32BE(type, 8)
      // bufferData.writeInt32BE(driver, 12)
      if (data) bufferData.write(data, headLen)
      // if (this._protocol === 'socket' || this._protocol === 'flash') (<Socket>this._client).write(bufferData)
      // else (<ws>this._client).send(bufferData)
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
            return this.getDanmuInfo(dataView, data)
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
            // console.log(bytes2str(recData))
            let body = JSON.parse(this.bytes2str(recData))
            if (body.cmd === 'DANMU_MSG') {
              console.log(body.info[2][1], ':', body.info[1])
              self.fn.call(null, {
                name: body.info[2][1],
                text: body.info[1]
              })
            }
            data.body.push(body)
          } catch (e) {
            // console.log('tcp 校验失败，重新发送')
            reject(e)
          }
        }
        resolve(data)
      })
    },
    // 处理字符串
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
  .el-form-item {
    margin-bottom: 0;
  }
}
.websocket /deep/ .el-form-item__label {
  font-size: 12px;
}
</style>

