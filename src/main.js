// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import ElementUI from 'element-ui'
import './style/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import notify from '@/utils/notify'
import tableView from './components/table-view.vue'
import paginationView from './components/pagination-view.vue'
import tablePagination from './components/table-pagination.vue'
import logTable from './components/log-table.vue'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('table-view', tableView)
Vue.component('pagination-view', paginationView)
Vue.component('table-pagination', tablePagination)
Vue.component('log-table', logTable)

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

let currentRoute = router.currentRoute
if (currentRoute.path !== '/login' && currentRoute.path !== '/channels') {
  store.dispatch('getNavCode')
}
notify.init(app)

Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
