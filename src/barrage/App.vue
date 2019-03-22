<template>
  <transition-group
    name="slide-fade"
    class="barrage"
    tag="div"
  >
    <div
      v-for="msg of showList"
      :key="msg.num"
      class="message"
      v-html="msg.text"
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
      this.showList.push({
        text,
        num: json.num
      })
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
  transform: translate3d(0, 0, 0) / translateZ(0);
}
.barrage {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  color: #fabf72;
  .message {
    display: block;
    padding: 2px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .time {
    color: #fc9f9f;
  }
  .uname {
    color: #23ade5;
  }
}
// 过渡动画
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
// end 过渡动画
</style>
