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
      <el-button
        type="primary"
        @click="reloadWeb"
      >重载</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import path from 'path'
import { getUserInfo } from '../../api/login'
import { updateUser } from '../../utils/users'
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
      // preload: `file:${path.resolve(__dirname, './live.js')}`
      preload: `file://${path.join(__static, '/live.js')}`
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
        session.cookies.get({ url: 'http://live.bilibili.com' }, (err, cookies) => {
          if (err) throw err
          let cookieObj = {}
          cookies.forEach(ele => {
            cookieObj[ele.name] = ele.value
          })
          if (cookieObj.DedeUserID) { // DedeUserID 是 用户 uid
            getUserInfo(cookieObj).then(res => {
              const userInfo = res.data
              updateUser(cookieObj.DedeUserID, { info: userInfo, cookie: cookieObj })
              session.clearStorageData({
                'storages': ['cookies']
              })
              webview.reload()
            })
          }
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
