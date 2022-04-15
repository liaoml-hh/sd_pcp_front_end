<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!--        用户信息框-->
        <!-- <user-info-item :avatar="this.$store.getters.avatar" :user-name="this.$store.getters.name" :is-collapse="isCollapse" /> -->
        <!-- <user-info-item :avatar="this.$store.getters.avatar" :user-name="this.userName" :is-collapse="isCollapse" /> -->
        <user-info-item :avatar="logo" :user-name="this.userName" :is-collapse="isCollapse" />
        <!--        菜单搜索-->
        <menu-search :is-collapse="isCollapse" />
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import UserInfoItem from '@/layout/components/Sidebar/UserInfoItem'
import MenuSearch from '@/layout/components/Sidebar/MenuSearch'

export default {
  components: { MenuSearch, UserInfoItem, SidebarItem, Logo },
  data() {
    return {
      userName: this.$store.getters.name,
      logo: require('../../../assets/404_images/powerS.jpg')
      // userName: 'OMP系统'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
