<template>
  <div id="app">
    <title-bar />
    <div class="router-main">
      <router-view />
    </div>
  </div>
</template>

<script>
import TitleBar from '@/views/layout/title-bar'
export default {
  name: 'bililive-pigeon',
  components: {
    TitleBar
  }
}
</script>
<style lang="scss">
body,
html {
  height: 100%;
  overflow: hidden;
  color: #666;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 自定义滚动条 */
// 滚动条整体
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: transparent;
}
// 滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}
// 滚动条的轨道
::-webkit-scrollbar-track {
  display: none;
}
/* end 自定义滚动条 */

#app {
  display: flex;
  flex-direction: column;
  background-color: $bili-blue;
  height: 100%;
  .router-main {
    height: 100%;
    margin: 0 4px 4px 4px;
    padding: 4px;
    background-color: #eee;
    overflow: hidden;
  }
}
</style>

