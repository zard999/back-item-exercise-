import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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

// 常量路由：所有的用户都能看到的放在这里面
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]

// 异步路由（动态路由）：这里面放的是所有的需要动态设置添加到路由器里面的路由
// 后期我们会根据用户返回的routes数据，从这个数组当中过滤用户自己需要动态展示的路由
export const allAsyncRoutes = [
  // 配商品管理
  {
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    children: [
      {
        path: 'trademark',
        component: () => import('@/views/product/trademark/List.vue'),
        name: 'Trademark',
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        component: () => import('@/views/product/attr/List.vue'),
        name: 'Attr',
        meta: { title: '平台属性管理' }
      },
      {
        path: 'spu',
        component: () => import('@/views/product/spu/List.vue'),
        name: 'Spu',
        meta: { title: 'SPU管理' }
      },
      {
        path: 'sku',
        component: () => import('@/views/product/sku/List.vue'),
        name: 'Sku',
        meta: { title: 'SKU管理' }
      }
    ]
  }
]

// 任意路由：这个路由一定是配置在路由器当中的最后一个
export const anyRoute = { path: '*', redirect: '/404', hidden: true }

const createRouter = () =>
  new Router({
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
