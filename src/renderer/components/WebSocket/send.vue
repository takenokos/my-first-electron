<template>
  <div class="ws-send">
    <el-input
      type="textarea"
      v-model="text"
      clearable
      :rows="3"
      resize="none"
      placeholder="请输入弹幕内容desu~"
      :maxlength="maxlength"
      @keyup.enter.native="send"
    />
    <div class="after-text">
      <el-tooltip :content="content">
        <img
          class="main-user"
          :src="avatar"
          draggable="false"
        />
      </el-tooltip>
      <el-tooltip
        content="切换显示弹幕浮窗"
        placement="top"
      >
        <el-switch
          v-model="showBarrage"
          @change="toggleBarrage"
        >
        </el-switch>
      </el-tooltip>
      <el-button
        :disabled="!user||!trueRoomId||!text"
        type="primary"
        size="mini"
        @click="send"
      >发送</el-button>
    </div>

  </div>
</template>
<script>
import { danmuSend } from '@/api/room'
export default {
  name: 'SocketSend',
  data () {
    return {
      maxlength: 30,
      text: '',
      showBarrage: true
    }
  },
  computed: {
    user () {
      return this.$store.getters.mainUser
    },
    avatar () {
      return this.user
        ? this.user.info.face
        : 'http://static.hdslb.com/images/akari.jpg'
    },
    uname () {
      return this.user ? this.user.info.uname : ''
    },
    uid () {
      return this.user ? this.user.uid : ''
    },
    content () {
      return this.user ? `${this.uname} \n ${this.uid}` : '请选择主用户DA☆ZE~'
    },
    trueRoomId () {
      return this.$store.getters.trueRoomId
    }
  },
  created () {
    this.$store.dispatch('getMainUser')
  },
  methods: {
    // 弹幕发送的方法
    send () {
      if (!this.user || !this.user.enable) {
        this.$message({
          type: 'warning',
          message: '请选择主用户DA☆ZE~'
        })
        return
      }
      const data = {
        color: parseInt('ffffff', 16), // 色号 16 转 10 parseInt('ff9800',16) 此处为白色 num.toString(16) 10转16
        fontsize: 25,
        mode: 1,
        msg: this.text,
        rnd: new Date().getTime() / 1000,
        roomid: this.trueRoomId,
        bubble: 0,
        csrf_token: this.user.cookie.bili_jct,
        csrf: this.user.cookie.bili_jct
      }
      danmuSend(data)
    },
    toggleBarrage (bol) {
      this.$electron.ipcRenderer.send('toggle-barrage', bol)
    }
  }
}
</script>
<style lang="scss" scoped>
.ws-send {
  .after-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .main-user {
    width: 30px;
    height: 30px;
    border: 1px solid $bili-blue;
    border-radius: 50%;
  }
}
</style>
