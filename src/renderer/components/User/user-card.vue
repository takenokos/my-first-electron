<template>
  <el-card shadow="hover">
    <a class="logout-text">登出</a>
    <div class="user-info">
      <div class="avatar"></div>
      <div>
        <p>
          <span>{{user.uname}}</span><span>{{user.user_level}}</span>
        </p>
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'UserCard',
  props: {
    uid: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      user: {}
    }
  }
}
</script>

