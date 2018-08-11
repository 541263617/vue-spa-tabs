import axios from '@/api/interception'
import tools from '@/utils/tools'
import router from '@/router/index'
import qs from 'qs'
import notify from '@/utils/notify'

const state = {
  pageData: {},
  logData: {},
  purchaseOrder: {},
  purchaseOrderEdit: {},
  goodsList: [],
  goodsListEdit: [],
  loading: false,
  purchaseTypes: [],
  purchaseTypesMap: {},
  purchaseOrderStatus: [],
  purchaseOrderStatusMap: {},
  address: [],
  addressMap: {},
  Suppliers: [],
  payTypes: [],
  purchaseGroups: [],
  handlerPriority: [],
  currencyTypes: [],
  warehouse: [],
  transportCostsTake: [],
  purchasePersons: [],
  supplierBrand: [],
  purchaseOrderItem: {}
}

const mutations = {
  updateData (state, payload) {
    state[payload.name] = payload.value
  }
}
const actions = {
  getPurchaseOrderStatus ({commit}) {
    axios({
      method: 'get',
      url: '/select/purchaseOrderStatus'
    }).then((res) => {
      commit('updateData', {
        name: 'purchaseOrderStatus',
        value: res.data.result
      })
      let map = {}
      tools.getMap(res.data.result, map, 'code')
      commit('updateData', {
        name: 'purchaseOrderStatusMap',
        value: map
      })
    })
  },
  getPurchaseTypes ({commit}) {
    axios({
      method: 'get',
      url: '/select/purchaseType'
    }).then((res) => {
      commit('updateData', {
        name: 'purchaseTypes',
        value: res.data.result
      })
      let map = {}
      tools.getMap(res.data.result, map, 'value')
      commit('updateData', {
        name: 'purchaseTypesMap',
        value: map
      })
    })
  },
  getPageData ({commit}, params) {
    commit('updateData', {
      name: 'loading',
      value: true
    })
    axios({
      method: 'get',
      url: '/purchase/purchaseOrderPage',
      params: params
    }).then((res) => {
      commit('updateData', {
        name: 'pageData',
        value: res.data
      })
      commit('updateData', {
        name: 'loading',
        value: false
      })
    })
  },
  getPurchaseOrderById ({commit, dispatch}, id) {
    axios({
      method: 'get',
      url: '/purchase/purchaseOrder/' + id
    }).then((res) => {
      commit('updateData', {
        name: 'purchaseOrder',
        value: res.data.result
      })
    })
  },
  getGoodsList ({commit}, params) {
    axios({
      method: 'get',
      url: '/purchase/purchaseDetail',
      params: params
    }).then((res) => {
      commit('updateData', {
        name: 'goodsList',
        value: res.data
      })
    })
  },
  getPurchaseOrderEditById ({commit, dispatch}, id) {
    axios({
      method: 'get',
      url: '/purchase/purchaseOrder/' + id
    }).then((res) => {
      commit('updateData', {
        name: 'purchaseOrderEdit',
        value: res.data.result
      })
      dispatch('getPurchasePersonById', res.data.result.purchaseGroupCode)
      router.push({path: '/procurement/purchase-order/' + id})
    })
  },
  getGoodsListEdit ({commit}, params) {
    axios({
      method: 'get',
      url: '/purchase/purchaseDetail',
      params: params
    }).then((res) => {
      commit('updateData', {
        name: 'goodsListEdit',
        value: res.data
      })
    })
  },
  getAddress ({commit}) {
    axios({
      method: 'get',
      url: '/metadata/address'
    }).then((res) => {
      let addressMap = {}
      commit('updateData', {
        name: 'address',
        value: res.data
      })
      tools.getMap(res.data, addressMap)
      commit('updateData', {
        name: 'addressMap',
        value: addressMap
      })
    })
  },
  getSuppliers ({commit}) {
    axios({
      method: 'get',
      url: '/purchase/suppliers'
    }).then((res) => {
      commit('updateData', {
        name: 'Suppliers',
        value: res.data.result
      })
    })
  },
  getPayType ({commit}) {
    axios({
      method: 'get',
      url: '/select/payType'
    }).then((res) => {
      commit('updateData', {
        name: 'payTypes',
        value: res.data.result
      })
    })
  },
  getPurchaseGroups ({commit}) {
    axios({
      method: 'get',
      url: '/purchase/purchaseGroups'
    }).then((res) => {
      commit('updateData', {
        name: 'purchaseGroups',
        value: res.data.result
      })
    })
  },
  getHandlerPriority ({commit}) {
    axios({
      method: 'get',
      url: '/select/handlerPriority'
    }).then((res) => {
      commit('updateData', {
        name: 'handlerPriority',
        value: res.data.result
      })
    })
  },
  getCurrencyTypes ({commit}) {
    axios({
      method: 'get',
      url: '/select/currencyType'
    }).then((res) => {
      commit('updateData', {
        name: 'currencyTypes',
        value: res.data.result
      })
    })
  },
  getWarehouse ({commit}) {
    axios({
      method: 'get',
      url: '/purchase/warehouse'
    }).then((res) => {
      commit('updateData', {
        name: 'warehouse',
        value: res.data.result
      })
    })
  },
  getTransportCostsTake ({commit}) {
    axios({
      method: 'get',
      url: '/select/transportCostsTake'
    }).then((res) => {
      commit('updateData', {
        name: 'transportCostsTake',
        value: res.data.result
      })
    })
  },
  getPurchasePersonById ({commit}, purchaseGroupCode) {
    axios({
      method: 'get',
      url: '/purchase/purchasePerson',
      params: {purchaseGroupCode: purchaseGroupCode}
    }).then((res) => {
      commit('updateData', {
        name: 'purchasePersons',
        value: res.data.result
      })
    })
  },
  getPurchaseOrderItem ({commit, state}, params) {
    axios({
      method: 'get',
      url: '/purchase/purchaseOrderItem',
      params: params
    }).then((res) => {
      let arr = {...res.data}
      let arr1 = res.data.result
      let arr2 = state.goodsListEdit
      if (arr1.length > 0 || arr2.length > 0) {
        for (let i = arr1.length - 1; i >= 0; i--) {
          for (let j = 0; j < arr2.length; j++) {
            if (arr1[i].skuCode === arr2[j].skuCode) {
              arr.result.splice(i, 1)
              break
            }
          }
        }
      }
      commit('updateData', {
        name: 'purchaseOrderItem',
        value: arr
      })
    })
  },
  getSupplierBrand ({commit}, supplierCode) {
    axios({
      method: 'get',
      url: '/purchase/supplierBrand/' + supplierCode
    }).then((res) => {
      commit('updateData', {
        name: 'supplierBrand',
        value: res.data.result
      })
    })
  },
  deleteArray ({commit, state}, payload) {
    state[payload.name].splice(payload.index, 1)
    commit('updateData', {
      name: 'goodsListEdit',
      value: state[payload.name]
    })
  },
  saveOrder ({commit, state}, payload) {
    let data = qs.stringify(payload)
    data += `&gridValue=${JSON.stringify(state.goodsListEdit)}`
    axios({
      method: 'PUT',
      url: '/purchase/purchaseOrder/' + payload.id,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: data
    }).then((res) => {
      notify.success(res.data.databuffer)
      router.push({path: router.currentRoute.meta.navPath})
    })
  },
  submitOrder ({commit}, payload) {
    let data = qs.stringify(payload)
    data += `&gridValue=${JSON.stringify(state.goodsListEdit)}`
    axios({
      method: 'PUT',
      url: '/purchase/purchaseOrderAudit/' + payload.id,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: data
    }).then((res) => {
      notify.success(res.data.databuffer)
      router.push({path: router.currentRoute.meta.navPath})
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
