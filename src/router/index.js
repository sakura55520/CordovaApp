import Vue from 'vue'
import Router from 'vue-router'

/*
* name: 'routername'             必须唯一
* meta: {
    HeadsHide: false             默认false, 显示顶部导航栏
    text: '工作中心'              显示在顶部导航栏中的标题名字
    btnReturnHide: false         默认false, 显示后退按钮
    returnPath: '/'              设置后退路径, 默认'/'
  }
* */

Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/',
    name: 'root',
    redirect: '/dashboard',
    hidden: true,
    meta: {text: '工作中心'}
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    component: () => import('@/views/dashboard/index'),
    hidden: true,
    meta: {text: '工作中心', btnReturnHide: true}
  },
  {
    path: '/login',
    name: 'login',
    text: 'login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {text: '登录', HeadsHide: true, btnReturnHide: true, UserHide: true}
  },
  // ------菜单栏------
  {
    name: 'overStation',
    path: '/overStation',
    component: () => import('@/views/overStation/index'),
    hidden: true,
    meta: {text: '过站操作'},
    props: true
  },

  {
    name: 'overStationExecution',
    path: '/overStationExecution',
    component: () => import('@/views/overStationExecution/index'),
    hidden: true,
    meta: {text: '过站操作'},
    props: true
  },

  {
    name: 'outStationExecution',
    path: '/outStationExecution',
    component: () => import('@/views/outStationExecution/index'),
    hidden: true,
    meta: {text: '出站执行'},
    props: true
  },

  {
    name: 'chargeOperate',
    path: '/chargeOperate',
    component: () => import('@/views/chargeOperate'),
    meta: {text: '装料'},
  },

  {
    name: 'crystalDelivery',
    path: '/crystalDelivery',
    component: () => import('@/views/crystalDelivery'),
    meta: {text: '单晶送付'},
  },

  {
    name: 'headAndTailSampling',
    path: '/headAndTailSampling',
    component: () => import('@/views/headAndTailSampling/index'),
    hidden: true,
    meta: {text: '切头尾取样'},
    props: true
  },

  {
    name: 'ingotDetection',
    path: '/ingotDetection',
    component: () => import('@/views/ingotDetection/index'),
    hidden: true,
    meta: {text: '晶锭检验'},
    props: true
  },

  {
    name: 'segmentedInstruction',
    path: '/segmentedInstruction',
    component: () => import('@/views/segmentedInstruction/index'),
    hidden: true,
    meta: {text: '分段指令'},
    props: true
  },

  {
    name: 'cutting',
    path: '/cutting',
    component: () => import('@/views/cutting/index'),
    hidden: true,
    meta: {text: '割断'},
    props: true
  },

  {
    name: 'addParameter',
    path: '/addParameter',
    component: () => import('@/views/addParameter/index'),
    meta: {text: '加参'},
  },


  {
    name: 'warehouseDetection',
    path: '/warehouseDetection',
    component: () => import('@/views/warehouseDetection/index'),
    meta: {text: '入库检测'},
  }
]

export default new Router({
  // mode: 'history',
  routes: constantRouterMap
})
