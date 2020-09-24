import Vue from 'vue'
import App from './App.vue'
import {Alert, Confirm, Toast, Loading} from 'wc-messagebox'
import 'wc-messagebox/style.css'
import VueClipboard from 'vue-clipboard2'


Vue.use(Alert)
Vue.use(Confirm)
Vue.use(Toast)
Vue.use(Loading)

Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
