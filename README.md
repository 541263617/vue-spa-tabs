# vue-spa-tabs

> 这是一个基于vue、element-ui的多页签spa应用，请忽略其中非关键代码。

## 安装

``` bash
# 下载依赖
npm install

# 运行
npm run dev

# 首页地址
http://localhost:8080/#/goods
```
## 关键代码
* ./components/side-nav，这是顶部导航，点击导航触发路由跳转
* ./components/page-view，页面容器，watch @route：这是多页签关键部分，请了解一下computed get、set后阅读，不然看着比较费劲。
  * tabList：多页签列表，当路由触发时，会是否已经在页签中，是：跳转到已经页签的路由；否：新增一个页签并打开。
  * cacheList：keepAlive缓存列表，防止点击页签的时候触发vue生命周期。
* ./vuex/public.js：公共方法，addTab，setActiveIndex，getNavCode等等。
* 代码中有不少问题，请忽略，有更好方案欢迎交流。

# vue-spa-tabs
