<template>
  <transition-group
    name="el-fade-in"
    class="barrage"
    tag="div"
  >
    <div
      v-for="(msg,index) of showList"
      :key="index"
      class="message"
      v-html="msg"
    />
  </transition-group>
</template>

<script>
export default {
  name: 'Barrage',
  data () {
    return {
      showList: []
    }
  },
  created () {
    this.$electron.ipcRenderer.on('add-danmu', (event, json) => {
      let text = ''
      switch (json.type) {
        case 'local':
          text = json.text
          break
        case 'msg':
          text = `[<span class="time">${
            json.time
          }</span>] <span class="uname">${json.uname}</span>: ${json.text}`
          break
        case 'gift':
          text = `[<span class="time">${
            json.time
          }</span>] <span class="uname">${json.uname}</span> ${json.text}`
          break
      }
      this.showList.push(text)
      setTimeout(() => {
        this.showList.shift()
      }, 3 * 1000)
    })
  }
}
</script>
<style lang="scss">
body,
html {
  height: 100%;
  overflow: hidden;
  margin: 0;
}
.barrage {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  color: #f77534;
  .message {
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .time {
    color: #f18080;
  }
  .uname {
    color: #23ade5;
  }
}
</style>
