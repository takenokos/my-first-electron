<template>
  <div class="main">
    <div class="menu">
      <a
        class="min"
        @click="min"
      >-</a>
      <el-button @click="addFile">测试写入文件</el-button>
      <el-button @click="readFile">测试读取文件</el-button>
      <el-button @click="loginDialogVisible=true">登陆</el-button>
    </div>
    <login-dialog :visible.sync="loginDialogVisible" />
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import { readUsers, updateUser } from '../utils/users'
import LoginDialog from '../components/Login/index'
export default {
  name: 'index',
  components: {
    LoginDialog
  },
  data () {
    return {
      loginDialogVisible: false
    }
  },
  methods: {
    min () {
      ipcRenderer.send('min-window')
    },
    addFile () {
      updateUser('test', { 'test': 'test' })
    },
    readFile () {
      readUsers().then(data => {
        console.log(data)
      })
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
