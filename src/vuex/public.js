import axios from '@/api/interception'
import qs from 'qs'
import notify from '@/utils/notify'
import navStatic from '@/assets/nav-config.json'
import router from '@/router/index'

const array2map = (array, result) => {
  array.map((val) => {
    result[val.code] = {...val, 'isLink': !val.children}
    if (val.children) {
      array2map(val.children, result)
    }
  })
}
const createRoute = (parent, child, action) => {
  let param
  let actionName
  let componentName
  switch (action) {
    case 'add':
      param = '/add'
      actionName = '新增'
      componentName = `-${action}`
      break
    case 'edit':
      param = '/:id'
      actionName = '编辑'
      componentName = `-${action}`
      break
    default:
      param = ''
      actionName = ''
      componentName = ''
  }
  let result = {
    path: child.path + param,
    meta: {
      title: child.name,
      self: child.self,
      vueName: `${parent.path}-${child.path}`,
      isLink: !child.children
    },
    component: () => import(`@/views/${parent.path}/${child.path}${componentName}`)
  }
  if (action) {
    result.meta.title += `-${actionName}`
    result.meta.navPath = `/${parent.path}/${child.path}`
  }
  return result
}

const state = {
  publicKey: '',
  channelList: [],
  navList: []
}
const mutations = {
  updateData(state, payload) {
    state[payload.name] = payload.value
  }
}
const actions = {
  getPublicKey({commit}) {
    axios({
      method: 'get',
      url: '/account/user/encrypt/pub_key'
    }).then((res) => {
      commit('updateData', {
        name: 'publicKey',
        value: res.data.pub_key
      })
    })
  },
  login({dispatch}, payload) {
    axios({
      method: 'post',
      url: '/account/user/encrypt/login',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: qs.stringify(payload)
    }).then((res) => {
      router.push({path: '/channels'})
      notify.success('登录成功！')
    })
  },
  getChannel({commit, dispatch}) {
    axios({
      method: 'get',
      url: 'api/jurisdictionUserChannel'
    }).then((res) => {
      let result = res.data.result
      if (!result || result.length === 0) {
        notify.error('员工没有分配业务线！')
        return
      }
      commit('updateData', {
        name: 'channelList',
        value: result
      })
      if (result[0].userType === 'overallUser') {
        dispatch('getNavCode', true)
      } else if (result.length === 1) {
        dispatch('setChannel', {channelCode: result[0].channelCode})
      }
    })
  },
  setChannel({dispatch}, params) {
    axios({
      method: 'get',
      url: 'api/confirmUser',
      params: params
    }).then((res) => {
      notify.success('业务线设置成功！')
      dispatch('getNavCode', true)
    })
  },
  getNavCode({commit}, flag) {
    /*axios({
      method: 'get',
      url: '/accredit/jurisdictionHtml'
    }).then((res) => {
    })*/
    //navCode=res.data.result[0]本来这服务端数据，为了个小伙伴们看效果，就这么写死算了。
    //从服务器获取不同用户权限，然后对应前端导航。
    let navCode = [
      {
        parentCode: '203',
        codeList: ['20302']
      },
      {
        parentCode: '204',
        codeList: ['20402']
      },
      {
        parentCode: '205',
        codeList: ['20501']
      }
    ]
    let navList = []
    let navMap = {}
    array2map(navStatic, navMap)
    navCode.map((val) => {
      let parent = navMap[val.parentCode]
      console.log(parent)
      if (parent) {
        let menu = {
          path: `/${parent.path}`,
          meta: {
            title: parent.name,
            vueName: parent.path,
            isLink: parent.isLink
          }
        }
        if (!parent.isLink) {
          menu.component = () => import('@/components/page-view')//这里有.default应该也是可以的
          menu.children = []
          val.codeList.map((val) => {
            let child = navMap[val]
            if (child) {
              let subMenu = createRoute(parent, child, '')
              menu.children.push(subMenu)
              if (child.path === 'purchase-order') {
                let subMenuAdd = createRoute(parent, child, 'add')
                let subMenuEdit = createRoute(parent, child, 'edit')
                menu.children.push(subMenuAdd, subMenuEdit)
              }
            }
          })
        }

        console.log(menu)
        navList.push(menu)
      }
    })
    if (!navList.length) {
      notify.success('导航栏为空！')
      return
    }
    navList.push({
      path: '*',
      redirect: navList[0].path
    })
    commit('updateData', {
      name: 'navList',
      value: navList
    })
    router.addRoutes(navList)//添加路由
    if (flag) {
      let path = navList[0].path
      if (navList[0].children.length) {
        path += '/' + navList[0].children[0].path
      }
      router.push({path: path})
    }
  },
  exportReport(content, payload) {
    window.open(`/scm-web/${payload.url}?${qs.stringify(payload.params)}`)
  }
}

export default {
  state,
  mutations,
  actions
}
