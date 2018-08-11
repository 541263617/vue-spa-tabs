<template>
  <el-menu
    :default-active="activePath"
    class="el-menu-demo"
    :unique-opened="true"
    mode="horizontal"
    background-color="#324057"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-submenu v-for="menu in navList" :key="menu.path" :index="menu.path" v-if="menu.meta">
      <template slot="title">
        <!-- <i class="el-icon-location"></i>-->
        <span>{{menu.meta.title}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="subMenu in menu.children" v-if="!subMenu.meta.navPath" :key="subMenu.path" @click="pathTo(menu,subMenu)" :index="menu.path+'/'+subMenu.path">{{subMenu.meta.title}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    computed: {
      navList () {
        return this.$store.state.public.navList
      },
      activePath () {
        let route = this.$route
        return route.meta.navPath || route.path
      }
    },
    methods: {
      pathTo (menu, subMenu) {
        if (subMenu.meta.self) {
          this.$router.push(menu.path + '/' + subMenu.path)//看多页签的，只需要看这里。头部导航，点击以后，打开一个页签（请看./page-view的路由监听逻辑)
        } else {
          window.location.href = `${subMenu.path}`
        }
      }
    }
  }
</script>
