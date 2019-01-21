<template>
  <el-card shadow="hover">
    <a class="logout-text">登出</a>
    <div class="user-info">
      <div class="avatar"></div>
      <div>
        <p>
          <span>{{user.uname}}</span><span>{{user.user_level}}</span>
        </p>
        <p>
          <el-tooltip :content="`经验:${user.level_intimacy}/${user.next_level_intimacy}`">
            <el-progress
              :percentage="user.level_intimacy/user.next_level_intimacy"
              show-text
            />
          </el-tooltip>
        </p>
      </div>
    </div>
  </el-card>
</template>
<script>
import { getUser } from '@/utils/users-db'
import { getUserInfo } from '@/api/user'
import HeartBeat from './heat-beat'
export default {
  name: 'UserCard',
  props: {
    uid: {
      type: Number,
      required: true
    }
  },
  components: {
    HeartBeat
  },
  data () {
    return {
      user: {},
      dbUser: {}
    }
  },
  created () {
    this.getCookie()
  },
  methods: {
    // db数据
    getCookie () {
      getUser(this.uid).then(data => {
        this.dbUser = data
        return this.getUserInfo()
      })
    },
    // api 获取远端用户信息
    getUserInfo () {
      getUserInfo(this.dbUser.cookie).then(res => {
        this.user = res.data
      })
    }
  }
}
</script>

