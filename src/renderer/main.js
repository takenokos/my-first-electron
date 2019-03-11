import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css' // 原始的主色调
import '@/css/element-#23ADE5/index.css' // Bilibili 色调

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.use(Element)
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
