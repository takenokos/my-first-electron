import Vue from 'vue'
import Barrage from './App'
import 'element-ui/lib/theme-chalk/base.css'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
new Vue({
  components: { Barrage },
  template: '<Barrage/>'
}).$mount('#app')
