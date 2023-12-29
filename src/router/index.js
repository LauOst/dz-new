import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 *
 * hidden: true                   当设置 true 的时候该路由不会在侧边栏出现
 * alwaysShow: true               当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']     设置该路由进入的权限，支持多个权限叠加
    title: 'title'                设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'/'el-icon-x'  设置该路由的图标
    breadcrumb: false             如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'   当路由设置了该属性，则会高亮相对应的侧边栏
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true, breadcrumb: false }
    }]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'DictData',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/instruct',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:instId(\\d+)',
        component: () => import('@/views/system/instruct/data'),
        name: 'Inst',
        meta: { title: '指令数据', icon: '' }
      }
    ]
  },
  {
    path: '/toolManage',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:toolGroupsId(\\d+)',
        component: (resolve) => require(['@/views/tool/toolManage/data'], resolve),
        name: 'toolData',
        meta: { title: '刀具', icon: '' }
      }
    ]
  },
  {
    path: '/procedure',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:workingProcedureId(\\d+)',
        component: (resolve) => require(['@/views/baseConfig/procedure/data'], resolve),
        name: 'procedureBind',
        meta: { title: '产品检测项绑定', icon: '' }
      }
    ]
  },
  {
    path: '/station',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:stationId(\\d+)/:orderId(\\d+)/:lineId(\\d+)',
        component: (resolve) => require(['@/views/baseConfig/station/data'], resolve),
        name: 'stationBind',
        meta: { title: '产品检测项绑定', icon: '' }
      }
    ]
  },
  {
    path: '/main',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:maintainId(\\d+)',
        component: (resolve) => require(['@/views/maintain/maintain/data'], resolve),
        name: 'MaintainData',
        meta: { title: '保养记录', icon: '' }
      }
    ]
  },
  {
    path: '/shardingSphereJob',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'shardingSphereJobDetail',
        component: () => import('@/views/shardingSphere/shardingSphereJob/data'),
        name: 'ShardingSphereJobDetail',
        meta: { title: '作业详情', icon: '' }
      }
    ]
  },
  {
    path: '/shardingSphereServer',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/shardingSphereServerDetail',
        component: (resolve) => require(['@/views/shardingSphere/shardingSphereServer/serverDetail'], resolve),
        name: 'ShardingSphereServerDetail',
        meta: { title: '服务器维度详情', icon: '' }
      }
    ]
  }
  // 404 page must be placed at the end !!!
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
