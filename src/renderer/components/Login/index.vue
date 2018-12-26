<template>
  <el-dialog
    class="login-dialog"
    title="登陆"
    top="0"
    :visible.sync="dialogVisible"
    :show-close="false"
    @opened="open"
  >
    <webview
      ref="webview"
      class="login-webview"
      src="http://live.bilibili.com/p/eden/rank#/childnav/vitality/0"
      :preload="preload"
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="reloadWeb">重载</el-button>
      <el-button
        type="info"
        @click="dialogVisible = false"
      >取 消</el-button>
      <el-button
        type="primary"
        @click="dialogVisible = false"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import path from 'path'
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
      preload: `file:${path.resolve(__dirname, './live.js')}`
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
      webview.openDevTools()
      // 当页面加载的时候获取Cookie
      webview.addEventListener('dom-ready', () => {
        // webview.openDevTools()
        let session = webview.getWebContents().session
        session.cookies.get({ url: 'http://live.bilibili.com' }, (err, cookies) => {
          if (err) throw err
          let cookieObj = {}
          cookies.forEach(ele => {
            cookieObj[ele.key] = ele.value
          })
          console.log(cookieObj)
          session.clearStorageData({
            'storages': ['cookies']
          })
          // webview.reload()
          // if (cookieStr.indexOf('DedeUserID=') === -1) { // DedeUserID 是 用户 uid
          //   // 未登录
          // } else {
          //   // 已经登录
          //   // $('#iptCookie').val(cookieStr)
          //   session.clearStorageData({
          //     'storages': ['cookies']
          //   })
          //   webview.reload()
          // }
        })
      })
    },
    // 重载
    reloadWeb () {
      const webview = this.$refs.webview
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
</style>

<style scoped>
.login-dialog >>> .el-dialog__body {
  overflow: hidden;
  padding: 0;
}
</style>
