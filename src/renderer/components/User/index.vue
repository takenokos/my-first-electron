<template>
  <div class="scroll">
    <div class="users">
      <el-card
        :body-style="{height:'100%',padding:'0'}"
        shadow="hover"
        class="user-add"
      >
        <el-button
          icon="el-icon-plus"
          @click="loginDialogVisible=true"
        >添加用户</el-button>
      </el-card>
      <user-card
        v-for="item in users"
        :key="item.uid"
        :user="item"
        class="users__card"
      />
      <login-dialog :visible.sync="loginDialogVisible" />
    </div>
  </div>
</template>
<script>
import UserCard from './user-card'
import LoginDialog from '@/components/Login/index'
export default {
  name: 'Users',
  components: {
    LoginDialog,
    UserCard
  },
  data () {
    return {
      loginDialogVisible: false
    }
  },
  computed: {
    users () {
      return this.$store.getters.users
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.$store.dispatch('getUsers')
    }
  }
}
</script>
<style lang="scss" scoped>
.scroll {
  height: 100%;
  width: 612px;
  background-color: #fff;
  overflow-y: auto;
}
.users {
  display: flex;
  flex-wrap: wrap;
  .user-add {
    display: inline-block;
    width: 188px;
    margin: 6px;
    .el-button {
      height: 100%;
      width: 100%;
      border: none;
      font-size: 16px;
    }
  }
}
</style>
