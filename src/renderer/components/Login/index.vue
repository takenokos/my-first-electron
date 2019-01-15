<template>
  <el-dialog
    class="login-dialog"
    title="登陆"
    top="0"
    :visible.sync="dialogVisible"
    @opened="open"
  >
    <!-- <webview
      ref="webview"
      class="login-webview"
      :src="loginSrc"
      :preload="preload"
    /> -->
    <webview
      ref="webview"
      class="login-webview"
      :src="loginSrc"
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        size="mini"
        @click="reloadWeb"
      >重载</el-button>
      <el-button
        size="mini"
        @click="dialogVisible = false"
      >关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import path from 'path'
import { getUserInfo } from '@/api/user'
import { addUser } from '@/utils/users-db'
const defaultSrc = 'http://passport.bilibili.com/ajax/miniLogin/minilogin'
export default {
  name: 'LoginDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // preload: `file://${path.join(__static, '/live.js')}`,
      // loginSrc: 'http://live.bilibili.com/p/eden/rank#/childnav/vitality/0'
      loginSrc: 'http://passport.bilibili.com/ajax/miniLogin/minilogin'
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // open
    open () {
      const webview = this.$refs.webview
      // webview.openDevTools()
      // 当页面加载的时候获取Cookie
      webview.addEventListener('dom-ready', () => {
        let session = webview.getWebContents().session
        session.cookies.get(
          { url: 'http://live.bilibili.com' },
          (err, cookies) => {
            if (err) throw err
            let cookieObj = {}
            cookies.forEach(ele => {
              cookieObj[ele.name] = ele.value
            })
            if (cookieObj.DedeUserID) {
              // DedeUserID 是 用户 uid
              getUserInfo(cookieObj).then(res => {
                const userInfo = res.data
                addUser({
                  uid: cookieObj.DedeUserID,
                  info: userInfo,
                  cookie: cookieObj
                })
                session.clearStorageData({
                  storages: ['cookies']
                })
                this.loginSrc = defaultSrc
                webview.reload()
              })
            }
          }
        )
      })
    },
    // 重载
    reloadWeb () {
      const webview = this.$refs.webview
      this.loginSrc = defaultSrc
      webview.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.login-webview {
  width: 420px;
  height: 490px;
  margin: -112px auto 0 auto;
  border-radius: 8px;
  overflow: hidden;
}
.login-dialog {
  & /deep/ .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  & /deep/ .el-dialog__body {
    overflow: hidden;
    padding: 0;
  }
}
</style>
