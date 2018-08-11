import Vue from 'vue'
import Router from 'vue-router'
import pageView from '@/components/page-view'
import login from '@/views/account/login'
import channels from '@/views/account/channels'
import goodsInfo from '@/views/goods/goods-info'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: login
    }, {
      path: '/channels',
      component: channels
    }, {
      path: '/goods',
      meta: {
        title: '商品管理',
        vueName: 'goods',
        isLink: false
      },
      component: pageView,
      children: [{
        path: 'goods-info/:id',
        meta: {
          title: '商品详情',
          vueName: 'goods-goods-info',
          isLink: true
        },
        component: goodsInfo
      }]
    }
  ]
})

export default router
