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
import { encode, decode, decodeInt, decodeJson } from 'encode'
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
      messages: ['请先连接房间']
    }
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
      const ws = new WebSocket('wss://broadcastlv.chat.bilibili.com:2245/sub')
      // 进房请求
      ws.on('open', function () {
        ws.send(
          encode(
            JSON.stringify({
              roomid: this.roomId
            }),
            7
          )
        )
      })
      // 30s 心跳保持连接
      setInterval(function () {
        ws.send(encode('', 2))
      }, 30000)
      // 接收
      ws.on('message', function (data) {
        console.log('data:' + data)
        const packets = decode(data)
        for (let i = 0; i < packets.length; ++i) {
          const packet = packets[i]
          switch (packet.op) {
            case 8:
              console.log('加入房间')
              break
            case 3:
              const count = decodeInt(packet.data)
              console.log(`人气：${count}`)
              break
            case 5:
              const body = decodeJson(packet.data)
              switch (body.cmd) {
                case 'DANMU_MSG':
                  console.log(`${body.info[2][1]}: ${body.info[1]}`)
                  break
                case 'SEND_GIFT':
                  console.log(
                    `${body.data.uname} ${body.data.action} ${
                      body.data.num
                    } 个 ${body.data.giftName}`
                  )
                  break
                case 'WELCOME':
                  console.log(`欢迎 ${body.data.uname}`)
                  break
                // 此处省略很多其他通知类型
                default:
                  console.log(body)
              }
              break
            default:
              console.log(packet)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.websocket {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-form-item__label {
    font-size: 12px;
  }
}
</style>

