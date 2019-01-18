<template>
  <div class="index-main">
    <el-row type="flex">
      <el-col :span="16">
        <!-- <el-button @click="addFile">测试写入文件</el-button>
      <el-button @click="readFile">测试读取文件</el-button> -->
        <el-button @click="loginDialogVisible=true">登陆</el-button>
      </el-col>
      <el-col :span="8">
        <div>
          <web-socket />
        </div>
        <div>footer</div>
      </el-col>
      <login-dialog :visible.sync="loginDialogVisible" />
    </el-row>
  </div>
</template>
<script>
import { getUsers } from '@/utils/users-db.js'
import LoginDialog from '@/components/Login/index'
import WebSocket from '@/components/WebSocket/index'
export default {
  name: 'index',
  components: {
    LoginDialog,
    WebSocket
  },
  data () {
    return {
      loginDialogVisible: false
    }
  },
  methods: {
    addFile () {
      // addUser('test', { 'test': 'test' })
    },
    readFile () {
      getUsers().then(data => {
        console.log(data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-main {
  height: 100%;
}
</style>
