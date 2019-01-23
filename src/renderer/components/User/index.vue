<template>
  <div class="users">
    <user-card
      v-for="item in users"
      :key="item"
      :uid="item"
    />
  </div>
</template>
<script>
import { getUsers } from '@/utils/users-db.js'
import UserCard from './user-card'
export default {
  name: 'Users',
  components: {
    UserCard
  },
  data () {
    return {
      users: []
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      getUsers().then(data => {
        this.users = data
      })
    }
  }
}
</script>
