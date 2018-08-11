import Vue from 'vue'
import Vuex from 'vuex'

import _public from './public'
import tabs from './tabs'
import purchaseOrder from './procurement/purchase-order'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    public: _public,
    tabs,
    purchaseOrder
  }
})
