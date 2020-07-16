import Vue from 'vue'
import App from './App.vue'
import {Alert, Confirm, Toast, Loading} from 'wc-messagebox'
import 'wc-messagebox/style.css'
import Vconsole from 'vconsole'
let vConsole = new Vconsole()
Vue.use(vConsole)

Vue.use(Alert)
Vue.use(Confirm)
Vue.use(Toast)
Vue.use(Loading)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
