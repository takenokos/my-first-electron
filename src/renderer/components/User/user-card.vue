<template>
  <el-card
    :shadow="user.enable?'hover':'always'"
    :class="{'user-danger':!user.enable}"
    :body-style="{padding:'0'}"
    class="user-card"
  >
    <div
      slot="header"
      class="user-card__header"
    >
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
    <div class="user-status">
      <heart-beat
        :uid="user.uid"
        :enable="user.enable"
        :cookie="cookie"
      />
      <el-tag :type="user.enable?'success':'danger'">{{user.enable?'正常':'已失效'}}</el-tag>
    </div>
    <div class="user-operate">
      <el-button
        :type="isMain?'success':'warning'"
        size="mini"
        @click="updateMain"
      >{{isMain?'撤销主用户':'设为主用户'}}</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="logout"
      >{{user.enable?'登出':'删除'}}</el-button>
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
    },
    isMain () {
      return this.$store.getters.isMain(this.user.uid)
    }
  },
  methods: {
    // 主用户操作
    updateMain () {
      this.$store.dispatch('updateMainUser', this.isMain ? -1 : this.user.uid)
    },
    // 登出
    logout () {
      this.$store.dispatch('deleteUser', this.user.uid)
    }
  }
}
</script>
<style lang="scss" scoped>
.user-card {
  display: inline-block;
  width: 188px;
  margin: 6px;
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
  .user-status {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #eee;
  }
  .user-operate {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 6px;
    .el-button {
      margin-top: 6px;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
.user-danger {
  box-shadow: 0 2px 12px 0 $bili-danger;
  &:hover {
    box-shadow: 0 2px 12px 0 $bili-danger;
  }
}
</style>
