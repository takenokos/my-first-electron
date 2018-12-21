<template>
  <div class="main">
    <div class="menu">
      <a
        class="min"
        @click="min"
      >-</a>
      <el-button @click="addEstore">添加estore</el-button>
    </div>
    hello word
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import estore from '../utils/estore.js'
export default {
  name: 'index',
  methods: {
    min () {
      ipcRenderer.send('min-window')
    },
    addEstore () {
      // this.$estore.set('unicorn', '🦄')
      // console.log(this.$estore.get('unicorn'))
      // estore.set('unicorn', '🦄')
      console.log(estore.get('unicorn'))
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
