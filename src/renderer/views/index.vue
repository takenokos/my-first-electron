<template>
  <div class="index-main">
    <users class="index-main__left" />
    <div class="index-main__right">
      <web-socket class="index-main__ws" />
      <socket-send class="index-main__send" />
    </div>
  </div>
</template>
<script>
import WebSocket from '@/components/WebSocket/index'
import SocketSend from '@/components/WebSocket/send'
import Users from '@/components/User/index'
export default {
  name: 'index',
  components: {
    WebSocket,
    SocketSend,
    Users
  }
}
</script>
<style lang="scss" scoped>
.index-main {
  height: 100%;
  .index-main__left {
    margin-right: 10px;
    float: left;
  }
  .index-main__right {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    height: 100%;
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
