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
  name: 'my-first-electron',
  components: {
    TitleBar
  }
}
</script>
<style lang="scss">
$bili-blue: #23ade5;
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

