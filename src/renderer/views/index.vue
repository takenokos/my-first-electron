<template>
  <div class="main">
    <div class="menu">
      <a
        class="min"
        @click="min"
      >-</a>
    </div>
    hello word
  </div>
</template>
<script>
// const { ipcRenderer } = require('electron')
import { ipcRenderer } from 'electron'
export default {
  name: 'index',
  methods: {
    min () {
      ipcRenderer.send('min-window')
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  position: relative;
  .menu {
    .min {
      cursor: pointer;
    }
  }
}
</style>
