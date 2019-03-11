<template>
  <el-row
    class="index-main"
    type="flex"
  >
    <el-col
      :span="16"
      class="index-main__left"
    >
      <el-button @click="loginDialogVisible=true">登陆</el-button>
      <users />
    </el-col>
    <el-col
      :span="8"
      class="index-main__right"
    >
      <web-socket class="index-main__ws" />
      <socket-send class="index-main__send" />
    </el-col>
    <login-dialog :visible.sync="loginDialogVisible" />
  </el-row>
</template>
<script>
import LoginDialog from '@/components/Login/index'
import WebSocket from '@/components/WebSocket/index'
import SocketSend from '@/components/WebSocket/send'
import Users from '@/components/User/index'
export default {
  name: 'index',
  components: {
    LoginDialog,
    WebSocket,
    SocketSend,
    Users
  },
  data () {
    return {
      loginDialogVisible: false
    }
  }
}
</script>
<style lang="scss" scoped>
.index-main {
  height: 100%;
  .index-main__left {
    background-color: #fff;
    margin-right: 10px;
  }
  .index-main__right {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .index-main__ws {
      height: 100%;
      padding: 10px;
    }
    .index-main__send {
      padding: 10px;
    }
  }
}
</style>
