<template>
  <el-card shadow="hover">
    <a class="logout-text">登出</a>
    <div class="user-info">
      <div class="avatar"></div>
      <div>
        <p>
          <span>{{user.uname}}</span><span>{{user.user_level}}</span><span>{{user.uid}}</span>
        </p>
        <p>
          <el-tooltip :content="`经验:${user.user_intimacy}/${user.user_next_intimacy}`">
            <el-progress
              :percentage="percentage"
              text-inside
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
  computed: {
    percentage () {
      return this.user.user_intimacy
        ? parseFloat(
          (
            (this.user.user_intimacy / this.user.user_next_intimacy) *
              100
          ).toFixed(2)
        )
        : 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getCookie()
    })
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

