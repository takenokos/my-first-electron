<template>
  <el-card
    :shadow="`${user.enable?'hover':'always'}`"
    :class="{'user-danger':!user.enable}"
    class="user-card"
  >
    <div
      slot="header"
      class="user-card__header"
    >
      <el-button
        type="text"
        size="mini"
        class="logout-text"
        @click="logout"
      >{{user.enable?'登出':'删除'}}</el-button>
      <div class="user-info">
        <span
          :style="{'background-image':`url(${info.face})`}"
          class="user-info__avatar"
        />
        <div class="info">
          <p>
            <span>{{info.uname}}</span>
            <span class="user-info__ul">{{info.user_level}}</span>
          </p>
          <p>
            UID:{{info.uid}}
          </p>
        </div>
      </div>
      <el-tooltip
        :content="`经验:${info.user_intimacy}/${info.user_next_intimacy}`"
        placement="top"
      >
        <el-progress :percentage="percentage" />
      </el-tooltip>
    </div>
    <div class="user-operate">
      <heart-beat
        :uid="user.uid"
        :enable="user.enable"
        :cookie="cookie"
      />
    </div>
  </el-card>
</template>
<script>
import HeartBeat from './heat-beat'
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: () => {}
    }
  },
  components: {
    HeartBeat
  },
  computed: {
    info () {
      return this.user.info
    },
    cookie () {
      return this.user.cookie
    },
    percentage () {
      return this.info.user_intimacy
        ? parseFloat(
          (
            (this.info.user_intimacy / this.info.user_next_intimacy) *
              100
          ).toFixed(2)
        )
        : 0
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('deleteUser', this.user.uid)
    }
  }
}
</script>
<style lang="scss" scoped>
.user-card {
  display: inline-block;
  position: relative;
  .logout-text {
    position: absolute;
    right: 2px;
    top: 2px;
    padding: 0;
    color: $bili-danger;
  }
  .user-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    .user-info__avatar {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-size: 100%;
      border-radius: 50%;
      border: 1px solid $bili-blue;
      margin-right: 20px;
    }
    .user-info__ul {
      background-color: $bili-ty;
      color: #fff;
      padding: 0 6px;
      border-radius: 2px;
      font-size: 12px;
    }
  }
  .user-operate {
    text-align: center;
  }
}
.user-danger {
  box-shadow: 0 2px 12px 0 $bili-danger;
  &:hover {
    box-shadow: 0 2px 12px 0 $bili-danger;
  }
}
</style>
