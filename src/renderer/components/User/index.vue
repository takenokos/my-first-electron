<template>
  <el-scrollbar class="users">
    <user-card
      v-for="item in users"
      :key="item.uid"
      :user="item"
      class="users__card"
    />
  </el-scrollbar>
</template>
<script>
import UserCard from './user-card'
export default {
  name: 'Users',
  components: {
    UserCard
  },
  data () {
    return {}
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
.users {
  height: 100%;
  .users__card {
    margin: 6px;
  }
}
</style>
