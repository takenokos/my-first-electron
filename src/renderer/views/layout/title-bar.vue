<template>
  <div class="title-bar">
    <i class="bililive bililive-tv" />BiliLive弹幕发送
    <span class="btn-bar">
      <el-button
        type="text"
        icon="el-icon-minus"
        @click="min"
      />
      <el-button
        type="text"
        icon="el-icon-close"
        @click="close"
      />
    </span>
  </div>
</template>
<script>
export default {
  name: 'TitleBar',
  methods: {
    min () {
      this.$electron.ipcRenderer.send('min-window')
    },
    close () {
      this.$electron.ipcRenderer.send('hide-window')
    }
  }
}
</script>
<style lang="scss" scoped>
.title-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px 4px;
  color: #fff;
  font-size: 14px;
  position: relative;
  -webkit-app-region: drag;
  .bililive-tv {
    margin-right: 4px;
  }
  .btn-bar {
    -webkit-app-region: no-drag;
    position: absolute;
    right: 0;
    .el-button--text {
      color: #fff;
      padding: 0;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>
