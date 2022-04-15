import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import addRoutesByResources from '@/utils/routes-add'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
router.onReady(() => {
  console.log(store.getters.resources)
  // 加载路由
  if (store.getters.resources) {
    // 动态添加路由
    console.log(store.getters.resources)
    const resources = store.getters.resources
    addRoutesByResources(resources)
  }
  // 此处注意：通配符 '*' 不能在默认路由router/index.js里面添加，否则会造成刷新页面404等错误
  router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
  // }
})

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  console.log('router-check-token', hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          // 需要在store添加对应方法、参数，并且需要在Commit之后调用
          if (store.getters.resources) {
            // 动态添加路由

            console.log(store.getters.resources)
            const resources = store.getters.resources
            // 根据资源列表添加路由
            addRoutesByResources(resources)
          }
          // 此处注意：通配符 '*' 不能在默认路由router/index.js里面添加，否则会造成刷新页面404等错误
          router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          await store.dispatch('user/resetCodeAndAccount')
          Message.error(error || 'Has Error')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // next()
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
