<template>
  <el-dialog
    class="login-dialog"
    title="登陆"
    top="0"
    :visible.sync="dialogVisible"
    @opened="open"
  >
    <webview
      ref="webview"
      v-if="dialogVisible"
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
      >刷新</el-button>
      <el-button
        size="mini"
        @click="dialogVisible = false"
      >关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
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
          async (err, cookies) => {
            if (err) throw err
            let cookieObj = {}
            cookies.forEach(ele => {
              cookieObj[ele.name] = ele.value
            })
            if (cookieObj.DedeUserID) {
              // DedeUserID 是 用户 uid
              await this.$store.dispatch('addUser', cookieObj)
              session.clearStorageData({
                storages: ['cookies']
              })
              // webview.reload()
              this.dialogVisible = false
            }
          }
        )
      })
    },
    // 重载
    reloadWeb () {
      this.$refs.webview.reload()
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
