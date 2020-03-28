<template>
  <div class="index-main">
    <el-tabs
      class="index-main__left"
      type="card"
      v-model="activeName"
    >
      <el-tab-pane
        label="用户管理"
        name="Users"
      >
        <users />
      </el-tab-pane>
      <el-tab-pane
        label="礼物统计"
        name="Gifts"
      >
        礼物统计
      </el-tab-pane>
      <el-tab-pane
        label="配置管理"
        name="Settings"
      >配置管理</el-tab-pane>
    </el-tabs>

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
  },
  data () {
    return {
      activeName: 'Users'
    }
  }
}
</script>
<style lang="scss" scoped>
.index-main {
  height: 100%;
  .index-main__left {
    margin-right: 10px;
    float: left;
    background-color: #fff;
    width: 612px;
    height: 100%;
    /deep/ .el-tabs__content {
      height: calc(100% - 55px);
      .el-tab-pane {
        height: 100%;
        overflow: auto;
        padding: 6px;
      }
    }
    /deep/ .el-tabs__header {
      margin-bottom: 6px;
    }
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
