const state = {
  tabList: [],
  activeIndex: '/',
  deleteIndex: 0,
  cacheList: []
}
const mutations = {
  setActiveIndex (state, index) {
    state.activeIndex = index
  },
  addTabs (state, data) {
    state.cacheList.push(data.vueName)
    state.tabList.push(data)
  },
  deleteTab (state, tabName) {
    for (let index in state.tabList) {
      if (state.tabList[index].path === tabName) {
        state.tabList.splice(index, 1)
        state.cacheList.splice(index, 1)
        state.deleteIndex = index
        break
      }
    }
  }
}
const actions = {}

export default {
  state,
  mutations,
  actions
}
