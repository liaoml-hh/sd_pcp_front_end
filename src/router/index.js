/* Layout */
import Layout from '@/layout'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/login',
  component: () =>
    import ('@/views/login/index'),
  hidden: true
},

{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},

// {
//   path: '/',
//   component: Layout,
//   redirect: '/palnAndExecute/plan/deliveryPlan'
// },
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [
    {
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'pcp首页' }
    }
  ]
}
// {
//   path: '/versionUpdate',
//   component: () => import('@/views/versionUpdate/index')
  // redirect: '/versionUpdate',
  // children: [
  //   {
  //     path: 'versionUpdate',
  //     name: '条码打印',
  //     component: () => import('@/views/versionUpdate/index'),
  //     meta: { title: '条码打印', icon: 'dashboard' }
  //   }
  // ]
// }
  // {
  //   path: '/barCodePrint',
  //   component: Layout,
  //   redirect: '/barCodePrint',
  //   children: [
  //     {
  //       path: 'barCodePrint',
  //       name: '条码打印',
  //       component: () => import('@/views/palnAndExecute/plan/barCodePrint/index'),
  //       meta: { title: '条码打印', icon: 'dashboard' }
  //     }
  //   ]
  // }
  // {
  //   path: '/palnAndExecute',
  //   component: Layout,
  //   name: '计划与执行',
  //   meta: { title: '计划与执行', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'plan',
  //       name: '计划管理',
  //       component: () => import('@/views/palnAndExecute/plan/index'),
  //       meta: { title: '计划管理', icon: 'table' },
  //       children: [
  //         {
  //           path: 'deliveryPlan',
  //           name: '提货计划',
  //           component: () => import('@/views/palnAndExecute/plan/pickupPlan/index'),
  //           meta: { title: '提货计划', icon: 'table' }
  //         },
  //         {
  //           path: 'distributionPlan',
  //           name: '配送计划',
  //           component: () => import('@/views/palnAndExecute/plan/dispatchPlan/index'),
  //           meta: { title: '配送计划', icon: 'tree' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'execute',
  //       name: '执行管理',
  //       component: () => import('@/views/palnAndExecute/execute/index'),
  //       meta: { title: '执行管理', icon: 'tree' },
  //       children: [
  //         {
  //           path: 'pickupExecute',
  //           name: '提货执行',
  //           component: () => import('@/views/palnAndExecute/execute/pickupExecute/index'),
  //           meta: { title: '提货执行', icon: 'table' }
  //         },
  //         {
  //           path: 'dispatchExecute',
  //           name: '配送执行',
  //           component: () => import('@/views/palnAndExecute/execute/dispatchExecute/index'),
  //           meta: { title: '配送执行', icon: 'tree' }
  //         },
  //         {
  //           path: 'stockUpRecord',
  //           name: '收款记录',
  //           component: () => import('@/views/palnAndExecute/execute/agencyFundPaymentRecord/index'),
  //           meta: { title: '收款记录', icon: 'tree' }
  //         },
  //         {
  //           path: 'signInRecord',
  //           name: '签收记录',
  //           component: () => import('@/views/palnAndExecute/execute/signInRecord/index'),
  //           meta: { title: '签收记录', icon: 'tree' }
  //         }
  //       ]
  //     }
  //   ]
  // },

  // {
  //   path: '/receiptAudit',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'receiptAudit',
  //       name: '回单审核',
  //       component: () => import('@/views/receiptAudit/index'),
  //       meta: { title: '回单审核', icon: 'tree' }
  //     }
  //   ]
  // }
  // {
  //   path: '/transport',
  //   component: Layout,
  //   redirect: '/transport/index',
  //   name: 'transport',
  //   meta: { title: '运单管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'index',
  //       component: () => import('@/views/waybill/index'),
  //       meta: { title: '运单管理', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/finance',
  //   component: Layout,
  //   redirect: '/finance/index',
  //   name: 'finance',
  //   meta: { title: '财务管理', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'index',
  //       component: () => import('@/views/finance/IncomeAudit'),
  //       meta: { title: '收支审核', icon: 'table' }
  //     },
  //     {
  //       path: 'check',
  //       name: 'check',
  //       meta: { title: '对账管理', icon: 'tree' },
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       redirect: 'check/business',
  //       children: [
  //         {
  //           path: 'business',
  //           name: 'business',
  //           component: () => import('@/views/finance/BalanceAccountAr'),
  //           meta: { title: '应收对账', icon: 'table' }
  //         },
  //         {
  //           path: 'employee',
  //           name: 'employee',
  //           component: () => import('@/views/finance/BalanceAccountDue'),
  //           meta: { title: '应付对账', icon: 'table' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'settlement',
  //       name: 'settlement',
  //       component: () => import('@/views/finance/Settlement'),
  //       meta: { title: '结算管理', icon: 'tree' }
  //     }
  //   ]
  // },

  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
