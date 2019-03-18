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
    <el-row
      :gutter="20"
      type="flex"
      justify="space-between"
      class="after-text"
    >
      <el-col :span="6">
        <el-tooltip :content="content">
          <img
            class="main-user"
            :src="avatar"
            draggable="false"
          />
        </el-tooltip>
      </el-col>
      <el-col :span="6">
        <el-button
          type="primary"
          size="mini"
          @click="send"
        >发送</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SocketSend',
  data () {
    return {
      maxlength: 30,
      text: ''
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
      this.text = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.ws-send {
  .after-text {
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
